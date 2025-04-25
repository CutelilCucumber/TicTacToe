
//make whole thing a factory to spawn multiples
//function game (turnChoice, gameName) {

    const gameBoard = () => {
        let tiles = [];

        const createBoard = () => {
            for(let i = 0; i < 9; i++){
                tiles[i] = 'open';
                
            }

            
            //add 

        };
        //function to write into private array
        const markTile = (index, value) => {
            if (tiles[index] === 'open'){
                tiles[index] = value;
            }
        };
        //close tiles when game ends
        const closeBoard = () => {
            for(let i = 0; i < 9; i++){
                if (tiles[i] === 'open'){
                    tiles[i] = 'closed';
                }
                
            }
        }
        //function to retrieve tile data
        const getTiles = () => [...tiles];
        //reset board recalls initialize
        const resetBoard = () => createBoard();
        //initialize first board
        createBoard();

        return {markTile, closeBoard, getTiles, resetBoard};
    }

    //function play turn for event listener
    function playTurn (board, target) {
        //make sure a tile cannot be rewritten
        
        // console.log(printBoard (board.getTiles()));//obsolete later
        board.markTile(target, turn.getTurn());
        //function to determine win conditions
        const checkConditions = () => {
            if ((board.getTiles()[0] === board.getTiles()[1] && board.getTiles()[1] === board.getTiles()[2]
                    && board.getTiles()[0] !== 'open') ||
                (board.getTiles()[3] === board.getTiles()[4] && board.getTiles()[4] === board.getTiles()[5]
                    && board.getTiles()[3] !== 'open') ||
                (board.getTiles()[6] === board.getTiles()[7] && board.getTiles()[7] === board.getTiles()[8]
                    && board.getTiles()[6] !== 'open') ||
                (board.getTiles()[0] === board.getTiles()[3] && board.getTiles()[3] === board.getTiles()[6]
                    && board.getTiles()[0] !== 'open') ||
                (board.getTiles()[1] === board.getTiles()[4] && board.getTiles()[4] === board.getTiles()[7]
                    && board.getTiles()[1] !== 'open') ||
                (board.getTiles()[2] === board.getTiles()[5] && board.getTiles()[5] === board.getTiles()[8]
                    && board.getTiles()[2] !== 'open') ||
                (board.getTiles()[0] === board.getTiles()[4] && board.getTiles()[4] === board.getTiles()[8]
                    && board.getTiles()[0] !== 'open') ||
                (board.getTiles()[2] === board.getTiles()[4] && board.getTiles()[4] === board.getTiles()[6]
                    && board.getTiles()[2] !== 'open')) {
                        return 'win';
                    } else if (!board.getTiles().includes('open')) {
                        return 'tie';
                    } else {
                        return '';
                    }
            }

        let end = checkConditions();
        UI.boardDisplay(target, end);
       
    }

    //function to swap current player from X to O
    function currentTurn () {
        let current = 'X';

        const getTurn = () => {
            return current;
        }
        const swap = () => {
            if (current === 'X'){
                current = 'O';
            } else {
                current = 'X';
            }
        }
        const reset = () => {
            current = 'X';
        }
        return {getTurn, swap, reset}
    }

    function initialize (board) {
        const gameID = crypto.randomUUID();
        let tileEvents = [];
        
        const createUI = () => {
            //create container for 1 game
            let newElement = document.createElement('div');
            newElement.classList.add('activeGame');
            newElement.setAttribute('id', (gameID));
            document.getElementById('gameContainer').appendChild(newElement);
            //create html elements for each tile and add a listener
            for(let i = 0; i < 9; i++){
                newElement = document.createElement('div');
                newElement.classList.add('tile');
                document.getElementById(gameID).appendChild(newElement);
                newElement.setAttribute('id', (i+gameID));

                // event listener must be stored to remove later
                tileEvents[i] = function(e) {
                    let index = e.target.id.slice(0, 1);
                    playTurn(board, index);
                };

                newElement.addEventListener('click', tileEvents[i], {once: true});
            }
            let display = document.createElement('span');
            display.classList.add('display');
            display.setAttribute('id', ('display'+gameID));
            document.getElementById(gameID).appendChild(display);
            display.appendChild(document.createTextNode('Player X Turn'));

            newElement = document.createElement('button');
            newElement.classList.add('reset');
            document.getElementById(gameID).appendChild(newElement);
            newElement.appendChild(document.createTextNode('Restart Game'));

            newElement.addEventListener('click', () => {

                board.resetBoard();
                document.getElementById(gameID).remove();
                createUI();
                turn.reset();
            })
        }
        const boardDisplay = (index, end) => {
            document.getElementById(index+gameID).appendChild(document.createTextNode(turn.getTurn()));
            if (end === 'win'){
                document.getElementById('display'+gameID).textContent = 'Player '+turn.getTurn()+' Wins!';
                endListeners();
            } else if (end === 'tie') {
                document.getElementById('display'+gameID).textContent = 'Tied Game!';
                endListeners();
            } else {
                turn.swap();
                document.getElementById('display'+gameID).textContent = 'Player '+turn.getTurn()+' Turn!';
                
            }
            //turn on x or O on tile
            //switch the turn display element
        }
        const endListeners = () => {
            for (let i = 0; i < 9; i++) {
                let newElement = document.getElementById(i+gameID);
                newElement.removeEventListener('click', tileEvents[i]);
            }
        }
        
        createUI();
        return {createUI, boardDisplay}
    }
//end functions
let board = gameBoard();
let UI = initialize(board);
let turn = currentTurn();
