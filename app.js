document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const squares = Array.from(document.querySelectorAll('.grid div'));
  const width = 10;
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  let nextRandom = 0;
  let timerId
  let score = 0;

  //creating the tetrominoes;
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [ width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [ width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [ width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  function draw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    });
  };

  function undraw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    });
  };  

  //assign keyCodes for moving pieces
  function control(event){
    if(event.keyCode === 37){
      moveLeft()
    } else if(event.keyCode === 38){
      rotate()
    } else if(event.keyCode === 39){
      moveRight()
    } else if(event.keyCode === 40){
      moveDown()
    };
  };

  document.addEventListener('keydown', control);
  
  function moveDown(){
    if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
    undraw()
    currentPosition += width
    draw();} else{
    freeze()};
  };

  // stops the piece at the bottom of the playing space and creates the next piece
  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    };
  };

  //move left within playing space, stopping moves outside the grid
  function moveLeft(){
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge) currentPosition -=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition +=1;
    };
    draw()
  };

  //move right within playing space, stopping moves outside the grid
  function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
    if(!isAtRightEdge) currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -=1;
    };
    draw()
  };

  // rotate the piece
  function rotate(){
    undraw();
    currentRotation ++;
    if(currentRotation === current.length){
      currentRotation = 0
    };
    current = theTetrominoes[random][currentRotation];
    draw();
  };


  // display next piece in mini grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  const nextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  function displayShape(){
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    });

    nextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    });
  };

  //functionality for start button
  startBtn.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    } else {
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
    }
  });

// score
function addScore(){
  for(let i = 0; i < 199; i +=width){
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    if(row.every(index => squares[index].classList.contains('taken'))){
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    };
  };
};

 //game over
 function gameOver(){
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    scoreDisplay.innerHTML = 'Game Over!';
    clearInterval(timerId);
  };
};


});