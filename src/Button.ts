import { Color } from "./Color";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export const Button = ({ text, onClick }: { text: string, onClick: () => void }) => {
  const el = Div();
  setStyle(el, {
    cursor: "pointer",
    color: Color.BTN_TEXT,
    padding: "4px"
  })
  el.innerText = text;

  el.addEventListener("click", onClick);

  return el;
};
