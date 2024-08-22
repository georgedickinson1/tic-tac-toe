// Display Logic //
const display = {
    activePlayerContainer: function(activePlayer) {
        const activeContainer = document.querySelector(".active-player");
        activeContainer.textContent = activePlayer;
    },
    selectedCell: async function() {
        return new Promise((resolve) => {
            const cells = document.querySelectorAll(".cell");
            cells.forEach(cell => {
                cell.addEventListener("click", () => {
                    let selectedCell = "";
                    switch (cell.id) {
                        case "a1":
                            selectedCell = "A1";
                            break;
                        case "a2":
                            selectedCell = "A2";
                            break;
                        case "a3":
                            selectedCell = "A3";
                            break;
                        case "b1":
                            selectedCell = "B1";
                            break;
                        case "b2":
                            selectedCell = "B2";
                            break;
                        case "b3":
                            selectedCell = "B3";
                            break;
                        case "c1":
                            selectedCell = "C1";
                            break;
                        case "c2":
                            selectedCell = "C2";
                            break;
                        case "c3":
                            selectedCell = "C3";
                            break;
                    }
                    if (selectedCell) {
                        resolve(selectedCell); // Resolve the Promise with the selected cell
                    }
                }, { once: true }); // Ensures the event listener is removed after the first click
            });
        });
    },
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
function createPlayer(name) {
    return {
        name: name,
        choices: [],
        // Takes player's choice and checks against remaining positions on board
        turn: async function() {
            // Use await to get the user's choice asynchronously
            const choice = await display.selectedCell();
            
            if (gameboard.remainingPositions.includes(choice)) {
                console.log("Passed");
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

let player1 = createPlayer("John");
let player2 = createPlayer("Jane");

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
            // display.activePlayerContainer(activePlayer);
        } else if (activePlayer === player2) {
            activePlayer = player1;
            // display.activePlayerContainer(activePlayer);
        };
    };


    async function gameLoop() {
        while (!gameOver) {
            await activePlayer.turn();
            console.log(`${activePlayer.name} choices: ${activePlayer.choices}`);
            console.log("Remaining Positions: " + board.remainingPositions);
            checkGameOver();
            if (!gameOver) {
                switchActivePlayer();
                display.activePlayerContainer(activePlayer.name);
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
        console.log("Game Reset");
    };
    gameLoop();
})(player1, player2);