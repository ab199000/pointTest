export const createField = ({ parent, row = 21, col = 21 }) => {
  const buttons = [];
  const lines = [];
  const field = [];

  for (let i = 0; i < row; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    lines.push(line);

    if (i == 0 || i + 1 == row) {
      line.style.display = "none";
    }

    field.push([]);

    for (let j = 0; j < col; j++) {
      const btn = document.createElement("button");
      btn.classList.add("button");

      btn.id = `${i}n${j}`;
      if (j == 0 || j == 20) {
        btn.style.display = "none";
      }
      line.append(btn);
      buttons.push(btn);
      field[i].push({ player: "", statusChek:""});
    }
  }
  parent.append(...lines);

  return { buttons, field };
};
