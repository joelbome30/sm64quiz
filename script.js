const questions = [
  {
    question: "¿Cuál es el nombre del último nivel de Bowser en Super Mario 64?",
    answers: [
      "Bowser in the Sky",
      "Bowser in the Dark World",
      "Bowser in the Fire Sea"
    ],
    correct: 0,
    explanation: "Bowser in the Sky es el tercer y último nivel de Bowser."
  },
  {
    question: "¿Cuáles son los dos niveles en los que aparece Koopa the Quick?",
    answers: [
      "Bob-omb Battlefield y Whomp's Fortress",
      "Bob-omb Battlefield y Tiny-Huge Island",
      "Cool, Cool Mountain y Wet-Dry World"
    ],
    correct: 1,
    explanation: "Koopa the Quick reta a Mario en Bob-omb Battlefield y Tiny-Huge Island."
  },
  {
    question: "¿Qué nivel es este?",
    image: "images.jpeg",
    imageAlt: "Escenario de lava de Super Mario 64 con plataformas y un enemigo Bully",
    answers: [
      "Hazy Maze Cave",
      "Rainbow Ride",
      "Lethal Lava Land"
    ],
    correct: 2,
    explanation: "Es Lethal Lava Land, el nivel de lava ubicado en el sótano del castillo."
  },
  {
    question: "¿Cuántas estrellas de poder hay en total en Super Mario 64?",
    answers: [
      "100 estrellas",
      "120 estrellas",
      "150 estrellas"
    ],
    correct: 1,
    explanation: "El juego contiene un total de 120 estrellas de poder."
  },
  {
    question: "¿Qué gorra permite que Mario atraviese rejas y paredes especiales?",
    answers: [
      "La gorra metálica",
      "La gorra alada",
      "La gorra invisible"
    ],
    correct: 2,
    explanation: "La gorra invisible vuelve a Mario translúcido y le permite atravesar ciertas barreras."
  },
  {
    question: "¿Cuántas estrellas se necesitan para abrir la puerta que lleva al último Bowser sin usar glitches?",
    answers: [
      "50 estrellas",
      "70 estrellas",
      "80 estrellas"
    ],
    correct: 1,
    explanation: "La puerta de las escaleras infinitas requiere 70 estrellas para permitir el acceso final."
  },
  {
    question: "¿Qué determina el nivel inicial del agua al entrar a Wet-Dry World?",
    answers: [
      "La cantidad de estrellas obtenidas",
      "La altura a la que Mario entra en el cuadro",
      "El tiempo que se tarda en saltar al cuadro"
    ],
    correct: 1,
    explanation: "Cuanto más alto entra Mario en el cuadro, más alto comienza el nivel del agua."
  },
  {
    question: "¿Con cuántas estrellas aparece MIPS por primera vez en el sótano?",
    answers: [
      "15 estrellas",
      "20 estrellas",
      "30 estrellas"
    ],
    correct: 0,
    explanation: "MIPS aparece por primera vez al conseguir 15 estrellas y vuelve a aparecer con 50."
  },
  {
    question: "¿Qué ocurre con los mecanismos de Tick Tock Clock si entras cuando la manecilla marca las 12?",
    answers: [
      "Se mueven muy rápido",
      "Cambian de dirección",
      "Se quedan detenidos"
    ],
    correct: 2,
    explanation: "Al entrar exactamente a las 12, las plataformas y mecanismos del reloj se detienen."
  },
  {
    question: "¿Qué debes hacer para que el cuadro de Dire, Dire Docks se aleje y deje libre el pasillo?",
    answers: [
      "Conseguir la primera estrella de Dire, Dire Docks",
      "Derrotar a Bowser in the Fire Sea",
      "Encontrar las ocho monedas rojas del sótano"
    ],
    correct: 0,
    explanation: "Al conseguir la primera estrella de Dire, Dire Docks, el cuadro retrocede y deja libre la entrada a Bowser in the Fire Sea."
  }
];

const marioHand = document.querySelector("#mario-hand");
const openHandPath = "mario-hand.png";
const closedHandPath = "mario-hand-closed.png";

