import { Color } from "./Color";
import { setStyle } from "./setStyle";

export const Button = ({ text, onClick }: { text: string, onClick: () => void }) => {
  const el = document.createElement("button");
  setStyle(el, {
    fontWeight: "bold",
    cursor: "pointer",
    color: Color.BTN_TEXT,
    padding: "12px 8px",
    userSelect: "none",
    fontSize: "1.2em",
    background: "none",
    border: "none"
  })
  el.innerText = text;

  el.addEventListener("pointerdown", onClick);

  return el;
};
