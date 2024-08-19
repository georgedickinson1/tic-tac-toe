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

console.log(player1.turn());
console.log(player1.choices);
console.log(Gameboard.remainingPositions);

// Function to check if game is over
function checkGameOver() {

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

    const getActivePlayer = () => activePlayer;

};

// GameController();