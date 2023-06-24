const homeNav = document.getElementById("homeNav");
const homeDiv = document.getElementById("home");
const questionsNav = document.getElementById("questionsNav");
const questionsDiv = document.getElementById("questions");
const resultsNav = document.getElementById("resultsNav");
const resultsDiv = document.getElementById("results");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nicknameInput = document.getElementById("nickName");
const rockButton = document.querySelector(".rockButton");
const cardContainer = document.getElementById("cardContainer");
const message = document.getElementById("resultMsg");
const validationMsg = document.getElementById("validationMsg");
const progressBar = document.getElementById("progress-bar");
const playAgainBtn = document.getElementById("playAgainBtn");

//--------------------------- VARIABLES GLOBALES -------------------------------------//
let currentQuestionIndex = 0;
let quizz;
let score = 0;

//-------------------------- FUNCIONES DE UTILIDAD --------------------------------------//
const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const getNickname = (nickname) => {
    return nickname === "" ? "Anonymous" : nickname;
};

//---------------------------- VISTAS Y LISTAS DE RESULTADOS ---------------------------------------//
const hideViews = () => {
    homeDiv.classList.add("hide");
    questionsDiv.classList.add("hide");
    resultsDiv.classList.add("hide");
};

const goHome = () => {
    hideViews();
    homeDiv.classList.remove("hide");
};

const goQuestions = () => {
    hideViews();
    questionsDiv.classList.remove("hide");
};

const goResults = () => {
    hideViews();
    generateUserCard();
    resultsDiv.classList.remove("hide");
};

const generateUserCard = () => {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";
    const results = Object.entries(localStorage).sort((a, b) => b[1] - a[1]);
    results.forEach(([key, value]) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "bg-white", "m-2", "p-2", "rounded");
        listItem.innerHTML = `${key}<span class="badge bg-primary rounded-pill">${value}</span>`;
        cardContainer.appendChild(listItem);
    });
};

//==================**====================== BLOQUE POR ORDEN DE EJECUCIÓN ====================**===================//

//---------------------------- REINICIO DEL JUEGO ---------------------------------------//

const restartGameVariables = () => {
    score = 0;
    currentQuestionIndex = 0;
};

const resetGame = () => {
    restartGameVariables();
    updateProgressBar();
    nicknameInput.value = "";
    questionContainerElement.classList.add("hide");
    startButton.classList.remove("hide");
    questionElement.innerText = "";
    message.classList.add("hide");
    resetState();
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    const resultMessage = document.getElementById("result-message");
    if (resultMessage) {
        resultMessage.remove();
    }
    goHome();
};
//---------------------------- BARRA DE PROGRESO ---------------------------------------//

const updateProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / quizz.length) * 100;

    progressBar.style.width = progress + "%";
    progressBar.setAttribute("aria-valuenow", progress);
};
//-------------------------------------------------------------------------------------//

const setStatusClass = () => {
    Array.from(answerButtonsElement.children).forEach((button) => {
        button.classList.add(button.dataset.correct ? "correct" : "wrong", "btn", button.dataset.correct ? "btn-success" : "btn-danger");
    });
};

const showResultMessage = () => {
    const card = document.createElement("div");
    card.classList.add("card", "my-4");
    const resultMessage = document.createElement("p");
    resultMessage.innerText = `¡You got ${score} questions out of ${quizz.length} right!`;
    resultMessage.classList.add("lead");
    const resultButton = document.createElement("button");
    resultButton.innerText = "See Results";
    resultButton.classList.add("btn", "mt-3");
    resultButton.addEventListener("click", goResults);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.appendChild(resultMessage);
    cardBody.appendChild(resultButton);
    card.appendChild(cardBody);
    message.innerHTML = "";
    message.appendChild(card);
    localStorage.setItem(getNickname(nicknameInput.value), score);
};

const selectAnswer = function () {
    score += this.getAttribute("data-correct") === "true" ? 1 : 0;
    if (quizz.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("d-none");
    } else {
        startButton.innerText = "Restart";
        startButton.classList.remove("d-none");
        message.classList.remove("hide");
        showResultMessage();
    }
    setStatusClass();
    updateProgressBar();
    localStorage.setItem(getNickname(nicknameInput.value), score);
};

const showQuestion = (currentQuestion) => {
    questionElement.innerHTML = currentQuestion.question;
    currentQuestion.allAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("btn", "btn-secondary", "mr-2", "mb-2", "px-4", "py-2");
        if (answer === currentQuestion.correctAnswer) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
};

const resetState = () => {
    nextButton.classList.add("d-none");
    answerButtonsElement.innerHTML = "";
};

const setNextQuestion = () => {
    resetState();
    showQuestion(quizz[currentQuestionIndex]);
};

//---------------------------- INICIO DEL JUEGO ---------------------------------------//

const startGame = () => {
    goQuestions();
    startButton.classList.add("d-none");
    nextButton.classList.remove("d-none");
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
};

const initGameRock = (e) => {
    e.preventDefault();
    const user = {
        nickname: nicknameInput.value,
        score: score,
    };
    validationMsg.textContent = user.nickname.length < 1 ? "Write your nickname to start the game" : "";
    if (user.nickname.length >= 1) {
        startGame();
    }
};

//---------------------------- OBTENCIÓN DE PREGUNTAS DE LA API ---------------------------------------//

const getQuestions = async () => {
    try {
        const response = await axios.get("https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple");
        quizz = response.data.results.map((challenge) => ({
            question: decodeHTML(challenge.question),
            correctAnswer: decodeHTML(challenge.correct_answer),
            allAnswers: shuffle([...challenge.incorrect_answers, challenge.correct_answer]).map(decodeHTML),
        }));
    } catch (err) {
        console.error("Error", err);
    }
};

//---------------------------- LISTENERS Y LLAMADAS ---------------------------------------//
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
});

startButton.addEventListener("click", () => {
    resetGame();
});

playAgainBtn.addEventListener("click", () => {
    resetGame();
});

questionsNav.addEventListener("click", goQuestions);
homeNav.addEventListener("click", goHome);
resultsNav.addEventListener("click", goResults);
rockButton.addEventListener("click", initGameRock);

score = parseInt(localStorage.getItem(nicknameInput.value)) || 0;

getQuestions();