const questionCounter = document.querySelector("#question-counter");
const scoreCounter = document.querySelector("#score-counter");
const progressBar = document.querySelector("#progress-bar");
const questionTitle = document.querySelector("#question-title");
const imageContainer = document.querySelector("#question-image-container");
const questionImage = document.querySelector("#question-image");
const answersContainer = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const checkButton = document.querySelector("#check-button");
const nextButton = document.querySelector("#next-button");
const quizContent = document.querySelector("#quiz-content");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultScore = document.querySelector("#result-score");
const resultMessage = document.querySelector("#result-message");
const resultIcon = document.querySelector("#result-icon");
const restartButton = document.querySelector("#restart-button");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answerChecked = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  selectedAnswer = null;
  answerChecked = false;

  questionCounter.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
  scoreCounter.textContent = `Puntaje: ${score}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionTitle.textContent = item.question;
  feedback.textContent = "";
  feedback.className = "feedback";
  checkButton.disabled = true;
  checkButton.hidden = false;
  nextButton.hidden = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? "Ver resultado <span aria-hidden=\"true\">★</span>"
    : "Siguiente pregunta <span aria-hidden=\"true\">→</span>";

  if (item.image) {
    questionImage.src = item.image;
    questionImage.alt = item.imageAlt;
    imageContainer.hidden = false;
  } else {
    questionImage.removeAttribute("src");
    questionImage.alt = "";
    imageContainer.hidden = true;
  }

  answersContainer.innerHTML = "";
  item.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    label.className = "answer";
    label.innerHTML = `
      <input type="radio" name="answer" value="${index}">
      <span class="answer__letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
      <span class="answer__text">${answer}</span>
    `;

    const input = label.querySelector("input");
    input.addEventListener("change", () => selectAnswer(index, label));
    answersContainer.appendChild(label);
  });
}

function selectAnswer(index, selectedLabel) {
  if (answerChecked) return;

  selectedAnswer = index;
  answersContainer.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.remove("selected");
  });
  selectedLabel.classList.add("selected");
  checkButton.disabled = false;
}

function checkAnswer() {
  if (selectedAnswer === null || answerChecked) return;

  answerChecked = true;
  const item = questions[currentQuestion];
  const answerElements = answersContainer.querySelectorAll(".answer");

  answerElements.forEach((answer, index) => {
    answer.classList.add("locked");
    answer.querySelector("input").disabled = true;
    if (index === item.correct) answer.classList.add("correct");
  });

  if (selectedAnswer === item.correct) {
    score += 1;
    feedback.textContent = `¡Correcto! ${item.explanation}`;
    feedback.classList.add("feedback--correct");
  } else {
    answerElements[selectedAnswer].classList.add("incorrect");
    feedback.textContent = `Respuesta incorrecta. ${item.explanation}`;
    feedback.classList.add("feedback--incorrect");
  }

  scoreCounter.textContent = `Puntaje: ${score}`;
  checkButton.hidden = true;
  nextButton.hidden = false;
  nextButton.focus();
}

function showNextQuestion() {
  currentQuestion += 1;
  if (currentQuestion < questions.length) {
    renderQuestion();
    questionTitle.focus({ preventScroll: true });
  } else {
    showResult();
  }
}

function showResult() {
  quizContent.hidden = true;
  result.hidden = false;
  questionCounter.textContent = "Quiz completado";
  scoreCounter.textContent = `Puntaje: ${score}`;
  progressBar.style.width = "100%";
  resultScore.textContent = `${score} / ${questions.length}`;

  if (score === 10) {
    resultTitle.textContent = "10/10";
    resultMessage.textContent = "Sal a tocar pasto.";
    resultIcon.textContent = "★";
  } else if (score >= 8) {
    resultTitle.textContent = `${score}/10`;
    resultMessage.textContent = "Sí le sabes.";
    resultIcon.textContent = "★";
  } else if (score >= 5) {
    resultTitle.textContent = `${score}/10`;
    resultMessage.textContent = "Tienes idea.";
    resultIcon.textContent = "★";
  } else if (score === 4) {
    resultTitle.textContent = "4/10";
    resultMessage.textContent = "Te faltó una estrella para tener idea.";
    resultIcon.textContent = "?";
  } else {
    resultTitle.textContent = `${score}/10`;
    resultMessage.textContent = "Mejor ves a jugar Furry Love.";
    resultIcon.textContent = "?";
  }

  restartButton.focus();
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  result.hidden = true;
  quizContent.hidden = false;
  renderQuestion();
}

document.addEventListener("pointermove", (event) => {
  marioHand.style.transform = `translate3d(${event.clientX - 33}px, ${event.clientY}px, 0)`;
  marioHand.classList.add("visible");
});

document.addEventListener("pointerdown", () => {
  if (window.matchMedia("(pointer: fine)").matches) marioHand.src = closedHandPath;
});

document.addEventListener("pointerup", () => {
  marioHand.src = openHandPath;
});

document.addEventListener("pointerleave", () => {
  marioHand.src = openHandPath;
  marioHand.classList.remove("visible");
});

checkButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", showNextQuestion);
restartButton.addEventListener("click", restartQuiz);

renderQuestion();
