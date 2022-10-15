import { Button } from "./Button";
import { Color } from "./Color";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export type HeaderProps = {
  onAddClicked: () => void;
  onLeftClicked: () => void;
  onRightClicked: () => void;
  onDeleteClicked: () => void;
};

export const Header = ({
  onAddClicked,
  onLeftClicked,
  onRightClicked,
  onDeleteClicked
}: HeaderProps) => {
  const el = Div();

  setStyle(el, {
    display: "flex",
    justifyContent: "space-between",
    borderTop: `1px solid #333`,
    padding: "0 8px",
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: Color.BG
  });

  const leftDiv = Div();
  setStyle(leftDiv, {
    display: "flex",
  });
  const btnLeft = Button({
    text: "<",
    onClick() {
      onLeftClicked();
    },
  });
  leftDiv.append(btnLeft);

  const btnRight = Button({
    text: ">",
    onClick() {
      onRightClicked();
    },
  });
  leftDiv.append(btnRight);

  const rightDiv = Div();
  setStyle(rightDiv, {
    display: "flex",
  });

  const btnTrash = Button({
    text: "🗑️",
    onClick() {
      onDeleteClicked();
    },
  });
  rightDiv.append(btnTrash);

  const btnPencil = Button({
    text: "✏️",
    onClick() {},
  });
  rightDiv.append(btnPencil);

  const btnNew = Button({
    text: "➕",
    onClick() {
      onAddClicked();
    },
  });
  rightDiv.append(btnNew);

  el.append(leftDiv);
  el.append(rightDiv);

  return el;
};
