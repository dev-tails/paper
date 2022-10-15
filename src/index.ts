import {
  addBlock,
  getAllBlocks,
  Block,
  getBlock,
  Point,
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

  setStyle(root, {});

  const canvas = document.createElement("canvas");
  setStyle(canvas, {
    width: "100%",
    height: "calc(100vh - 36px)",
    overflowY: "hidden",
  });
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) {
    alert("Cannot find 2d context");
    return;
  }

  ctx.translate(0.5, 0.5);

  const blocks = await getAllBlocks();
  let currentBlockIndex = -1;

  const setBlock = (block: Block | null) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentBlock = block;

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
  };

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
  });

  root.append(header);

  root.append(canvas);

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
      currentBlock.data.drawings[
        currentBlock.data.drawings.length - 1
      ].points.push({ x, y });
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = async (x: number, y: number) => {
    if (!drawing) {
      return;
    }

    drawing = false;

    ctx.lineTo(x, y);
    ctx.stroke();

    currentBlock.data.drawings[
      currentBlock.data.drawings.length - 1
    ].points.push({ x, y });

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

  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if ((e.touches[0] as any).touchType === "stylus") {
        startDrawing(e.touches[0].clientX, e.touches[0].clientY - 36);
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if ((e.touches[0] as any).touchType === "stylus") {
        draw(e.touches[0].clientX, e.touches[0].clientY - 36);
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if ((e.touches[0] as any).touchType === "stylus") {
        startDrawing(e.touches[0].clientX, e.touches[0].clientY - 36);
      }
    },
    { passive: false }
  );

  canvas.addEventListener("mousedown", (e) => {
    startDrawing(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    draw(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mouseup", (e) => {
    endDrawing(e.offsetX, e.offsetY);
  });
}

init();
