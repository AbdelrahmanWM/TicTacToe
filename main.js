function Cell() {
  let value = 0;
  function getValue() {
    return value;
  }
  function setValue(newValue) {
    value = newValue;
  }
  function isOccupied() {
    return value != 0;
  }
  return { getValue, setValue, isOccupied };
}

function Board() {
  let rows = 3;
  let columns = 3;
  let board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(new Cell());
    }
  }
  function isWithinBounds(x, y) {
    return x < rows && x >= 0 && y < columns && y >= 0;
  }
  function getBoard() {
    return board.map((row) => row.map((cell) => cell.getValue()));
  }
  function updateBoard(x, y, marker) {
    if (isWithinBounds(x, y) && !board[x][y].isOccupied()) {
      console.log("value:"+board[x][y].getValue())
      board[x][y].setValue(marker);
      return true;
    }
    return false;
  }

  function isBoardFullyOccupied() {
    let flag = true;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isOccupied()) flag = false;
      });
    });
    return flag;
  }
  function checkWinCondition(marker) {
    let length = rows;
    let rowFlag = Array.from({ length }, () => true);
    let columnFlag = Array.from({ length }, () => true);
    let mainDiagonalFlag = true;
    let secondaryDiagonalFlag = true;

    for (let i = 0; i < rows; i++)
      for (let j = 0; j < columns; j++) {
        if (board[i][j].getValue() !== marker) {
          rowFlag[i] = false;
          columnFlag[j] = false;
          if (i == j) mainDiagonalFlag = false;
          if (i == length - j - 1) secondaryDiagonalFlag = false;
        }
      }
    return (
      rowFlag.includes(true) ||
      columnFlag.includes(true) ||
      mainDiagonalFlag ||
      secondaryDiagonalFlag
    );
  }
  function printBoard() {
    let board = getBoard();
    board.forEach((row) => {
      console.log(row);
    });
  }
  function clearBoard(){
    console.log("clear");
   for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      board[i][j].setValue(0);
    }
   }
  }
  return {
    getBoard,
    updateBoard,
    isBoardFullyOccupied,
    checkWinCondition,
    printBoard,
    clearBoard
  };
}

function Player(name = "default", marker = 0) {
  let playerName = name;
  let playerMarker = marker;
  function getName() {
    return playerName;
  }
  function getMarker() {
    return playerMarker;
  }
  return { getName, getMarker };
}

let TicTacToeGame = (function () {
  let player1 = Player("X", "X");
  let player2 = Player("O", "O");
  let players = [player1, player2];
  let activePlayer = players[0];
  let board = Board();
  let gameEnded = false;
  function gameEnd() {
    return gameEnded;
  }
  // let consoleInput=ConsoleInput();  // for console
  let getActivePlayer = () => activePlayer;
  function switchPlayer() {
    if (activePlayer === players[0]) activePlayer = players[1];
    else if (activePlayer === players[1]) activePlayer = players[0];
  }
  function updateBoard() {
    board.printBoard();
    console.log(`${activePlayer.getName()}'s tern:`);
  }
  
  function playRound(x, y) {
    if (!gameEnded) {
      let marker = activePlayer.getMarker();
      console.log(marker);
      updateBoard();
      let game = board.updateBoard(x, y, marker);
      if (board.checkWinCondition(marker)) {
        gameEnded = true;
        return `${marker} has won!`;
      } else if (board.isBoardFullyOccupied()) {
        gameEnded = true;
        return "Its a draw";
      }
      if(game===true)
      switchPlayer();
      return true;
    }
    return false;
  }
  function getBoard() {
    return board.getBoard();
  }
  function restartGame(){
    board.clearBoard();
    gameEnded=false;
  }
  // function playRoundConsole(){   // for console
  //     updateBoard();
  //     console.log("Enter the coordinates (x and y) for your next move:");
  //    process.stdout.write('x: ');
  //     let x=consoleInput.promptNumber();
  //     process.stdout.write('y: ');
  //     let y=consoleInput.promptNumber();
  //     let game=board.updateBoard(x,y,activePlayer.getMarker());
  //     while(!game){
  //         console.log(`(${x},${y}) is invalid, enter a new cell!`);
  //         console.log("Enter the coordinates (x and y) for your next move:");
  //         process.stdout.write('x: ');
  //          x=consoleInput.promptNumber();
  //         process.stdout.write('y: ');
  //         y=consoleInput.promptNumber();
  //         game=board.updateBoard(x,y,activePlayer.getMarker());
  //     }
  //     if(board.checkWinCondition(activePlayer.getMarker()))
  //     {   board.printBoard();
  //         console.log(`${activePlayer.getName()} won the game!`);
  //         return false;
  //     }
  //     else if(board.isBoardFullyOccupied())
  //     {   board.printBoard();
  //         console.log("Its a draw!");
  //         return false;
  //     }
  //     switchPlayer();
  //     return true;
  // }
  // function gameConsole(){  // for console
  //     console.log("Welcome to Tic Tac Toe game!")
  //     console.log('Round begins:')
  //   let done=playRoundConsole();
  //   while(done){
  //     done=playRoundConsole();
  //   }
  // }
  return { playRound, getActivePlayer, getBoard, gameEnd,restartGame /*gameConsole,*/ };
})();
// TicTacToeGame.gameConsole()

