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

let currentQuestionIndex = 0;
let quizz;
let score = 0;

const hideViews = () => {
    homeDiv.classList.add("hide");
    resultsDiv.classList.add("hide");
    questionsDiv.classList.add("hide");
};

const goQuestions = () => {
    hideViews();
    questionsDiv.classList.remove("hide");
};

const goHome = () => {
    hideViews();
    homeDiv.classList.remove("hide");
};

const generateUserCard = () => {
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";

    Object.entries(localStorage).forEach(([key, value]) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "bg-white", "m-2", "p-2", "rounded");
        listItem.innerHTML = `${key}<span class="badge bg-primary rounded-pill">${value}</span>`;
        cardContainer.appendChild(listItem);
    });
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

const goResults = () => {
    hideViews();
    generateUserCard();
    resultsDiv.classList.remove("hide");
};

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const getQuestions = async () => {
    try {
        const response = await axios.get("https://opentdb.com/api.php?amount=3&category=12&difficulty=easy&type=multiple");
        quizz = response.data.results.map((challenge) => ({
            question: decodeHTML(challenge.question),
            correctAnswer: decodeHTML(challenge.correct_answer),
            allAnswers: shuffle([...challenge.incorrect_answers, challenge.correct_answer]).map(decodeHTML),
        }));
        startButton.addEventListener("click", () => {
            resetGame();
            startGame();
        });
    } catch (err) {
        console.error("Error", err);
    }
};

const resetState = () => {
    nextButton.classList.add("d-none");
    answerButtonsElement.innerHTML = "";
};

const setStatusClass = () => {
    Array.from(answerButtonsElement.children).forEach((button) => {
        button.classList.add(button.dataset.correct ? "correct" : "wrong", "btn", button.dataset.correct ? "btn-success" : "btn-danger");
    });
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

const updateProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / quizz.length) * 100;

    progressBar.style.width = progress + "%";
    progressBar.setAttribute("aria-valuenow", progress);
};

const setNextQuestion = () => {
    resetState();
    showQuestion(quizz[currentQuestionIndex]);
};

const startGame = () => {
    goQuestions();
    startButton.classList.add("d-none");
    nextButton.classList.remove("d-none");
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
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

const goBackHome = () => {
    resultsDiv.classList.add("hide");
    questionsDiv.classList.add("hide");
    homeDiv.classList.remove("hide");
    nicknameInput = "";
};

const restartGameVariables = () => {
    score = 0;
    currentQuestionIndex = 0;
};

const resetGame = () => {
    restartGameVariables();
    updateProgressBar();
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
};

const getNickname = (nickname) => {
    return nickname === "" ? "Anonymous" : nickname;
};

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
});

questionsNav.addEventListener("click", goQuestions);
homeNav.addEventListener("click", goHome);
resultsNav.addEventListener("click", goResults);
rockButton.addEventListener("click", initGameRock);

score = parseInt(localStorage.getItem(nicknameInput.value)) || 0;

getQuestions();
