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

let currentQuestionIndex = 0;
let quizz;
let score = 0;

function hideViews() {
    homeDiv.classList.add("hide");
    resultsDiv.classList.add("hide");
    questionsDiv.classList.add("hide");
}

function goQuestions() {
    hideViews();
    questionsDiv.classList.remove("hide");
}

function goHome() {
    hideViews();
    homeDiv.classList.remove("hide");
}

function goResults() {
    hideViews();
    resultsDiv.classList.remove("hide");
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getQuestions() {
    axios
        .get("https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiplehttps://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple")
        .then((response) => {
            quizz = response.data.results;
            console.log("Las preguntas retornadas por la API son:", quizz);
            quizz = quizz.map((challenge) => ({
                question: challenge.question,
                correctAnswer: challenge.correct_answer,
                allAnswers: shuffle([...challenge.incorrect_answers, challenge.correct_answer]),
            }));
            console.log("Las preguntas formateadas son:", quizz);
            startButton.addEventListener("click", () => {
                resetGame();
                startGame(quizz);
            });
        })
        .catch((err) => {
            console.error("Error", err);
        });
}

function resetState() {
    nextButton.classList.add("d-none");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function setStatusClass() {
    Array.from(answerButtonsElement.children).forEach((button) => {
        if (button.dataset.correct) {
            button.classList.add("correct");
        } else {
            button.classList.add("wrong");
        }
    });
}

function selectAnswer(evt) {
    console.log(this);
    console.log(evt);

    if (this.dataset.correct === "true") {
        score++;
    }

    if (quizz.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("d-none");
    } else {
        startButton.innerText = "Restart";
        startButton.classList.remove("d-none"); //Me quede acá!!!
        showResultMessage();
    }
    setStatusClass();
}

function showQuestion(currentQuestion) {
    questionElement.innerHTML = currentQuestion.question;
    currentQuestion.allAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer;
        if (answer === currentQuestion.correctAnswer) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function setNextQuestion(quizz) {
    resetState();
    nextButton.classList.add("d-none");
    showQuestion(quizz);
    console.log("Que es: ", quizz);
}

function startGame() {
    startButton.classList.add("d-none");

    nextButton.classList.add("d-none");
    console.log(nextButton.classList);

    questionContainerElement.classList.remove("hide");
    setNextQuestion(quizz[currentQuestionIndex]);
}

function showResultMessage() {
    const resultMessage = document.createElement("p");
    resultMessage.id = "result-message";
    resultMessage.innerText = `¡Has acertado ${score} preguntas de ${quizz.length}!`;
    questionContainerElement.appendChild(resultMessage);
}

function resetGame() {
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
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion(quizz[currentQuestionIndex]);
});

questionsNav.addEventListener("click", goQuestions);
homeNav.addEventListener("click", goHome);
resultsNav.addEventListener("click", goResults);

getQuestions();
