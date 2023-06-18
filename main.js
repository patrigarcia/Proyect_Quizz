const homeNav = document.getElementById("homeNav");
const aboutNav = document.getElementById("aboutNav");
const homeDiv = document.getElementById("home");
const aboutDiv = document.getElementById("about");
const contactNav = document.getElementById("contactNav");
const contactDiv = document.getElementById("contact");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

let currentQuestionIndex = 0;
let quizz;
let score = 0;
let questions = [];

function hideViews() {
    homeDiv.classList.add("hide");
    contactDiv.classList.add("hide");
    aboutDiv.classList.add("hide");
}

function goAbout() {
    hideViews();
    aboutDiv.classList.remove("hide");
}

function goHome() {
    hideViews();
    homeDiv.classList.remove("hide");
}

function goContact() {
    hideViews();
    contactDiv.classList.remove("hide");
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getQuestions() {
    axios
        .get("https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiple")
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
    nextButton.classList.add("hide");
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
        nextButton.classList.remove("hide");
    } else {
        startButton.innerText = "Restart";
        startButton.classList.remove("hide");
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

function setNextQuestion(question) {
    resetState();
    nextButton.classList.add("hide");
    showQuestion(question);
}

function startGame() {
    startButton.classList.add("hide");
    nextButton.classList.add("hide");
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

aboutNav.addEventListener("click", goAbout);
homeNav.addEventListener("click", goHome);
contactNav.addEventListener("click", goContact);

getQuestions();
