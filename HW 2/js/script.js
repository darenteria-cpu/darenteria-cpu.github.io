// Event listeners
document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);
document.querySelector("#retakeBtn").addEventListener("click", retakeQuiz);
document.querySelector("#q9").addEventListener("input", function () {
  document.querySelector("#q9Value").textContent = this.value;
});

// Global variables
const POINTS_PER_QUESTION = 10; // 10 questions x 10 points = 100
let score = 0;

let attempts = localStorage.getItem("total_attempts");
if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}
showAttempts();

displayRadioChoices("q4", ["Maine", "Rhode Island", "Maryland", "Delaware"]);
displayRadioChoices("q7", ["Texas", "California", "Alaska", "Montana"]);

// Functions
function showAttempts() {
  document.querySelector("#totalAttempts").textContent =
    `Total times quiz taken: ${attempts}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Builds radio buttons (each with a <label>) in random order
function displayRadioChoices(name, choices) {
  shuffleArray(choices);
  let container = document.querySelector(`#${name}Choices`);
  container.textContent = "";

  for (let choice of choices) {
    let id = name + choice.replace(/\s+/g, "");

    let wrapper = document.createElement("div");
    wrapper.className = "form-check form-check-inline";

    let input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.id = id;
    input.value = choice;
    input.className = "form-check-input";

    let label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = choice;
    label.className = "form-check-label";

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  }
}

function isFormValid() {
  let missing = [];

  if (document.querySelector("#q1").value.trim() === "") missing.push(1);
  if (document.querySelector("#q2").value === "") missing.push(2);
  if (document.querySelector("input[name=q4]:checked") === null) missing.push(4);
  if (document.querySelector("#q5").value.trim() === "") missing.push(5);
  if (document.querySelector("#q6").value === "") missing.push(6);
  if (document.querySelector("input[name=q7]:checked") === null) missing.push(7);
  if (document.querySelector("#q10").value === "") missing.push(10);

  let validationFdbk = document.querySelector("#validationFdbk");
  if (missing.length > 0) {
    validationFdbk.textContent =
      `Please answer question${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`;
    validationFdbk.classList.remove("d-none");
    return false;
  }

  validationFdbk.classList.add("d-none");
  return true;
}

function setMarkImage(index, imageName, altText) {
  let markContainer = document.querySelector(`#markImg${index}`);
  markContainer.textContent = "";
  let img = document.createElement("img");
  img.src = `img/${imageName}`;
  img.alt = altText;
  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Correct!";
  feedback.className = "feedback bg-success text-white";
  setMarkImage(index, "checkmark.png", "Correct");
  score += POINTS_PER_QUESTION;
}

function wrongAnswer(index, correctText) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = `Incorrect! The correct answer is ${correctText}.`;
  feedback.className = "feedback bg-danger text-white";
  setMarkImage(index, "xmark.png", "Incorrect");
}

function grade(index, isCorrect, correctText) {
  if (isCorrect) {
    rightAnswer(index);
  } else {
    wrongAnswer(index, correctText);
  }
}

function isChecked(id) {
  return document.querySelector(`#${id}`).checked;
}

function gradeQuiz() {
  if (!isFormValid()) {
    return;
  }

  score = 0;

  // Q1 - text
  let q1 = document.querySelector("#q1").value.trim().toLowerCase();
  grade(1, q1 === "sacramento", "Sacramento");

  // Q2 - select
  grade(2, document.querySelector("#q2").value === "mo", "the Missouri River");

  // Q3 - checkboxes
  grade(3,
    isChecked("Jefferson") && isChecked("Roosevelt") &&
    !isChecked("Jackson") && !isChecked("Franklin"),
    "T. Jefferson and T. Roosevelt");

  // Q4 - radio (random order)
  let q4 = document.querySelector("input[name=q4]:checked").value;
  grade(4, q4 === "Rhode Island", "Rhode Island");

  // Q5 - text
  let q5 = document.querySelector("#q5").value.trim().toLowerCase();
  grade(5, q5 === "pacific" || q5 === "pacific ocean", "the Pacific Ocean");

  // Q6 - number
  grade(6, Number(document.querySelector("#q6").value) === 50, "50");

  // Q7 - radio (random order)
  let q7 = document.querySelector("input[name=q7]:checked").value;
  grade(7, q7 === "Alaska", "Alaska");

  // Q8 - checkboxes
  grade(8,
    isChecked("q8CA") && isChecked("q8AZ") && isChecked("q8NM") && isChecked("q8TX") &&
    !isChecked("q8NV") && !isChecked("q8OK"),
    "California, Arizona, New Mexico and Texas");

  // Q9 - range
  grade(9, Number(document.querySelector("#q9").value) === 5, "5");

  // Q10 - date
  grade(10, document.querySelector("#q10").value === "1776-07-04", "July 4, 1776");

  // Total score
  let totalScoreEl = document.querySelector("#totalScore");
  totalScoreEl.textContent = `Total Score: ${score} / 100`;
  totalScoreEl.className = score >= 80 ? "text-success" : "text-danger";

  // Congratulatory message (above 80)
  let congrats = document.querySelector("#congrats");
  if (score > 80) {
    congrats.textContent = `Congratulations! You scored ${score} points. Great job!`;
    congrats.classList.remove("d-none");
  } else {
    congrats.classList.add("d-none");
  }

  // Web Storage - total times quiz taken
  attempts++;
  localStorage.setItem("total_attempts", attempts);
  showAttempts();

  document.querySelector("#retakeBtn").classList.remove("d-none");
  document.querySelector("#results").scrollIntoView({ behavior: "smooth" });
}

// Clears all answers, feedback and images so the quiz can be taken again
function retakeQuiz() {
  // Text, number and date inputs
  for (let id of ["q1", "q5", "q6", "q10"]) {
    document.querySelector(`#${id}`).value = "";
  }

  // Dropdown and slider
  document.querySelector("#q2").value = "";
  document.querySelector("#q9").value = 1;
  document.querySelector("#q9Value").textContent = "1";

  // Checkboxes
  for (let box of document.querySelectorAll("input[type=checkbox]")) {
    box.checked = false;
  }

  // Rebuild radio buttons in a new random order
  displayRadioChoices("q4", ["Maine", "Rhode Island", "Maryland", "Delaware"]);
  displayRadioChoices("q7", ["Texas", "California", "Alaska", "Montana"]);

  // Feedback and right/wrong images
  for (let i = 1; i <= 10; i++) {
    let feedback = document.querySelector(`#q${i}Feedback`);
    feedback.textContent = "";
    feedback.className = "feedback";
    document.querySelector(`#markImg${i}`).textContent = "";
  }

  // Results (attempt count is kept in Web Storage)
  score = 0;
  document.querySelector("#totalScore").textContent = "";
  document.querySelector("#congrats").classList.add("d-none");
  document.querySelector("#validationFdbk").classList.add("d-none");
  document.querySelector("#retakeBtn").classList.add("d-none");

  window.scrollTo({ top: 0, behavior: "smooth" });
}
