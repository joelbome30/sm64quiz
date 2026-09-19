const $ = (selector) => document.querySelector(selector);

const ui = {
  hand: $("#mario-hand"),
  counter: $("#question-counter"),
  score: $("#score-counter"),
  progress: $("#progress-bar"),
  title: $("#question-title"),
  imageBox: $("#question-image-container"),
  image: $("#question-image"),
  answers: $("#answers"),
  feedback: $("#feedback"),
  check: $("#check-button"),
  next: $("#next-button"),
  nextLabel: $("#next-label"),
  quiz: $("#quiz-content"),
  result: $("#result"),
  resultTitle: $("#result-title"),
  resultScore: $("#result-score"),
  resultMessage: $("#result-message"),
  resultIcon: $("#result-icon"),
  restart: $("#restart-button")
};

let questions = [];
let questionNumber = 0;
let score = 0;
let selectedAnswer = null;
let answerChecked = false;

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("No se pudo leer questions.json");
    questions = await response.json();
    renderQuestion();
  } catch (error) {
    ui.title.textContent = "No se pudieron cargar las preguntas";
    console.error(error);
  }
}

function renderQuestion() {
  const question = questions[questionNumber];
  selectedAnswer = null;
  answerChecked = false;

  ui.counter.textContent = `Pregunta ${questionNumber + 1} de ${questions.length}`;
  ui.score.textContent = `Puntaje: ${score}`;
  ui.progress.style.width = `${((questionNumber + 1) / questions.length) * 100}%`;
  ui.title.textContent = question.question;
  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  ui.check.disabled = true;
  ui.check.hidden = false;
  ui.next.hidden = true;
  ui.nextLabel.textContent = questionNumber === questions.length - 1 ? "RESULT" : "NEXT";

  ui.imageBox.hidden = !question.image;
  if (question.image) {
    ui.image.src = question.image;
    ui.image.alt = question.imageAlt || "Imagen de la pregunta";
  }

  ui.answers.innerHTML = "";
  question.answers.forEach((answer, index) => addAnswer(answer, index));
}

function addAnswer(text, index) {
  const label = document.createElement("label");
  label.className = "answer";
  label.innerHTML = `
    <input type="radio" name="answer" value="${index}">
    <span class="file-pic" aria-hidden="true"></span>
    <span class="file-copy">
      <small class="slot">ANSWER ${String.fromCharCode(65 + index)}</small>
      <strong class="choice">${text}</strong>
    </span>`;

  label.querySelector("input").addEventListener("change", () => selectAnswer(index, label));
  ui.answers.append(label);
}

function selectAnswer(index, label) {
  if (answerChecked) return;
  selectedAnswer = index;
  document.querySelectorAll(".answer").forEach((answer) => answer.classList.remove("selected"));
  label.classList.add("selected");
  ui.check.disabled = false;
}

function checkAnswer() {
  if (selectedAnswer === null || answerChecked) return;
  answerChecked = true;

  const question = questions[questionNumber];
  const answers = document.querySelectorAll(".answer");
  answers.forEach((answer, index) => {
    answer.classList.add("locked");
    answer.querySelector("input").disabled = true;
    if (index === question.correct) answer.classList.add("correct");
  });

  const correct = selectedAnswer === question.correct;
  if (correct) score++;
  if (!correct) answers[selectedAnswer].classList.add("incorrect");

  ui.feedback.textContent = `${correct ? "¡Correcto!" : "Respuesta incorrecta."} ${question.explanation}`;
  ui.feedback.classList.add(correct ? "feedback--correct" : "feedback--incorrect");
  ui.score.textContent = `Puntaje: ${score}`;
  ui.check.hidden = true;
  ui.next.hidden = false;
}

function nextQuestion() {
  questionNumber++;
  if (questionNumber < questions.length) renderQuestion();
  else showResult();
}

function showResult() {
  const rating = Math.round((score / questions.length) * 10);
  ui.quiz.hidden = true;
  ui.result.hidden = false;
  ui.counter.textContent = "Quiz completado";
  ui.score.textContent = `Puntaje: ${score}`;
  ui.progress.style.width = "100%";
  ui.resultScore.textContent = `${score}/${questions.length} (${rating}/10)`;

  if (score === questions.length) {
    ui.resultTitle.textContent = "10/10";
    ui.resultMessage.textContent = "Sal a tocar pasto.";
    ui.resultIcon.textContent = "★";
  } else if (rating >= 8) {
    ui.resultTitle.textContent = `${rating}/10`;
    ui.resultMessage.textContent = "Sí le sabes.";
    ui.resultIcon.textContent = "★";
  } else if (rating >= 5) {
    ui.resultTitle.textContent = `${rating}/10`;
    ui.resultMessage.textContent = "Tienes idea.";
    ui.resultIcon.textContent = "★";
  } else {
    ui.resultTitle.textContent = `${rating}/10`;
    ui.resultMessage.textContent = "Mejor ves a jugar Furry Love.";
    ui.resultIcon.textContent = "?";
  }
}

function restart() {
  questionNumber = 0;
  score = 0;
  ui.result.hidden = true;
  ui.quiz.hidden = false;
  renderQuestion();
}

ui.check.addEventListener("click", checkAnswer);
ui.next.addEventListener("click", nextQuestion);
ui.restart.addEventListener("click", restart);

document.addEventListener("pointermove", (event) => {
  ui.hand.style.transform = `translate3d(${event.clientX - 33}px, ${event.clientY}px, 0)`;
  ui.hand.classList.add("visible");
});
document.addEventListener("pointerdown", () => {
  if (matchMedia("(pointer:fine)").matches) ui.hand.src = "mario-hand-closed.png";
});
document.addEventListener("pointerup", () => ui.hand.src = "mario-hand.png");

loadQuestions();
