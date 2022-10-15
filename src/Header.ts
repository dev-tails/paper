import { Button } from "./Button";
import { Color } from "./Color";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export type HeaderProps = {
  onAddClicked: () => void;
  onLeftClicked: () => void;
  onRightClicked: () => void;
  onDeleteClicked: () => void;
  onToolChanged: (tool: "pencil" | "eraser") => void;
};

export const Header = ({
  onAddClicked,
  onLeftClicked,
  onRightClicked,
  onDeleteClicked,
  onToolChanged
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

  let isPencil = true;
  const btnPencil = Button({
    text: "✏️",
    onClick() {
      isPencil = !isPencil;
      if (isPencil) {
        btnPencil.style.transform = 'scaleX(-1)'
      } else {
        btnPencil.style.transform = 'scaleX(-1) rotate(180deg)'
      }
      onToolChanged(isPencil ? "pencil" : "eraser");
    },
  });
  setStyle(btnPencil, {
    transition: "transform 200ms",
    transform: "scaleX(-1)"
  })
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
