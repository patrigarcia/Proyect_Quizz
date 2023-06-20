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
    const nickname = localStorage.getItem("nickname");
    const playerScore = localStorage.getItem(nickname);
    const cardContent = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">General score by players</h5>
          <div class="table-responsive">
            <table class="table">
              <tbody>
                <tr>
                  <th>Nickname:</th>
                  <td>${nickname}</td>
                </tr>
                <tr>
                  <th>Score:</th>
                  <td>${playerScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    cardContainer.innerHTML = cardContent;
};

const initGameRock = (e) => {
    e.preventDefault();
    const user = {
        nickname: nicknameInput.value,
        score: score,
    };
    goQuestions();
};

const goResults = () => {
    hideViews();
    generateUserCard();
    resultsDiv.classList.remove("hide");
};

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const getQuestions = () => {
    axios
        .get("https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiplehttps://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple")
        .then((response) => {
            quizz = response.data.results;
            quizz = quizz.map((challenge) => ({
                question: challenge.question,
                correctAnswer: challenge.correct_answer,
                allAnswers: shuffle([...challenge.incorrect_answers, challenge.correct_answer]),
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

const setNextQuestion = () => {
    resetState();
    nextButton.classList.add("d-none");
    showQuestion(quizz[currentQuestionIndex]);
};

const startGame = () => {
    startButton.classList.add("d-none");

    nextButton.classList.add("d-none");

    questionContainerElement.classList.remove("hide");
    setNextQuestion();
};

const showResultMessage = () => {
    const card = document.createElement("div");
    card.classList.add("card", "my-4");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const resultMessage = document.createElement("p");
    resultMessage.innerText = `¡Has acertado ${score} preguntas de ${quizz.length}!`;
    resultMessage.classList.add("lead");

    cardBody.appendChild(resultMessage);
    card.appendChild(cardBody);

    message.innerHTML = "";
    message.appendChild(card);

    localStorage.setItem(nicknameInput.value, score);
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
