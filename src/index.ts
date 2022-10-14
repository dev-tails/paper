import { addBlock, getAllBlocks, Block, getBlock } from "./db/db";
import { Header } from "./Header";
import { setStyle } from "./setStyle";

async function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("serviceworker.js");
  }

  const root = document.getElementById("root");
  if (!root) {
    return;
  }

  setStyle(root, {

  });

  root.append(Header())
}

init();
