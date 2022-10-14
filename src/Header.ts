import { Button } from "./Button";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export const Header = () => {
  const el = Div();

  setStyle(el, {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: `1px solid #333`,
    padding: "4px 8px"
  });

  const leftDiv = Div();
  setStyle(leftDiv, {
    display: "flex"
  })
  const btnLeft = Button({
    text: "<",
    onClick() {},
  });
  leftDiv.append(btnLeft);

  const btnRight = Button({
    text: ">",
    onClick() {},
  });
  leftDiv.append(btnRight);

  const rightDiv = Div();
  setStyle(rightDiv, {
    display: "flex"
  })
  const btnTrash = Button({
    text: "🗑️",
    onClick() {},
  });
  rightDiv.append(btnTrash);

  const btnPencil = Button({
    text: "✏️",
    onClick() {},
  });
  rightDiv.append(btnPencil);

  const btnNew = Button({
    text: "➕",
    onClick() {},
  });
  rightDiv.append(btnNew);

  el.append(leftDiv);
  el.append(rightDiv);

  return el;
};
