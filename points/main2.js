let body = document.querySelector(".field");

let player = 1;
let massPaints = [];
// for(let i = 0; i < 5;i++){
// let str = document.createElement("div")
// for(let j = 0; j < 5; j++){
// let btn = document.createElement("button")
// str.append(btn)
// }
// body.append(str)
// }

// body.addEventListener("click", (event)=>{

// })

let mass = [
  [
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: 0, statusChek: 0 },
    { player: 0, statusChek: 0 },
    { player: "", statusChek: 0 },
  ],
  [
    { player: "", statusChek: 0 },
    { player: 0, statusChek: 0 },
    { player: 1, statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
  ],
  [
    { player: "", statusChek: 0 },
    { player: 1, statusChek: 0 },
    { player: 0, statusChek: 0 },
    { player: 1, statusChek: 0 },
    { player: "", statusChek: 0 },
  ],
  [
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: 1, statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
  ],
  [
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
    { player: "", statusChek: 0 },
  ],
];

function creatField() {
  for (let i = 0; i < mass.length; i++) {
    let str = document.createElement("div");
    for (let j = 0; j < mass[i].length; j++) {
      let btn = document.createElement("button");
      if (mass[i][j].player) {
        btn.classList.add("red");
      }
      if (mass[i][j].player === 0) {
        btn.classList.add("blue");
      }

      str.append(btn);
    }
    body.append(str);
  }
}

creatField();

function giveAllPaints(str, col, player) {
	console.log(str, col, player)
  let newMass = [...mass];
  console.log(massPaints);
  let peremForPush = 0;

  if (mass[str][col].statusChek == 1 || mass[str][col].player === 0) {
    return;
  }

  for (let i = 0; i < massPaints.length; i++) {
    if (massPaints[i].str == str && massPaints[i].col == col) {
      peremForPush = 1;
    }
  }

  if (!peremForPush) {
    massPaints.push({ str, col, player, statusChek: 1 });
  }

  mass[str][col].statusChek = 1;

  if (
    mass[str - 1][col - 1].player === 1 &&
    mass[str - 1][col - 1].statusChek === 0
  ) {
    console.log(massPaints);
    massPaints.push({ str: str - 1, col: col - 1, player, statusChek: 0 });
  }
  if (mass[str - 1][col].player === 1 && mass[str - 1][col].statusChek === 0) {
    console.log(massPaints);
    massPaints.push({ str: str - 1, col: col, player, statusChek: 0 });
  }
  if (
    mass[str - 1][col + 1].player === 1 &&
    mass[str - 1][col + 1].statusChek === 0 &&
    checkOnPush(str - 1, col + 1, massPaints)
  ) {
    console.log(massPaints);
    massPaints.push({ str: str - 1, col: col + 1, player, statusChek: 0 });
    console.log(1);
  }

  if (
    mass[str][col - 1].player === 1 &&
    mass[str][col - 1].statusChek === 0 &&
    checkOnPush(str, col - 1, massPaints)
  ) {
    console.log(massPaints);
    massPaints.push({ str: str, col: col - 1, player, statusChek: 0 });
  }
  if (
    mass[str][col + 1].player === 1 &&
    mass[str][col + 1].statusChek === 0 &&
    checkOnPush(str, col + 1, massPaints)
  ) {
    console.log(massPaints);
    massPaints.push({ str: str, col: col + 1, player, statusChek: 0 });
  }

  if (
    mass[str + 1][col - 1].player === 1 &&
    mass[str + 1][col - 1].statusChek === 0 &&
    checkOnPush(str + 1, col - 1, massPaints)
  ) {
    console.log(massPaints);
    massPaints.push({ str: str + 1, col: col - 1, player, statusChek: 0 });
  }
  if (
    mass[str + 1][col].player === 1 &&
    mass[str + 1][col].statusChek === 0 &&
    checkOnPush(str + 1, col, massPaints)
  ) {
    console.log(massPaints);
    massPaints.push({ str: str + 1, col: col, player, statusChek: 0 });
  }
  if (
    mass[str + 1][col + 1].player === 1 &&
    mass[str + 1][col + 1].statusChek === 0 &&
    checkOnPush(str + 1, col + 1, massPaints)
  ) {
    console.log(massPaints);

    massPaints.push({ str: str + 1, col: col + 1, player, statusChek: 0 });
    console.log(checkOnPush(str + 1, col + 1, massPaints));
  }
  console.log(massPaints);
  for (let i = 0; i < massPaints.length; i++) {
    if (massPaints[i].statusChek || massPaints[i].player === 0) {
      continue;
    }
    massPaints[i].statusChek = 1;
    return giveAllPaints(massPaints[i].str, massPaints[i].col, player);
  }
}
giveAllPaints(2, 1, player);

function checkOnPush(strCheck, colCheck, massPaints) {
  if (massPaints.length === 0) {
    return;
  }
  for (let i = 0; i < massPaints.length; i++) {
    if (
      massPaints[i].str == strCheck &&
      massPaints[i].col == colCheck &&
      (massPaints[i].statusChek === 1 || massPaints[i].statusChek === 0)
    ) {
      if (massPaints[i].statusChek === 0) {
        console.log("yes"); //написать цифры и покрасить точки
      }

      return false;
    }
  }
  console.log("no");
  return true;
}
