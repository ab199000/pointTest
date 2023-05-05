import { gameState } from "./state.js"
export function checkOnColore(str, col) {
    const elem = document.getElementById(`${str}n${col}`);
    let massClasses = elem.classList.value.split(" ");
    if (massClasses.length === 0) {
      return true;
    }
    for (let i = 0; i < massClasses.length; i++) {
      if (massClasses[i] == "green") {
        return false;
      }
    }
  
    return true;
  }

export function colorForPlayer() {
  const teg = document.querySelector(".player");
  if (gameState.currentStepPlayerId) {
    teg.style.color = "blue";
  } else {
    teg.style.color = "red";
  }
}