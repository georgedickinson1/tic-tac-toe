// Game Logic

// IIFE that creates the gameboard object
const gameboard = (function(){
    return {
        // Array representing the remaining positions on the gameboard
        remainingPositions: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],

        // Method to remove a chosen position from the gameboard
        removePosition: function(choice) {
            gameboard.remainingPositions.splice(gameboard.remainingPositions.indexOf(choice), 1);
        }
    };
})();

// Factory function to create a player object
function createPlayer(name, mark, playerNumber) {
    return {
        name: name, // Player's name
        choices: [], // Array to store player's chosen positions
        mark: mark,
        playerNumber: playerNumber,
    };
};

// Temporary intialization of two players
let player1 = createPlayer("John", "x", 1);
let player2 = createPlayer("Jane", "o", 2);

// IIFE that creates a gamecontroller object, managing the game state
const gameController = (function(player1, player2) {
    return {
        activePlayer: player1, // The current active player

        // Method to switch active player
        switchActivePlayer: function() {
            if (this.activePlayer === player1) {
                this.activePlayer = player2;
            } else if (this.activePlayer === player2) {
                this.activePlayer = player1;
            };
        },

        // Method to reset game to its initial state
        resetGame: function() {
        gameboard.remainingPositions = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
        player1.choices = [];
        player2.choices = [];
        // Clear marks on gameboard
        display.clearMarks();
        console.log("Game Reset");
        },

        // Method to check if game has been won or tied
        checkGameOver: function() {
            // All possible winning positions
            const winningPositions = [
                ["A1", "A2", "A3"], ["B1", "B2", "B3"], ["C1", "C2", "C3"],
                ["A1", "B1", "C1"], ["A2", "B2", "C2"], ["A3", "B3", "C3"],
                ["A1", "B2", "C3"], ["A3", "B2", "C1"]
            ];
            
            // Function to check if player's choices include any winning position
            const includesAll = (arr, values) => values.every(v => arr.includes(v));

            // Iterate through winning positions and check if any player has won
            for (let position of winningPositions) {
                if (includesAll(player1.choices, position)) {
                    console.log("Player 1 has won!");

                    this.resetGame();
                    return true; // Stop the function if Player 1 wins
                } else if (includesAll(player2.choices, position)) {
                    console.log("Player 2 has won!");

                    this.resetGame();
                    return true; // Stop the function if Player 2 wins
                }
            }

            // If no one has won and no remaining positions, it's a tie
            if (gameboard.remainingPositions.length === 0) {
                console.log("Tie");
                this.resetGame();
                return true;
            }
            
            return false; // No win or tie, continue the game
        },

        // Main game loop: handles game progression after each move
        gameLoop: function() {

            // Check if game is over after current move
            this.checkGameOver();
            
            // Switch to other player for next turn
            this.switchActivePlayer();

            // Display new active player's name
            display.activePlayerMark(this.activePlayer)
        },

        // Method to verify player made a valid choice
        verifyPlayerChoice: function(selectedCell, cell) {
            if (gameboard.remainingPositions.includes(selectedCell)) {
                // Add selected cell to active player's choice
                this.activePlayer.choices.push(selectedCell);

                // Mark cell
                display.markCell(cell);

                // Remove selected cell from remaining positions
                gameboard.removePosition(selectedCell);

                // Continue game loop with current move
                this.gameLoop();
            } else {
                console.log("Invalid choice, please try again.");
            };
        },
    };
})(player1, player2);

// Display Logic //

// Display object containing DOM methods
const display = {
    // Property assigned to cells that can be selected
    cells: document.querySelectorAll(".cell"), 

    // Method to display active player name
    // activePlayerContainer: function(activePlayer) {
    //     const activeContainer = document.querySelector(".active-player");
    //     activeContainer.textContent = activePlayer;
    // },

    // Method to change background color of player container to indicate active player
    activePlayerMark: function(activePlayer) {
        const player1Container = document.querySelector(".player1");
        const player2Container = document.querySelector(".player2");
        if (activePlayer.playerNumber === 1) {
            player1Container.style.backgroundColor = "#6bff97";
            player2Container.style.backgroundColor = "rgb(245, 245, 245)";
            player1Container.style.boxShadow = "0px 0px 50px 10px #6bff97";
            player2Container.style.boxShadow = "none";
        } else if (activePlayer.playerNumber === 2) {
            player2Container.style.backgroundColor = "#6bff97";
            player1Container.style.backgroundColor = "rgb(245, 245, 245)";
            player2Container.style.boxShadow = "0px 0px 50px 10px #6bff97";
            player1Container.style.boxShadow = "none";
        };
    },
    
    
    // Event handler added to each cell on initialization
    init: function() {
        this.cells.forEach(cell => {
            // When a cell is clicked call selectedCell method on current cell
            cell.addEventListener("click", this.selectedCell.bind(this));
        });
        // Display active player name on initialization
        this.activePlayerMark(gameController.activePlayer);
    },

    // Method to mark cell with active player's symbol
    markCell: function(selectedCell) {
        if (gameController.activePlayer.mark === "x") {
            selectedCell.innerHTML = `<i class="mark fa-solid fa-x"></i>`
        } else if (gameController.activePlayer.mark === "o") {
            selectedCell.innerHTML = `<i class="mark fa-solid fa-o" style="font-size: 1.1em"></i>`
        };
    },

    // Method to clear gameboard of all marks
    clearMarks: function() {
        this.cells.forEach(cell => {
            cell.textContent = "";
        })
    },
    
    // Method to check which cell was clicked
    selectedCell: function(event) {
        const cell = event.target;
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
        };
        // Send selection to the game loop and verify selection
        // Also sends cell object to send back to display to mark gameboard
        const choice = gameController.verifyPlayerChoice(selectedCell, cell);
        // If option was acceptable display mark
    },
};

// Initialize the display object to set up event listeners
display.init();