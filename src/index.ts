import { addBlock, getAllBlocks, Block, getBlock } from "./db/db";
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

  root.append(Header());

  const canvas = document.createElement("canvas");
  setStyle(canvas, {
    width: "100%",
    height: "calc(100vh - 36px)",
    overflowY: "hidden",
  });
  root.append(canvas);

  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) {
    alert("Cannot find 2d context");
    return;
  }

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

  let drawing = false;

  const startDrawing = (x: number, y: number) => {
    drawing = true;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (x: number, y: number) => {
    if (drawing) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = (x: number, y: number) => {
    if (!drawing) {
      return;
    }

    drawing = false;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  function preventDefault(e) {
    e.preventDefault();
  }

  document.body.addEventListener("touchmove", preventDefault, {
    passive: false,
  });

  canvas.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if ((e.touches[0] as any).touchType === "stylus") {
      startDrawing(e.touches[0].clientX, e.touches[0].clientY - 36);
    }
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if ((e.touches[0] as any).touchType === "stylus") {
      draw(e.touches[0].clientX, e.touches[0].clientY - 36);
    }
  }, { passive: false });

  canvas.addEventListener("touchend", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if ((e.touches[0] as any).touchType === "stylus") {
      startDrawing(e.touches[0].clientX, e.touches[0].clientY - 36);
    }
  }, { passive: false });

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
