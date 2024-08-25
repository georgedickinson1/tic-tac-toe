// Display Logic //
const display = {
    cells: document.querySelectorAll(".cell"),
    // chosenCells: [],
    activePlayerContainer: function(activePlayer) {
        const activeContainer = document.querySelector(".active-player");
        activeContainer.textContent = activePlayer;
    },
    markCell: function(activePlayer, cell) {
        console.log(activePlayer, cell)
    },
    selectedCell: function(activePlayer) {
        let mark = activePlayer.playerNumber === 1 ? "X" : "O";
        console.log(activePlayer)
        return new Promise((resolve) => {
            this.cells.forEach(cell => {
                cell.addEventListener("click", () => {
                    if (cell.textContent === "") {  // Check if the cell is empty
                        console.log(activePlayer);
                        let selectedCell = "";
                        switch (cell.id) {
                            case "a1": selectedCell = "A1"; break;
                            case "a2": selectedCell = "A2"; break;
                            case "a3": selectedCell = "A3"; break;
                            case "b1": selectedCell = "B1"; break;
                            case "b2": selectedCell = "B2"; break;
                            case "b3": selectedCell = "B3"; break;
                            case "c1": selectedCell = "C1"; break;
                            case "c2": selectedCell = "C2"; break;
                            case "c3": selectedCell = "C3"; break;
                            default: console.log("Try again"); break;
                            }
                            if (selectedCell) {
                                cell.textContent = mark;
                                // this.chosenCells.push(cell.id);
                                this.markCell(activePlayer, selectedCell);
                                resolve(selectedCell); // Resolve the Promise with the selected cell
                            }
                        }
                    }),{ once: true }
                })
        });
    },
    resetDisplay: function() {
        this.cells.forEach(cell => {
            cell.textContent = ""; 
        });
        this.chosenCells = [];
    }
};

// Game Logic //
// Gameboard Object
const gameboard = (function(){
    return {
        remainingPositions: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
        removePosition: function(choice) {
            gameboard.remainingPositions.splice(gameboard.remainingPositions.indexOf(choice), 1);
        }
    };
})();

// Player Object
function createPlayer(name, playerNumber) {
    return {
        name: name,
        choices: [],
        playerNumber: playerNumber,
        // Takes player's choice and checks against remaining positions on board
        turn: async function(activePlayer) {
            // Use await to get the user's choice asynchronously
            const choice = await display.selectedCell(activePlayer);
            
            if (gameboard.remainingPositions.includes(choice)) {
                this.choices.push(choice);
                gameboard.removePosition(choice);
                return choice; // Return the valid choice
            } else {
                console.log("Invalid choice, please try again.");
                return this.turn(); // Recursively call the function again
            }
        }
    };
};

let player1 = createPlayer("John", 1);
let player2 = createPlayer("Jane", 2);

// Game Controller Object
const gameController = (function(player1, player2){
    board = gameboard;
    gameOver = false;
    // Active player set to player1 by default, function to switch this
    let activePlayer = player1;
    display.activePlayerContainer(activePlayer.name);
    const switchActivePlayer = () => {
        if (activePlayer === player1) {
            activePlayer = player2;
        } else if (activePlayer === player2) {
            activePlayer = player1;
        };
    };

    async function gameLoop() {
        while (!gameOver) {
            display.activePlayerContainer(activePlayer.name);
            const choice = await activePlayer.turn(activePlayer);
            activePlayer.choices.push(choice);
            gameboard.removePosition(choice);
            console.log(`${activePlayer.name} choices: ${activePlayer.choices}`);
            console.log("Remaining Positions: " + board.remainingPositions);
            checkGameOver();
            if (!gameOver) {
                switchActivePlayer();
            }
        }
    }

    // Check if any winning positions have been chosen or game is tied
    function checkGameOver() {
        const winningPositions = [
            ["A1", "A2", "A3"], ["B1", "B2", "B3"], ["C1", "C2", "C3"],
            ["A1", "B1", "C1"], ["A2", "B2", "C2"], ["A3", "B3", "C3"],
            ["A1", "B2", "C3"], ["A3", "B2", "C1"]
        ];
    
        const includesAll = (arr, values) => values.every(v => arr.includes(v));
    
        winningPositions.forEach(position => {
            if (includesAll(player1.choices, position)) {
                console.log("Player 1 has won!");
                gameOver = true;
                resetGame();
            } else if (includesAll(player2.choices, position)) {
                console.log("Player 2 has won!");
                gameOver = true;
                resetGame();
            } else if (gameboard.remainingPositions.length === 0) {
                console.log("Tie");
                gameOver = true;
                resetGame();
            }
        });
    };
    // Function to reset game that is called when game is over
    function resetGame() {
        gameboard.remainingPositions = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        player1.choices = [];
        player2.choices = [];
        gameOver = false;
        display.resetDisplay();
        console.log("Game Reset");
    };
    gameLoop();
})(player1, player2);