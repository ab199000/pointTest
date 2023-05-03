import { io } from "https://cdn.socket.io/4.6.1/socket.io.esm.min.js";
import { createField } from "./field.js";
import { gameState } from "./state.js";

const body = document.querySelector(".field");
const playerColors = {
  0: "red",
  1: "blue",
};

let whoTurn = 0;

let scoreFirst = 0;

let scoreSecond = 0;

let roomId = -1;

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
const gameDiv = document.querySelector(".game");
gameDiv.style.display = "none";

const RoomSearch = document.querySelector(".RoomSearch");
RoomSearch.style.display = "block";

const roomPanel = (socket) => {
  console.log(socket);
  const roomsDiv = RoomSearch.querySelector(".rooms");
  socket.on("getRooms", (rooms) => {
    console.log("Получили");
    console.log(rooms);
    roomsDiv.innerHTML = "";

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].close) {
        continue;
      }
      const form = document.createElement("form");
      form.innerHTML = `
          <p>Комната №${i} Socket ${rooms[i].p1}</p>
          <button class="accept"> Присоединиться </button>
        `;
      if (rooms[i].p1 == socket.id) {
        form.innerHTML = `
            <p>Комната №${i} Socket ${rooms[i].p1} (Ваша заявка)</p>
            <button class="accept" disabled> Присоединиться </button>
          `;
      }
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        console.log(`Присоединился к комнате ${i}`);
        socket.emit("joinRoom", i);
      });
      roomsDiv.append(form);
    }
  });
  const addRoom = RoomSearch.querySelector(".addRoom");
  addRoom.addEventListener("click", () => {
    console.log("Комната добавлена");
    socket.emit("checkInRoom");
  });
  socket.on("answerOnCheck", (answer) => {
    if (answer) {
      alert(3333);
      return;
    }
    socket.emit("addRoom");
  });
};

const socket = io("ws://localhost:8080");

roomPanel(socket);

socket.on("startGame", (data) => {
  if (socket.id == data.p1) {
    gameState.playerId = 0;
  } else if (socket.id == data.p2) {
    gameState.playerId = 1;
  } else {
    alert("Упс, ошибка");
    return;
  }

  gameDiv.style.display = "block";
  RoomSearch.style.display = "none";

  body.style.setProperty("--player-color", playerColors[gameState.playerId]);

  roomId = data.id;
});

const { field, buttons } = createField({ parent: body });
const colorPlayerMap = {
  0: "firstPlayer",
  1: "secondPlayer",
};

const onButtonClick = (evt) => {
  console.log(gameState.currentStepPlayerId)
  console.log(gameState.playerId)
  if (gameState.currentStepPlayerId !== gameState.playerId) {
    return;
  }
  putPoint(evt.target);
};

buttons.forEach((button) => {
  button.addEventListener("click", onButtonClick);
});

const paintPoint = (point, stepperId) => {
  if (roomId == -1) {
    return;
  }

  if (point.classList.contains("filled")) {
    return;
  }

  point.classList.add("filled");
  point.classList.add(colorPlayerMap[stepperId]);
  const pointId = point.id
  field[coordinatesPoint(pointId).str][coordinatesPoint(pointId).col].player = stepperId;

  checkPoints(
    coordinatesPoint(pointId).str,
    coordinatesPoint(pointId).col,
    stepperId
  );
};

socket.on("putPointOnClient", (data) => {
  console.log(socket.id)
  console.log(data.owner)
  if (socket.id == data.owner) {
    return;
  }

  const stepperId = data.stepperId;
  const pointId = data.pointId;

  const point = document.getElementById(pointId);

  paintPoint(point, stepperId);
  point.removeEventListener("click", onButtonClick);
  switchStepper();
  colorForPlayer();
});

function putPoint(point) {
  console.log("in put")
  paintPoint(point, gameState.playerId);
  socket.emit("putPointOnServer", {
    stepperId: gameState.playerId,
    pointId: point.id,
    roomId: roomId,
    owner: socket.id
  });

  point.removeEventListener("click", onButtonClick);
  
  switchStepper();
  colorForPlayer()
}
const switchStepper = () => {
  gameState.currentStepPlayerId = gameState.currentStepPlayerId ? 0 : 1;
  console.log(gameState.currentStepPlayerId,'step')
};

function coordinatesPoint(pointId) {
  let str = Number(pointId.slice(0, pointId.indexOf("n")));
  let col = Number(pointId.slice(pointId.indexOf("n") + 1));
  return { str, col };
}

function checkPoints(str, col, player) {
  let fieldCopy = structuredClone(field);
  let massPaints = [];

  console.log("in check")
  console.log(str, col, player)

  giveAllPaints(str, col, player, massPaints, fieldCopy);
  checkRing(massPaints);
  console.log(massPaints)
}

function giveAllPaints(str, col, player, massPaints, fieldCopy) {
  let peremForPush = false;
  console.log(field)

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
  console.log(10000)

  for (let i = 0; i < checks.length; i++) {
    console.log(fieldCopy[str + Number(checks[i].str)][col + Number(checks[i].col)]
    .player === player ,
  fieldCopy[str + Number(checks[i].str)][col + Number(checks[i].col)]
    .statusChek === "",
  checkOnPush(
    str + Number(checks[i].str),
    col + Number(checks[i].col),
    massPaints
  ),
  checkOnColore(str + Number(checks[i].str), col + Number(checks[i].col)))
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
      console.log(str + Number(checks[i].str), col + Number(checks[i].col));
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
        console.log("yes"); //написать цифры и покрасить точки
      }
      return false;
    }
  }
  return true;
}

function checkRing(massPaints) {
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
      searchForSurroundedPoints(massPaints);
    }
  }
}

function colorForPlayer() {
  const teg = document.querySelector(".player");
  if (gameState.currentStepPlayerId) {
    teg.style.color = "blue";
  } else {
    teg.style.color = "red";
  }
}

colorForPlayer();

function searchForSurroundedPoints(massPaints) {
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
      sumPoints(pointsInString);
    }
  }
}

function changeScore(firstS, secondS) {
  console.log(firstS, secondS)
  const scoreFirst = document.querySelector(".scoreFirst");
  const scoreSecond = document.querySelector(".scoreSecond");

  scoreFirst.textContent = firstS;
  scoreSecond.textContent = secondS;
}
changeScore(scoreFirst, scoreSecond);

function sumPoints(mass) {
  console.log(mass)
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
  console.log(gameState.currentStepPlayerId, "hod")
  console.log(scoreSecond)
  console.log(scoreFirst)
  if (gameState.currentStepPlayerId) {
    scoreSecond += score;
  } else {
    scoreFirst += score;
  }
  console.log(scoreFirst, scoreSecond)
  changeScore(scoreFirst, scoreSecond);
}

// sumPoints([{str:2, col: 3},{str:2,col:5}])

function checkOnColore(str, col) {
  console.log(str, col);
  const elem = document.getElementById(`${str}n${col}`);
  console.log(elem);
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
