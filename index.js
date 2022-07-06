// 'use strict';

//gameboard module
const gameBoard = (() => {
    let board = [];
    const createBoard = () => {    
        for (let index = 0; index < 9; index++) {
            board.push(" ");
            let square = document.createElement("div");
            square.className = "square";
            square.id = index;
            square.innerHTML = "";
            document.querySelector('.board').appendChild(square);    
        }
    }

    return { board, createBoard } ;
})();


//player factory
const playerFactory = (name, symbol) => {
    console.log(name);
    return {name, symbol, marks: []}
}

//set up player module
const setUp = (() => {
    let setup = document.getElementById('setup');
    
    let p = 1
    while (p < 3) {
        let label = document.createElement("label");
        label.for = `p${p}`;
        label.innerHTML = `Player ${p} name`;
        let inputName = document.createElement("input");
        inputName.type = "text";
        inputName.name = `p${p}`;
        inputName.id = `p${p}`;
        setup.appendChild(label);
        setup.appendChild(inputName);
        p++;
    }
    let start = document.createElement("button");
    start.innerHTML = "Start the game";
    start.addEventListener('click', () => {
        game.play();
        }
    )
    setup.appendChild(start);

    return
})();


//game module
const game = (() => {
    let row = [];
    let column = [];
    let diagonal = []; 
    let gameOver = false;
    let playing;
    
    const play = () => {
        
        player1 = playerFactory(document.getElementById('p1').value, "X");
        player2 = playerFactory(document.getElementById('p2').value, "O");

        document.getElementById('setup').remove();
        gameBoard.createBoard();
        

        playing = player1;

        document.querySelectorAll('.square').forEach(sq => {
            sq.addEventListener('click', function mark(e){
                if(!gameOver){
                    e.target.innerHTML = playing.symbol;
                    update(e.target.id);
                    e.target.removeEventListener('click', mark);
                    }
                });
        });
    }

    const update = (id) => {
        if(!gameOver){
            gameBoard.board[id] = playing.symbol;
            
            //check row
            row = logic.getRow(id);
            if (logic.checkArray(row, playing.symbol)){
                console.log("winning");
                declareWinner(row);
            }

            //check column
            column = logic.getColumn(id);
            if (logic.checkArray(column, playing.symbol)){
                declareWinner(column);
            }

            //check diagonal
            if(id % 2 === 0){
                diagonal = logic.getDiagonal(id);
                if(logic.checkArray(diagonal, playing.symbol)){
                    declareWinner(diagonal);         
                }
            }
        
            playing = playing === player1 ? player2 : player1;
        }

        //declare a tie
        if(gameBoard.board.every(sq => sq != " ") & !gameOver){    
            document.getElementById('info').innerHTML = "It's a tie!";
            endGame();
        }

    }

    const declareWinner = (winningArray) => {
        document.getElementById('info').innerHTML = `And the winner is ${playing.name}`
        endGame();
    }

    const endGame = () => {
        gameOver = true;
        let reset = document.createElement("button");
        reset.innerHTML = "Reset";
        reset.addEventListener("click", () => {
            location.reload()
            return false;
        });
        document.getElementById('info').appendChild(reset);
    }

    return { play }

})() ;

//logic module
const logic = (() => {
    const getRow = (square)  => {
        let result = square < 3 ? [0, 1, 2] :
                    square > 5 ? [6, 7, 8] : [3, 4, 5];
        return result;
    }
    
    const getColumn = (square) => {
        let result = square % 3 === 0 ? [0, 3, 6] :
                    (square - 1) % 3 === 0 ? [1, 4, 7] : [2, 5, 8]
        return result
    }

    const getDiagonal = (square) => {
        if(square % 4 === 0){
            return [0, 4, 8]
        }
        return [2, 4, 6];
    }

    const checkArray = (array, symbol) => {
        return (array.every(index => gameBoard.board[index] === symbol));
    }
    return{ getRow, getColumn, getDiagonal, checkArray };
})()


