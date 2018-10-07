var origBoard = [];
const humPlayer ='o';
const aiPlayer = 'x';
const winComb = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

const cells = document.querySelectorAll('.cell');

start();
function start(){
  document.querySelector('.gameend').style.display = 'none';
  origBoard =[0,1,2,3,4,5,6,7,8];
  for( var i=0; i<cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', kick);
   }
  
  }
 function kick(evt){
  // console.log('kick');
  // console.log(evt.target.id);
   //console.log(typeof origBoard[evt.target.id]);
  if(typeof origBoard[evt.target.id] == 'number'){
       
       game(evt.target.id, humPlayer);
      // console.log('next after humplayer');
	  if (!checkTie()) 
       game(spot(), aiPlayer);
   }
      
       
   
 }

function game(cellId, player){
 // console.log('start game');
  //console.log(player);
  document.getElementById(cellId).innerText = player;
  origBoard[cellId]= player;
 // console.log(origBoard);
  var whoWon = checkWin(origBoard, player)
//  console.log('checkWin');
 // console.log(whoWon);
  if(whoWon) gameEnd(whoWon);

}

function checkWin(board, player){
 // console.log(board);
 // console.log(player);
  var playArr = board.reduce((acc, elem, ind) => (elem===player)? acc.concat(ind) : acc, []);
// console.log(playArr);
  var whoWon =null;
  for( var [index, arr] of winComb.entries()){
    if(arr.every((e)=> playArr.indexOf(e)> -1)){
        whoWon ={ index: index, player: player};
       break;
       }
  }
 // console.log(whoWon);
   return whoWon;
}

function gameEnd(whoWon){
  for(var index of winComb[whoWon.index]){
    document.getElementById(index).style.backgroundColor = (whoWon.player == humPlayer) ?'blue':'red';
  }
  for( var i=0; i<cells.length; i++){
    cells[i].removeEventListener('click',kick);
  };
  var winner = whoWon.player == humPlayer? "you win!":"you lose !";
  declareWinner(winner);
  
}

function emptyCells(){
  return origBoard.filter(e => typeof e == 'number');
}

function spot(){
  console.log('spot');
 // console.log(emptyCells()[0]);
 // return emptyCells()[0];
  return miniMax(origBoard, aiPlayer).index;
}
function declareWinner(player){
  document.querySelector('.gameend').style.display = 'block';
  document.querySelector('.gameend .txt').innerText = player;
}

function checkTie(){
  //console.log('checkTie');
  //console.log(emptyCells().length);
  if(emptyCells().length == 0){
    //console.log('within 0 length');
    for(var i=0; i<cells.length;i++){
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('cilck', kick);
    }    
    //console.log('tie');
    declareWinner('Tie !');
    return true;
  }
  return false;
}

function miniMax(newBoard, player) {
	var availSpots = emptyCells(newBoard)
  //console.log('minimax');

	if (checkWin(newBoard, humPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = miniMax(newBoard, humPlayer);
			move.score = result.score;
		} else {
			var result = miniMax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}