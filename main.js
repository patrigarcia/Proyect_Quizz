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

//------------------------------------------------//

//------------------------------------------------//

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
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        const listGroup = document.createElement("ul");
        listGroup.classList.add("list-group");
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "m-2");
        const playerText = document.createTextNode(`${key}`);
        const scoreText = document.createTextNode(`${localStorage.getItem(key)}`);
        const span = document.createElement("span");
        span.classList.add("badge", "bg-primary", "rounded-pill");
        span.appendChild(scoreText);
        listItem.appendChild(playerText);
        listItem.appendChild(span);
        listGroup.appendChild(listItem);

        document.getElementById("cardContainer").appendChild(listGroup);
    }
};

const initGameRock = (e) => {
    e.preventDefault();
    const user = {
        nickname: nicknameInput.value,
        score: score,
    };
    if (user.nickname.length < 1) {
        validationMsg.textContent = "Write your nickname to start the game";
    } else {
        validationMsg.textContent = "";
        goQuestions();
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

const getQuestions = () => {
    axios
        .get("https://opentdb.com/api.php?amount=4&category=12&difficulty=easy&type=multiple")
        .then((response) => {
            quizz = response.data.results;
            quizz = quizz.map((challenge) => ({
                question: decodeHTML(challenge.question),
                correctAnswer: decodeHTML(challenge.correct_answer),
                allAnswers: shuffle([...challenge.incorrect_answers, challenge.correct_answer]).map(decodeHTML),
            }));
            startButton.addEventListener("click", () => {
                resetGame();
                startGame();
            });
        })
        .catch((err) => {
            console.error("Error", err);
        });
};

const resetState = () => {
    nextButton.classList.add("d-none");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
};

const setStatusClass = () => {
    Array.from(answerButtonsElement.children).forEach((button) => {
        if (button.dataset.correct) {
            button.classList.add("correct");
            button.classList.add("btn", "btn-success");
        } else {
            button.classList.add("wrong");
            button.classList.add("btn", "btn-danger");
        }
    });
};

const selectAnswer = function (evt) {
    if (this.getAttribute("data-correct") === "true") {
        score++;
    }
    if (quizz.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("d-none");
    } else {
        startButton.innerText = "Restart";
        startButton.classList.remove("d-none");
        showResultMessage();
    }
    setStatusClass();
    localStorage.setItem(nicknameInput.value, score);
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
    updateProgressBar();
};

const startGame = () => {
    startButton.classList.add("d-none");
    nextButton.classList.remove("d-none");
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
    updateProgressBar();
};

const showResultMessage = () => {
    const card = document.createElement("div");
    card.classList.add("card", "my-4");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const resultMessage = document.createElement("p");
    resultMessage.innerText = `¡You got ${score} questions out of ${quizz.length} right!`;
    resultMessage.classList.add("lead");
    cardBody.appendChild(resultMessage);
    card.appendChild(cardBody);
    message.innerHTML = "";
    message.appendChild(card);
    localStorage.setItem(nicknameInput.value, score);
    const resultButton = document.createElement("button");
    resultButton.innerText = "See Results";
    resultButton.classList.add("btn", "mt-3");
    resultButton.addEventListener("click", goResults);

    cardBody.appendChild(resultButton);
    card.appendChild(cardBody);
    message.innerHTML = "";
    message.appendChild(card);
};

const resetGame = () => {
    score = 0;
    currentQuestionIndex = 0;
    questionContainerElement.classList.add("hide");
    startButton.classList.remove("hide");
    questionElement.innerText = "";
    resetState();
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    const resultMessage = document.getElementById("result-message");
    if (resultMessage) {
        resultMessage.remove();
    }
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
