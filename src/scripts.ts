const hiddenCards = document.querySelector('.memory-game') as HTMLElement;
const startGame = document.getElementById('start-game');
const score = document.querySelector('.score') as HTMLElement;
const text = document.querySelector('.text') as HTMLElement;
const text1 = document.querySelector('.text1') as HTMLElement;
const text2 = document.querySelector('.text2') as HTMLElement;
const text3 = document.querySelector('.text3') as HTMLElement;
const hiddenButton = document.querySelector('.button-wrapper') as HTMLElement;
const reset = document.querySelector('.button-reset') as HTMLElement;
const moves = document.querySelector('.moves') as HTMLElement;
const timer = document.querySelector('.time') as HTMLElement;

const cardsContainer = document.querySelector('.memory-game');
const colors = ['#45FFCA', '#D80032', '#FFE569'];
const colorsPicklist = [...colors, ...colors];
const cardCount = colorsPicklist.length;

// when start game is clicked
document.getElementById('start-game').addEventListener('click', function () {
    if (hiddenCards) {
        startGame.style.display = 'none'; // hide button
        hiddenButton.style.width = '0'; // remove button wrapper
        hiddenButton.style.height = '0';
        score.style.display = 'block'; // unhide text on screen
        moves.style.display = 'block'; // unhide text on screen
        text.style.display = 'block'; // unhide text on screen
        text1.style.display = 'block'; // unhide text on screen
        text2.style.display = 'block'; // unhide text on screen
        text3.style.display = 'block'; // unhide text on screen
        timer.style.display = 'block'; // unhide text on screen
        reset.style.display = 'block'; // unhide text on screen
        hiddenCards.style.display = (hiddenCards.style.display === 'none' || hiddenCards.style.display === '') ? 'grid' : 'none';
    }
});

//Game state
let revealedCount = 0;
let activeCard: HTMLDivElement = null;
let awaitingEndMove = false;
let scoreCount = 0;
let movesMade = 0;
let elapsedSeconds = 0;
let timerInterval: NodeJS.Timer | undefined;

// function for starting timer
function startTimer() {
    elapsedSeconds = 0;
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        document.querySelector('.time').textContent = elapsedSeconds.toString().padStart(2, '0');
    }, 1000);
}

// function for stoping timer
function stopTimer() {
    clearInterval(timerInterval);
}

//function to build board
function buildBoard(color: string) {
    const element = document.createElement("div"); //create div elements

    element.classList.add("card"); //add class name to div elements
    element.setAttribute('color', color); // set it as one of colors
    element.setAttribute('revealed', 'false'); // false to not see color

    element.addEventListener('click', () => {
        const revealed = element.getAttribute('revealed'); // on click reveal color

        // not be able to click
        if (awaitingEndMove || revealed === 'true' || element == activeCard) {
            return;
        }

        //when clicking add counter to moves
        movesMade++;
        moves.textContent = movesMade.toString();

        // start timer when 1st move has been made
        if (movesMade === 1) {
            startTimer();
        }

        element.style.backgroundColor = color;

        if (!activeCard) {
            activeCard = element;
            return;
        }

        const colorMatch = activeCard.getAttribute('color');

        // if colors match
        if (colorMatch === color) {
            element.setAttribute('revealed', 'true');
            activeCard.setAttribute('revealed', 'true');

            activeCard = null;
            awaitingEndMove = false;
            revealedCount += 2; // stay revealed
            scoreCount += 2; // add to score
            document.querySelector('.score').textContent = scoreCount.toString();
            moves.textContent = movesMade.toString();

            // if all cards revealed end game
            if (revealedCount === cardCount) {
                stopTimer();
                setTimeout(() => {
                    alert(`You win! You did it in ${elapsedSeconds} seconds. Moves made: ${movesMade}. Your score: ${scoreCount}`);
                }, 500);
            }
            return;
        }

        awaitingEndMove = true;

        // color changes to hidden when two are selected and they do not match
        setTimeout(() => {
            activeCard.style.backgroundColor = null;
            element.style.backgroundColor = null;

            awaitingEndMove = false;
            activeCard = null;
        }, 1000);
    });
    return element;
}

// Build cards
for (let i = 0; i < cardCount; i++) {
    const index = Math.floor(Math.random() * colorsPicklist.length);
    const color = colorsPicklist[index];
    const card = buildBoard(color);

    colorsPicklist.splice(index, 1);
    cardsContainer.appendChild(card);
}

// function to reset game
function resetGame() {
    // Reset game state variables
    revealedCount = 0;
    activeCard = null;
    awaitingEndMove = false;
    scoreCount = 0;
    movesMade = 0;

    // Reset the timer if it's running
    stopTimer();

    // Reset displayed scores
    document.querySelector('.score').textContent = scoreCount.toString();
    document.querySelector('.moves').textContent = movesMade.toString();
    document.querySelector('.time').textContent = '00';

    // Clear board
    const cardsContainer = document.querySelector('.memory-game');
    cardsContainer.innerHTML = ''; // Remove all child elements

    // Rebuild the board and shuffle
    const shuffledColorsPicklist = [...colors, ...colors];
    shuffledColorsPicklist.sort(() => Math.random() - 0.5);
    const newColorsPicklist = [...colors, ...colors];

    for (let i = 0; i < cardCount; i++) {
        const color = shuffledColorsPicklist[i];
        const card = buildBoard(color);
        cardsContainer.appendChild(card);
    }
}

// Call the reset function when the reset button is clicked
document.getElementById('reset-game').addEventListener('click', resetGame);
