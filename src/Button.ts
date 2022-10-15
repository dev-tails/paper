import { Color } from "./Color";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export const Button = ({ text, onClick }: { text: string, onClick: () => void }) => {
  const el = Div();
  setStyle(el, {
    fontWeight: "bold",
    cursor: "pointer",
    color: Color.BTN_TEXT,
    padding: "4px",
    userSelect: "none"
  })
  el.innerText = text;

  el.addEventListener("click", onClick);

  return el;
};
