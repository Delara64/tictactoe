let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

let available = [];
let w, h;
let human, ai;
let players = ['X', 'O'];
let currnetPlayer;
let way;
let scores = {
  'X': 1,
  'O': -1,
  'tie': 0
}
function setup() {
  createCanvas(400, 400);
  currnetPlayer = 0;
  ai = 0;
  human = 1;

  calcAvailble();
  console.log(`Your player ${players[human]}`);
  strokeWeight(3);
}



function draw() {
  background(230);

  w = width / 3;
  h = height / 3;

  drawBoard();

  let result = checkWinner();
  if (result != false) {
    if (result == 'tie') {
      console.log('tie');
    } else {
      console.log(`winner is  ${result}`);
      drawEndLine(way);
    }

    noLoop();
  }

  if (currnetPlayer == ai) {
    BestMove();
  }



}

function drawBoard() {
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);

  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let spot = board[i][j];
      let x = (j * w) + w / 2;
      let y = (i * h) + h / 2;
      if (spot == players[0]) {
        let xr = w / 4;
        line(x - xr, y - xr, x + xr, y + xr);
        line(x + xr, y - xr, x - xr, y + xr);
      } else if (spot == players[1]) {
        noFill();
        ellipse(x, y, w / 2);
      }

    }

  }
}

function calcAvailble() {
  available = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {

        available.push([i, j]);
      }

    }
  }
}

function equal3(a, b, c) {

  return (a == b & a == c && a != '')
}

function checkWinner() {
  calcAvailble();
  let winner = false;

  for (let i = 0; i < 3; i++) {
    if (equal3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
      way = {
        p1: [i, 0],
        p2: [i, 2]
      }
    }
  }


  for (let i = 0; i < 3; i++) {
    if (equal3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
      way = {
        p1: [0, i],
        p2: [2, i]
      }
    }
  }

  if (equal3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
    way = {
      p1: [0, 0],
      p2: [2, 2]
    }
  }

  if (equal3(board[0][2], board[1][1], board[2][0])) {
    winner = board[0][2];
    way = {
      p1: [0, 2],
      p2: [2, 0]
    }
  }

  if (winner == false && available.length == 0) {
    return 'tie'
  } else {

    return winner;
  }
}

function BestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = players[ai];
        let score = minimax(board, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  board[move.i][move.j] = players[ai];
  currnetPlayer = human;

}

function minimax(board, isMaximizing) {
  let result = checkWinner();
  if (result != false) {
    return scores[result];
  }

  if (isMaximizing) {

    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = players[ai];
          let score = minimax(board, false);
          board[i][j] = '';
          bestScore = max(bestScore, score);
        }
      }
    }
    return bestScore;
  } else {

    let bestScore = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = players[human];
          let score = minimax(board, true);
          board[i][j] = '';
          bestScore = min(bestScore, score);
        }
      }
    }
    return bestScore;

  }
}

function drawEndLine(way) {
  let x1, x2, y1, y2;

  let p1 = way.p1;
  let p2 = way.p2;

  if (p1[1] == p2[1]) {
    x1 = p1[1] * w + (w / 2);
    y1 = 0;
    x2 = p1[1] * w + (w / 2);
    y2 = height;
  } else if (p1[0] == p2[0]) {
    x1 = 0;
    y1 = p1[0] * h + (h / 2);
    x2 = width;
    y2 = p1[0] * h + (h / 2);
  } else if ((p1[0] == 0 && p1[1] == 0) && (p2[0] == 2 && p2[1] == 2)) {
    x1 = 0;
    y1 = 0;
    x2 = width;
    y2 = height;
  } else if ((p1[0] == 0 && p1[1] == 2) && p2[0] == 2 && p2[1] == 0) {
    x1 = width
    y1 = 0;
    x2 = 0;
    y2 = height;
  }



  strokeWeight(10);
  stroke(255, 0, 0, 127);
  line(x1, y1, x2, y2);

}

function mousePressed() {
  let x, y;
  if ((mouseX >= 0 && mouseX <= width) &&
    (mouseY >= 0 && mouseY <= height) && currnetPlayer == human) {
    calcAvailble();
    x = floor(mouseX / w);
    y = floor(mouseY / h);

    if (board[y][x] == '') {
      board[y][x] = players[human];
      currnetPlayer = ai;
    }
  }
}