// function ConsoleInput(){   // for console
//     const prompt=require('prompt-sync')();
//     function promptNumber(){
//         let number=prompt("")
//         while(Number.isNaN(Number(number))){
//             number=prompt( "Wrong input, enter a number! ");
//         }
//         return number;
//     }
//     return {promptNumber}
// }

let graphicalUserInteface = (function () {
  let tictactoeBoard = document.querySelector(".tictactoeBoard");


  function establishBoard() {
    updateActivePlayer("Game began")
    tictactoeBoard.innerHTML="";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cell = document.createElement("button");
        cell.classList.add("cell");
        cell.classList.add('empty');
        cell.dataset.row = i;
        cell.dataset.column = j;
        cell.id = "cell" + i * 3 + j;
        tictactoeBoard.appendChild(cell);
      }
    }
    handlers();
  }

  function handlePlayerClick() {
    
    tictactoeBoard.addEventListener("click",handler);
   
    function handler (event) {
        let x;
        let y;
        let id;
        if (event.target.closest(".tictactoeBoard")) {
          if (event.target.dataset.row) {
            event.preventDefault();
            x = event.target.dataset.row;
            y = event.target.dataset.column;
            id = event.target.id;
            updateCell(id);
           updateActivePlayer();
            let result = TicTacToeGame.playRound(x, y);
            if (TicTacToeGame.gameEnd(result)) {
              updateActivePlayer(result);
              tictactoeBoard.removeEventListener('click',handler);
              refreshGame();
              // return;
          }
          }
        }
      }
  }
  function updateCell(id) {
    let cell = document.getElementById(id);
    if(cell.classList.contains('empty')){
    cell.innerHTML = TicTacToeGame.getActivePlayer().getMarker();
    cell.classList.remove('empty')
    }
  }
  function updateActivePlayer(msg=false){
    let name=TicTacToeGame.getActivePlayer().getName();
    let playerDev=document.querySelector(".gamePage .player p");
    if(msg)playerDev.innerHTML=msg;
    else playerDev.innerHTML=`${name}'s tern`;
    playerDev.style.color="red";
    setTimeout(()=>playerDev.style.color="black",900);
  }

  function randRotate(){
    document.addEventListener('mouseover',function(event){
           if(event.target.classList.contains('rotate')){
            let random = Number.parseInt(Math.random() * 180);
            event.target.style.transform = `rotate(${random}deg)`;
           }

    })
  }
  function restartGame(){
    let restart=document.querySelector('.gamePage .restart');
    restart.onclick=function(){
      console.log("clicked restart");
      TicTacToeGame.restartGame();
    establishBoard();
    }
  }

  function refreshGame(){
    let restart=document.querySelector('.gamePage .restart');
    setTimeout(()=>{restart.click(); updateActivePlayer("Game began")},2000);
  }

  updateActivePlayer();
  // handlers();
function handlers(){
  updateActivePlayer()
  randRotate();
handlePlayerClick();
  restartGame();
}
establishBoard();

})();
