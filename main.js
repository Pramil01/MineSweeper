var NUMBER_OF_MINES = 57;
var NUMBER_OF_CELLS = 324;
var SIZE = 18;
var NUMBER_OF_FLAGS;
var Timer;

insertMultipleChildren(NUMBER_OF_CELLS);

function insertMultipleChildren(childrenAmount) {
  NUMBER_OF_FLAGS = 0;
  Timer = null;
  var container = document.getElementById("box");
  var arr = getArray(NUMBER_OF_MINES, 0, NUMBER_OF_CELLS);
  arr.sort(function (a, b) {
    return a - b;
  });
  var toAdd = "";
  for (var counter = 0, ind = 0; counter < childrenAmount; counter++) {
    var AddThis = "";
    if (counter == arr[ind]) {
      AddThis = `<div class="cell" id="No${counter}" onclick="displayHidden(this.id,[])">M</div>`;
      ind++;
    } else {
      AddThis = `<div class="cell" id="No${counter}" onclick="displayHidden(this.id,[])"></div>`;
    }
    toAdd += AddThis;
  }
  container.innerHTML = toAdd;
  setNumbers();
  setFlagOptions();
}

function setNumbers() {
  var cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    if (cell.innerText !== "M") {
      var count = 0;
      var id = parseInt(cell.id.substring(2));
      var row = parseInt(id / SIZE);
      var col = parseInt(id % SIZE);
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (i == 0 && i == j) continue;
          if (
            row - i >= 0 &&
            col - j >= 0 &&
            row - i < SIZE &&
            col - j < SIZE
          ) {
            var cellId = (row - i) * SIZE + (col - j);

            var checkCell = document.getElementById(`No${cellId}`);
            if (checkCell.innerText === "M") count++;
          }
        }
      }
      if (count !== 0) cell.innerText = count;
    }
  });
}

function setFlagOptions() {
  var cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener(
      "contextmenu",
      function (event) {
        event.preventDefault();
        if (Timer === null) {
          alert("First start the game");
          return;
        }

        var currCell = document.getElementById(cell.id);
        if (currCell.style.color !== "white") {
          currCell.style.backgroundColor = "blue";
          currCell.style.color = "blue";
          NUMBER_OF_FLAGS++;
          console.log(NUMBER_OF_FLAGS);
          if (NUMBER_OF_FLAGS >= NUMBER_OF_MINES) checkIfWon();
        }
      },
      false
    );
  });
}

function startClock() {
  var clock = document.getElementById("clock").innerText;
  var sec = parseInt(clock.substring(3));
  var min = parseInt(clock.substring(0, 2));
  var newTime = "";
  Timer = setInterval(() => {
    if (sec === 0) {
      min -= 1;
      sec = 59;
      newTime = `0${min}:59`;
    } else {
      sec -= 1;
      if (sec < 10) newTime = `0${min}:0${sec}`;
      else newTime = `0${min}:${sec}`;
    }
    document.getElementById("clock").innerText = newTime;
    if (min === 0 && sec === 0) {
      Lost();
    }
  }, 1000);
}

//Helper Functions
function displayHidden(id, arr) {
  if (Timer === null) {
    alert("First start the game");
    return;
  }
  if (arr.length === 0) {
    for (let i = 0; i < NUMBER_OF_CELLS; i++) arr.push(false);
  }
  var idN = parseInt(id.substring(2));
  arr[idN] = true;
  var cell = document.getElementById(id);
  cell.style.cssText = `
  color : white;
  background-color : green;
`;
  if (cell.innerText === "M") {
    cell.innerText = "💥";
    Lost();
  }
  if (cell.innerText.length === 0) {
    var row = parseInt(idN / SIZE);
    var col = parseInt(idN % SIZE);
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (i == 0 && i == j) continue;
        if (row - i >= 0 && col - j >= 0 && row - i < SIZE && col - j < SIZE) {
          var cellId = (row - i) * SIZE + (col - j);
          var checkCell = document.getElementById(`No${cellId}`);
          if (checkCell.innerText !== "M" && !arr[cellId])
            displayHidden(checkCell.id, arr);
        }
      }
    }
  }
}

function shuffle(array) {
  var tmp,
    current,
    top = array.length;
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
}

function getArray(length, min, max) {
  for (var a = [], i = min; i < max; ++i) a[i] = i;
  a = shuffle(a).filter((ele, ind) => ind < length);
  return a;
}

function checkIfWon() {
  let count = 0;
  for (let i = 0; i < NUMBER_OF_CELLS; i++) {
    var cell = document.getElementById(`No${i}`);
    if (cell.innerText === "M" && cell.style.color === "blue") count++;
  }
  if (count === NUMBER_OF_MINES) {
    alert("YOU WON");
    clearInterval(Timer);
    insertMultipleChildren(NUMBER_OF_CELLS);
    return;
  }
}

function Lost() {
  setTimeout(() => {
    alert("You lost !!!");
    document.getElementById("clock").innerText = "05:00";
    clearInterval(Timer);
    insertMultipleChildren(NUMBER_OF_CELLS);
  }, 100);
  return;
}
