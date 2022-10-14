import { Button } from "./Button";
import { Div } from "./Div";
import { setStyle } from "./setStyle";

export type HeaderProps = {
  onAddClicked: () => void;
  onSaveClicked: () => void;
}

export const Header = ({ onAddClicked, onSaveClicked }: HeaderProps) => {
  const el = Div();

  setStyle(el, {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: `1px solid #333`,
    padding: "4px 8px",
    height: "27px"
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
  const btnSave = Button({
    text: "💾",
    onClick() {
      onSaveClicked()
    }
  })
  rightDiv.append(btnSave);

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
    onClick() {
      onAddClicked();
    },
  });
  rightDiv.append(btnNew);

  el.append(leftDiv);
  el.append(rightDiv);

  return el;
};
