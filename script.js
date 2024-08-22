// Game Logic //

// Create Gameboard
const Gameboard = (() => {
    return {
        remainingPositions: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
    };
})();

// Function to remove chosen position from remaining positions
function removePosition(choice) {
    Gameboard.remainingPositions.splice(Gameboard.remainingPositions.indexOf(choice), 1);
};

// Actions that players can take
const playerActions = {
    turn() {
        let acceptableChoice = false;
        while (acceptableChoice == false) {
            const choice = prompt("Where would you like to go?");
            if (Gameboard.remainingPositions.includes(choice)) {
                console.log("Passed");
                this.choices.push(choice);
                removePosition(choice);
                checkGameOver();
                acceptableChoice = true;
                return choice;
            } else {
                acceptableChoice = false;
            };
        };
    },
};

// Create player factory function
function createPlayer(name) {
    const player = Object.create(playerActions);
    player.name = name;
    player.choices = [];
    return player;
};

let player1 = createPlayer("John");
let player2 = createPlayer("Jane");



let gameOver = false;
// while (gameOver === false) {
//     console.log(player1.turn());
//     console.log(player1.choices);
//     console.log(Gameboard.remainingPositions);
//     console.log("################")
// }


// Function to check if game is over
function checkGameOver() {
    const winningPositions = [
        ["A1", "A2", "A3"], ["B1", "B2", "B3"], ["C1", "C2", "C3"],
        ["A1", "B1", "C1"], ["A2", "B2", "C2"], ["A3", "B3", "C3"],
        ["A1", "B2", "C3"], ["A3", "B2", "C1"]
    ];

    const includesAll = (arr, values) => values.every(v => arr.includes(v));

    winningPositions.forEach(position => {
        console.log("checked")
        if (includesAll(player1.choices, position)) {
            console.log("Player 1 has won!");
            gameOver = true;
            resetGame();
        } else if (includesAll(player2.choices, position)) {
            console.log("Player 2 has won!");
            gameOver = true;
            resetGame();
        } else if (Gameboard.remainingPositions.length === 0) {
            console.log("Tie");
            gameOver = true;
            resetGame();
        }
    });
};

// Function to control the flow of the game
function GameController(player1, player2) {
    const board = Gameboard;
    let activePlayer = player1;

    const switchActivePlayer = () => {
        if (activePlayer === player1) {
            activePlayer = player2;
        } else if (activePlayer === player2) {
            activePlayer = player1;
        };
    };

    while (gameOver === false) {
        activePlayer.turn();
        console.log(`${activePlayer.name} choices: ` + activePlayer.choices);
        console.log("Remaining Positions: " + board.remainingPositions);
        switchActivePlayer();
    };

};

// GameController(player1, player2);

// Reset game function
function resetGame() {
    Gameboard.remainingPositions = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
    player1.choices = [];
    player2.choices = [];
    gameOver = false;
    console.log("Game Reset");
    GameController(player1, player2);
};

// Display/DOM Logic //

const display = {
    options: document.querySelectorAll(".cell"),
};