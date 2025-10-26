const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const levelText = document.getElementById('levelText');
const timerText = document.getElementById('timer-text');
const lifelineBtn = document.getElementById('lifelineBtn');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let allQuestions = {}; 

// نظام المراحل
const LEVELS = ['easy', 'medium', 'hard', 'impossible'];
let currentLevelIndex = 0;
const MAX_QUESTIONS_PER_LEVEL = 10;
const CORRECT_BONUS = 10;
const TIME_PER_QUESTION = 15; 
let timerInterval = null;
let timeLeft = TIME_PER_QUESTION;
let isLifelineUsed = false; 

// تحميل ملفات الصوت
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');


fetch('./questions.json')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        allQuestions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error("Failed to load questions.json", err);
    });

startGame = () => {
    score = 0;
    currentLevelIndex = 0;
    startLevel();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

startLevel = () => {
    if (currentLevelIndex >= LEVELS.length) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    questionCounter = 0; 
    isLifelineUsed = false; 
    updateLifelineButton();

    const currentLevelName = LEVELS[currentLevelIndex];
    
    updateLevelUI(currentLevelName);

    if (!allQuestions[currentLevelName] || allQuestions[currentLevelName].length === 0) {
        console.error(`No questions found for level: ${currentLevelName}`);
        currentLevelIndex++;
        return startLevel();
    }
    
    availableQuesions = [...allQuestions[currentLevelName]];
    getNewQuestion();
};

updateLevelUI = (levelName) => {
    const capitalizedLevelName = levelName.charAt(0).toUpperCase() + levelName.slice(1);
    levelText.innerText = capitalizedLevelName;
    document.body.className = '';
    document.body.classList.add(`level-${levelName}`);
};

getNewQuestion = () => {
    resetTimer(); 

    choices.forEach(choice => {
        choice.parentElement.classList.remove('hidden-choice');
    });

    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS_PER_LEVEL) {
        currentLevelIndex++;
        return startLevel();
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS_PER_LEVEL}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS_PER_LEVEL) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
    startTimer(); 
};

startTimer = () => {
    timeLeft = TIME_PER_QUESTION;
    timerText.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            handleAnswer(null); 
        }
    }, 1000);
};

resetTimer = () => {
    clearInterval(timerInterval);
};

handleAnswer = (selectedAnswer) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    resetTimer();

    let classToApply = 'incorrect';
    let selectedChoiceElement = null;

    if (selectedAnswer !== null) {
        selectedChoiceElement = choices.find(c => c.dataset['number'] === selectedAnswer);
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct';
            incrementScore(CORRECT_BONUS);
            correctSound.play();
        } else {
            wrongSound.play();
        }
    } else {
        wrongSound.play();
    }
    
    if(selectedChoiceElement) {
         selectedChoiceElement.parentElement.classList.add(classToApply);
    }
   
    if (classToApply === 'incorrect') {
        const correctChoice = choices.find(c => c.dataset['number'] == currentQuestion.answer);
        if(correctChoice) {
            correctChoice.parentElement.classList.add('correct');
        }
    }

    setTimeout(() => {
        if (selectedChoiceElement) {
            selectedChoiceElement.parentElement.classList.remove(classToApply);
        }
        choices.forEach(c => c.parentElement.classList.remove('correct'));

        getNewQuestion();
    }, 2000); 
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        const selectedAnswer = e.target.dataset['number'];
        handleAnswer(selectedAnswer);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

lifelineBtn.addEventListener('click', () => {
    if (isLifelineUsed || !acceptingAnswers) return;

    isLifelineUsed = true;
    updateLifelineButton();

    const correctAnswer = currentQuestion.answer;
    let wrongChoices = [];
    
    choices.forEach(choice => {
        if(choice.dataset['number'] != correctAnswer) {
            wrongChoices.push(choice);
        }
    });
    
    wrongChoices.sort(() => Math.random() - 0.5);
    const choicesToHide = wrongChoices.slice(0, 2);

    choicesToHide.forEach(choice => {
        choice.parentElement.classList.add('hidden-choice');
    });
});

updateLifelineButton = () => {
    lifelineBtn.disabled = isLifelineUsed;
    lifelineBtn.querySelector('span').innerText = isLifelineUsed ? '(0)' : '(1)';
};