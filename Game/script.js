init()

var isTimerActive = false;
var cards;

//functions
function init() {
    const rareCards = document.getElementById('rare-cards');
    rareCards.style.display = 'none';

    const diceContainer = document.getElementById('dice-container');
    diceContainer.style.animationPlayState = 'paused';

    const diceElements = document.querySelectorAll('.dice');
    const randomIndex = Math.floor(Math.random() * 6);
    diceElements.forEach((dice, index) => {
        if (index === randomIndex) {
            dice.style.display = 'block';
        } else {
            dice.style.display = 'none';
        }
    });

    const getCards = async () => {
        const response = await fetch("./cards.json");
        cards = await response.json();
    };
    (async () => {
        await getCards();
    })();
}

async function rollDice() {
    const diceElements = document.querySelectorAll('.dice');
    rotateDice();

    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * 6);

        diceElements.forEach((dice, index) => {
            if (index === randomIndex) {
                dice.style.display = 'block';
            } else {
                dice.style.display = 'none';
            }
        });
        await sleep(100);
    }
}

function rotateDice() {
    const diceContainer = document.getElementById('dice-container');

    diceContainer.style.transition = 'transform 2s';
    diceContainer.style.transform = 'rotate(360deg)';

    function resetRotation() {
        diceContainer.style.transition = 'none';
        diceContainer.style.transform = 'rotate(0deg)';
    }

    diceContainer.addEventListener('transitionend', resetRotation);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function common() {
    const commonCards = document.getElementById('common-cards');
    const rareCards = document.getElementById('rare-cards');
    commonCards.style.display = 'block';
    rareCards.style.display = 'none';

    var index = Math.floor(Math.random() * cards.common.length);
    var theme = cards.common[index];
    const themeName = Object.keys(theme)[0];
    theme = theme[themeName];
    var index1 = Math.floor(Math.random() * theme.length);
    var index2 = Math.floor(Math.random() * theme.length);
    if (index1 === index2) {
        index1++;
        if (index1 >= theme.length) {
            index1 -= 2;
        }
    }
    const card1Data = theme[index1];
    const card2Data = theme[index2];

    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');

    card1.children[0].textContent = themeName.toUpperCase();
    card1.children[1].children[0].children[0].children[1].children[0].textContent = card1Data[1];
    card1.children[1].children[0].children[1].children[1].children[0].textContent = card1Data[2];
    card1.children[1].children[0].children[2].children[1].children[0].textContent = card1Data[3];
    card1.children[1].children[0].children[3].children[1].children[0].textContent = card1Data[4];
    card1.children[1].children[0].children[4].children[1].children[0].textContent = card1Data[5];

    card2.children[0].textContent = themeName.toUpperCase();
    card2.children[1].children[0].children[0].children[1].children[0].textContent = card2Data[1];
    card2.children[1].children[0].children[1].children[1].children[0].textContent = card2Data[2];
    card2.children[1].children[0].children[2].children[1].children[0].textContent = card2Data[3];
    card2.children[1].children[0].children[3].children[1].children[0].textContent = card2Data[4];
    card2.children[1].children[0].children[4].children[1].children[0].textContent = card2Data[5];
}

function rare() {
    const commonCards = document.getElementById('common-cards');
    const rareCards = document.getElementById('rare-cards');
    rareCards.style.display = 'block';
    commonCards.style.display = 'none';

    var index = Math.floor(Math.random() * cards.rare.length);
    var theme = cards.rare[index];
    const themeName = Object.keys(theme)[0];
    theme = theme[themeName];
    const description = theme.description;
    var index1 = Math.floor(Math.random() * theme.words.length);
    var index2 = Math.floor(Math.random() * theme.words.length);
    if (index1 === index2) {
        index1++;
        if (index1 >= theme.words.length) {
            index1 -= 2;
        }
    }
    const card1Word = theme.words[index1];
    const card2Word = theme.words[index2];

    const card1 = document.getElementById('card3');
    const card2 = document.getElementById('card4');

    card1.children[0].textContent = themeName.toUpperCase();
    card1.children[1].textContent = description;
    card1.children[2].textContent = card1Word;

    card2.children[0].textContent = themeName.toUpperCase();
    card2.children[1].textContent = description;
    card2.children[2].textContent = card2Word;
}

function timer() {
    let timerValue = 60;
    const timerElement = document.getElementById('timer');

    if (isTimerActive) {
        timerElement.textContent = 60;
        timerElement.style.color = 'black';
        isTimerActive = false;
        return;
    }

    function updateTimer() {
        if (!isTimerActive) {
            return;
        }

        timerValue--;
        timerElement.textContent = timerValue;

        if (timerValue >= 0) {
            if (timerValue === 0) {
                timerElement.style.color = 'red';
            } else {
                timerElement.style.color = 'black';
            }
            setTimeout(updateTimer, 1000);
        } else {
            timerElement.textContent = '0';
            timerElement.style.color = 'red';
        }
    }

    isTimerActive = true;
    updateTimer();
}