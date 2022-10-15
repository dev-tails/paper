import {
  addBlock,
  getAllBlocks,
  Block,
  updateBlock,
  removeBlock,
} from "./db/db";
import { Header } from "./Header";
import { setStyle } from "./setStyle";

async function init() {
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.register("serviceworker.js");
  // }

  const root = document.getElementById("root");
  if (!root) {
    return;
  }

  const canvas = document.createElement("canvas");
  setStyle(canvas, {
    width: "100%",
    height: "100%",
  });
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) {
    alert("Cannot find 2d context");
    return;
  }

  ctx.translate(0.5, 0.5);

  const blocks = await getAllBlocks();
  let currentBlockIndex = -1;

  const setBlock = (block: Block) => {
    currentBlock = block;

    redraw();
  };

  const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const drawing of currentBlock?.data?.drawings || []) {
      ctx.beginPath();
      let isFirstPoint = true;
      for (const point of drawing.points) {
        if (isFirstPoint) {
          ctx.moveTo(point.x, point.y);
          isFirstPoint = false;
        } else {
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }
    }
  }

  function handleLeft() {
    if (currentBlockIndex > 0) {
      currentBlockIndex--;
      setBlock(sortedBlocks[currentBlockIndex]);
    }
  }

  function handleRight() {
    if (currentBlockIndex < sortedBlocks.length - 1) {
      currentBlockIndex++;
    }
    setBlock(sortedBlocks[currentBlockIndex]);
  }

  async function handleNewBlock() {
    const newBlock = await addBlock({
      data: {
        drawings: [],
      },
    });
    sortedBlocks.push(newBlock);
    currentBlockIndex++;
    setBlock(newBlock);
  }

  let currentTool = "pencil";

  const header = Header({
    onLeftClicked: handleLeft,
    onRightClicked: handleRight,
    async onDeleteClicked() {
      await removeBlock(currentBlock.localId);
      sortedBlocks = sortedBlocks.filter((b) => {
        return b.localId !== currentBlock.localId
      })
      if (sortedBlocks.length) {
        if (currentBlockIndex > sortedBlocks.length - 1) {
          currentBlockIndex--;
        } 
        setBlock(sortedBlocks[currentBlockIndex])
      } else {
        handleNewBlock();
      }
    },
    onAddClicked: handleNewBlock,
    onToolChanged(tool) {
      currentTool = tool;
    }
  });

  root.append(canvas);
  root.append(header);

  const dpr = window.devicePixelRatio;
  const rect = canvas.getBoundingClientRect();

  // Set the "actual" size of the canvas
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale the context to ensure correct drawing operations
  ctx.scale(dpr, dpr);

  // Set the "drawn" size of the canvas
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  let currentBlock: Block = {
    createdAt: new Date(),
    data: {
      drawings: [],
    },
  };

  let sortedBlocks = blocks.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  if (sortedBlocks.length > 0) {
    currentBlockIndex = sortedBlocks.length - 1;

    setBlock(sortedBlocks[currentBlockIndex]);
  }

  let drawing = false;

  const startDrawing = (x: number, y: number) => {
    if (drawing) {
      return;
    }

    drawing = true;

    currentBlock.data.drawings.push({ points: [{ x, y }] });

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (x: number, y: number) => {
    if (drawing) {
      if (currentTool === "pencil") {
        currentBlock.data.drawings[
          currentBlock.data.drawings.length - 1
        ].points.push({ x, y });
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if(currentTool === "eraser") {
        const drawingsToRemove: any[] = [];
        for (const drawing of currentBlock.data.drawings) {
          for (const point of drawing.points) {
            const eraserDistanceThreshold = 5;
            if (Math.abs(point.x - x) < eraserDistanceThreshold && Math.abs(point.y - y) < eraserDistanceThreshold) {
              drawingsToRemove.push(drawing);
              break;
            }
          }
        }

        if (drawingsToRemove.length > 0) {
          currentBlock.data.drawings = currentBlock.data.drawings.filter((d) => {
            return !drawingsToRemove.includes(d);
          });
  
          redraw();
        }
      }
    }
  };

  const endDrawing = async (x: number, y: number) => {
    if (!drawing) {
      return;
    }

    drawing = false;

    draw(x, y);

    if (currentBlock.localId) {
      await updateBlock({
        ...currentBlock,
      });
    } else {
      currentBlock = await addBlock(currentBlock);
    }
  };

  function preventDefault(e) {
    e.preventDefault();
  }

  document.body.addEventListener("touchmove", preventDefault, {
    passive: false,
  });

  const allowedPointers = ["mouse", "pen"];

  canvas.addEventListener(
    "pointerdown",
    (e) => {
      if (allowedPointers.includes(e.pointerType)) {
        startDrawing(e.offsetX, e.offsetY);
      }
    }
  );

  canvas.addEventListener(
    "pointermove",
    (e) => {
      if (allowedPointers.includes(e.pointerType)) {
        draw(e.offsetX, e.offsetY);
      }
    }
  );

  canvas.addEventListener(
    "pointerup",
    (e) => {
      if (allowedPointers.includes(e.pointerType)) {
        endDrawing(e.offsetX, e.offsetY);
      }
    },
    true
  );
}

init();
