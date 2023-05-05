import { gameState } from "./state.js";


export function searchForSurroundedPoints(massPaints, field) {
  for (let i = 0; i < field.length; i++) {
    let pointsInString = [];
    //ищем строку
    for (let j = 0; j < massPaints.length; j++) {
      if (i != massPaints[j].str) {
        continue;
      }
      //проверяем точки в строке

      for (let h = 0; h < field[i].length; h++) {
        if (h != massPaints[j].col) {
          continue;
        }
        pointsInString.push({ str: i, col: h });
      }
      if (pointsInString.length <= 1) {
        continue;
      }
      sumPoints(pointsInString,field);
    }
  }
}

function sumPoints(mass,field) {

  let ColFirstPoint = mass[0].col > mass[1].col ? mass[1].col : mass[0].col;
  let ColSecondPoint = mass[0].col < mass[1].col ? mass[1].col : mass[0].col;
  let score = 0;

  if (ColFirstPoint + 1 == ColSecondPoint) {
    return;
  }
  for (let i = ColFirstPoint + 1; i < ColSecondPoint; i++) {
    if (
      field[mass[0].str][i].player != gameState.currentStepPlayerId &&
      field[mass[0].str][i].player !== ""
    ) {
      score += 1;
    }
  }

  if (gameState.currentStepPlayerId) {
    gameState.scoreSecond += score;
  } else {
    gameState.scoreFirst += score;
  }

  changeScore(gameState.scoreFirst, gameState.scoreSecond);
}

export function changeScore(firstS, secondS) {

  const scoreFirst = document.querySelector(".scoreFirst");
  const scoreSecond = document.querySelector(".scoreSecond");

  scoreFirst.textContent = firstS;
  scoreSecond.textContent = secondS;
}