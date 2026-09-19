const list = document.querySelector("#question-list");
const message = document.querySelector("#message");
const count = document.querySelector("#question-count");
let questions = [];

function emptyQuestion() {
  return { question: "", answers: ["", "", ""], correct: 0, explanation: "" };
}

function showMessage(text, error = false) {
  message.textContent = text;
  message.className = error ? "message error" : "message";
}

function render() {
  list.innerHTML = "";
  questions.forEach((question, index) => list.append(createCard(question, index)));
  count.textContent = `${questions.length} pregunta${questions.length === 1 ? "" : "s"}`;
}

function createCard(question, index) {
  const card = document.createElement("article");
  card.className = "question-card";
  card.innerHTML = `
    <div class="card-top">
      <span class="card-number">Pregunta ${index + 1}</span>
      <button class="delete-button" type="button">Eliminar</button>
    </div>
    <div class="field">
      <label>Pregunta</label>
      <textarea class="question-text" placeholder="Escribe la pregunta..."></textarea>
    </div>
    <div class="answers"></div>
    <div class="field">
      <label>Explicación después de responder (opcional)</label>
      <input class="explanation" type="text" placeholder="Ejemplo: La respuesta correcta es...">
    </div>
    <div class="image-row">
      <div class="field">
        <label>Imagen (opcional)</label>
        <input class="image-file" type="file" accept="image/*">
      </div>
      <img class="preview" alt="Vista previa" hidden>
    </div>`;

  card.querySelector(".question-text").value = question.question || "";
  card.querySelector(".explanation").value = question.explanation || "";
  const answers = card.querySelector(".answers");

  question.answers.forEach((answer, answerIndex) => {
    const row = document.createElement("label");
    row.className = "answer-row";
    row.innerHTML = `<input type="radio" name="correct-${index}" ${answerIndex === question.correct ? "checked" : ""}><input type="text" placeholder="Respuesta ${String.fromCharCode(65 + answerIndex)}">`;
    row.querySelector("input[type=text]").value = answer;
    answers.append(row);
  });

  if (question.image) {
    const preview = card.querySelector(".preview");
    preview.src = question.image;
    preview.hidden = false;
  }

  card.querySelector(".delete-button").addEventListener("click", () => {
    questions.splice(index, 1);
    render();
  });
  card.querySelector(".image-file").addEventListener("change", (event) => readImage(event, index, card));
  card.querySelectorAll("textarea,input[type=text],input[type=radio]").forEach((input) => {
    input.addEventListener("change", () => saveCard(card, index));
  });
  return card;
}

function saveCard(card, index) {
  const answerInputs = [...card.querySelectorAll(".answer-row input[type=text]")];
  const correctInput = card.querySelector(".answer-row input[type=radio]:checked");
  questions[index].question = card.querySelector(".question-text").value;
  questions[index].answers = answerInputs.map((input) => input.value);
  questions[index].correct = correctInput ? [...card.querySelectorAll(".answer-row input[type=radio]")].indexOf(correctInput) : 0;
  questions[index].explanation = card.querySelector(".explanation").value;
}

function readImage(event, index, card) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    questions[index].image = reader.result;
    questions[index].imageAlt = file.name;
    const preview = card.querySelector(".preview");
    preview.src = reader.result;
    preview.hidden = false;
    showMessage("Imagen incluida dentro del JSON.");
  };
  reader.readAsDataURL(file);
}

function download() {
  document.querySelectorAll(".question-card").forEach((card, index) => saveCard(card, index));
  const json = JSON.stringify(questions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "questions.json";
  link.click();
  URL.revokeObjectURL(url);
  showMessage("JSON descargado con sus imágenes incluidas.");
}

document.querySelector("#add-button").addEventListener("click", () => {
  questions.push(emptyQuestion());
  render();
  list.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelector("#download-button").addEventListener("click", download);
document.querySelector("#import-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("El JSON debe contener una lista de preguntas.");
      questions = imported;
      render();
      showMessage("Preguntas importadas correctamente.");
    } catch (error) {
      showMessage(error.message, true);
    }
  };
  reader.readAsText(file);
});

fetch("questions.json")
  .then((response) => response.json())
  .then((data) => { questions = data; render(); })
  .catch(() => { questions = [emptyQuestion()]; render(); });
