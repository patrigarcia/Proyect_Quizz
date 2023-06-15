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

let currentQuestionIndex;

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

const questions = [
    {
        question: "What is 2 + 2?",
        answers: [
            { text: "4", correct: true },
            { text: "22", correct: false },
        ],
    },
    {
        question: "Is web development fun?",
        answers: [
            { text: "Kinda", correct: false },
            { text: "YES!!!", correct: true },
            { text: "Um no", correct: false },
            { text: "IDK", correct: false },
        ],
    },
    {
        question: "What is 4 * 2?",
        answers: [
            { text: "6", correct: false },
            { text: "8", correct: true },
            { text: "Yes", correct: false },
        ],
    },
];

function resetState() {
    nextButton.classList.add("hide");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function setStatusClass(element) {
    if (element.dataset.correct) {
        element.classList.add("correct");
    } else {
        element.classList.add("wrong");
    }
}

function selectAnswer() {
    Array.from(answerButtonsElement.children).forEach((button) => {
        setStatusClass(button);
    });
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide");
    } else {
        startButton.innerText = "Restart";
        startButton.classList.remove("hide");
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        if (answer.correct) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}
function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}
function startGame() {
    startButton.classList.add("hide");
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
}
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
});

aboutNav.addEventListener("click", goAbout);
homeNav.addEventListener("click", goHome);
contactNav.addEventListener("click", goContact);
