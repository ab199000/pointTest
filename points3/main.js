import { io } from "https://cdn.socket.io/4.6.1/socket.io.esm.min.js";
import { createField } from "./field.js";
import { gameState } from "./state.js";
import { changeScore } from "./score.js"
import { checkPoints } from "./checkPoints.js"
import { colorForPlayer } from "./color.js"

const body = document.querySelector(".field");
const playerColors = {
  0: "red",
  1: "blue",
};

let whoTurn = 0;

let roomId = -1;

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
  playerName(gameState.playerId)
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
    stepperId, field
  );
};

socket.on("putPointOnClient", (data) => {

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
};

function coordinatesPoint(pointId) {
  let str = Number(pointId.slice(0, pointId.indexOf("n")));
  let col = Number(pointId.slice(pointId.indexOf("n") + 1));
  return { str, col };
}

colorForPlayer();
changeScore(gameState.scoreFirst, gameState.scoreSecond);


function playerName(playerId){
    let player = document.querySelector(".playerName")
    console.log(playerId)
    player.textContent = `Player ${playerId + 1}`
    if(playerId){
        player.style.color = "blue"
    }
    else{player.style.color = "red"}
}
