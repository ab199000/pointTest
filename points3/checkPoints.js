import { searchForSurroundedPoints } from "./score.js"
import { checkOnColore } from "./color.js"

let checks = [
  { str: -1, col: -1 },
  { str: -1, col: 0 },
  { str: -1, col: +1 },
  { str: 0, col: -1 },
  { str: 0, col: +1 },
  { str: +1, col: -1 },
  { str: +1, col: 0 },
  { str: +1, col: +1 },
];

export function checkPoints(str, col, player, field) {
    let fieldCopy = structuredClone(field);
    let massPaints = [];

    giveAllPaints(str, col, player, massPaints, fieldCopy);
    checkRing(massPaints, field);
  }

function giveAllPaints(str, col, player, massPaints, fieldCopy) {
    let peremForPush = false;

    // if (field2[str][col].statusChek == 1 || field2[str][col].player === player) {

    //   return;
    // }
    if (massPaints.length == 0) {
        massPaints.push({ str, col, player, statusChek: 1 });
    }

    for (let i = 0; i < massPaints.length; i++) {
        if (massPaints[i].str == str && massPaints[i].col == col) {
            peremForPush = true;
        }
    }

    if (!peremForPush) {
        massPaints.push({ str, col, player, statusChek: 1 });
    }

    fieldCopy[str][col].statusChek = 1;

    for (let i = 0; i < checks.length; i++) {
      if (
        fieldCopy[str + Number(checks[i].str)][col + Number(checks[i].col)]
          .player === player &&
        fieldCopy[str + Number(checks[i].str)][col + Number(checks[i].col)]
          .statusChek === "" &&
        checkOnPush(
          str + Number(checks[i].str),
          col + Number(checks[i].col),
          massPaints
        ) &&
        checkOnColore(str + Number(checks[i].str), col + Number(checks[i].col))
      ) {
        massPaints.push({
          str: str + Number(checks[i].str),
          col: col + Number(checks[i].col),
          player,
          statusChek: 0,
        });

      }
    }
    for (let i = 0; i < massPaints.length; i++) {
      if (massPaints[i].statusChek || massPaints[i].player !== player) {
        continue;
      }
      massPaints[i].statusChek = 1;
      return giveAllPaints(
        massPaints[i].str,
        massPaints[i].col,
        player,
        massPaints,
        fieldCopy
      );
    }
  }

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
        }
        return false;
      }
    }
    return true;
  }

  function checkRing(massPaints, field) {
    if (massPaints.length >= 4) {
      let firstComparisonPoint = false;
      let secondComparisonPoint = false;

      for (let i = 0; i < massPaints.length; i++) {
        if (i == massPaints.length - 3 || i == massPaints.length - 2) {
          for (let j = 0; j < checks.length; j++) {
            if (
              massPaints[massPaints.length - 3].str + checks[j].str ==
                massPaints[massPaints.length - 2].str &&
              massPaints[massPaints.length - 3].col + checks[j].col ==
                massPaints[massPaints.length - 2].col
            ) {
              return;
            }
            if (
              massPaints[i].str + checks[j].str ==
                massPaints[massPaints.length - 1].str &&
              massPaints[i].col + checks[j].col ==
                massPaints[massPaints.length - 1].col
            ) {
              if (i == massPaints.length - 3) {
                firstComparisonPoint = true;
              } else {
                secondComparisonPoint = true;
              }
              continue;
            }
          }
        }
      }

      if (firstComparisonPoint && secondComparisonPoint) {
        for (let i = 0; i < massPaints.length; i++) {
          const button = document.getElementById(
            `${massPaints[i].str}n${massPaints[i].col}`
          );
          button.classList.add("green");
        }
        searchForSurroundedPoints(massPaints, field);
      }
    }
  }

  function intermediatePoint(str, col, field) {

    // for(let i = 0; i < field[0].length;i++){
    //     if(i !== str){
    //         continue
    //     }

    //     for(let j = 0; j < field[i].length;j++){
    //         if(j !== col){
    //             continue
    //         }

    //     }
    // }
    for(let i = 0; i < field[str].length; i++){
        
    }



  }
