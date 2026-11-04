function isFormValid() {
  let isValid = true;
  let q1Response = document.querySelector("#q1").value;
  let validationFdbk = document.querySelector("#validationFdbk");

  if (q1Response === "") {
    isValid = false;
    validationFdbk.textContent = "Question 1 was not answered";
  }

  return isValid;
}

function gradeQuiz() {
  document.querySelector("#validationFdbk").textContent = "";

  if (!isFormValid()) {
    return;
  }

score = 0;
let q1Response = document.querySelector("#q1").value.toLowerCase();
let q2Response = document.querySelector("#q2").value;

if (q1Response === "sacramento") {
  rightAnswer(1);
} else {
  wrongAnswer(1);
}

if (q2Response === "mo") {
  rightAnswer(2);
} else {
  wrongAnswer(2);
}

if (document.querySelector("#Jefferson").checked &&
    document.querySelector("#Roosevelt").checked &&
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked) {
  rightAnswer(3);
} else {
  wrongAnswer(3);
}

let selectedQ4 = document.querySelector("input[name=q4]:checked");

if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
  rightAnswer(4);
} else {
  wrongAnswer(4);
}

let totalScoreEl = document.querySelector("#totalScore");
totalScoreEl.textContent = `Total Score: ${score}`;

if (score < 80) {
  totalScoreEl.style.color = "red";
} else {
  totalScoreEl.style.color = "green";
}

if (score > 80) {
  totalScoreEl.textContent += " - Congratulations!";
}


attempts++;
document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
localStorage.setItem("total_attempts", attempts);
}

let score = 0;



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
  feedback.className = "bg-success text-white";
  setMarkImage(index, "checkmark.png", "Checkmark");
  score += 20;
}

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Incorrect!";
  feedback.className = "bg-warning text-white";
  setMarkImage(index, "xmark.png", "X mark");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  shuffleArray(q4ChoicesArray);

  let choicesContainer = document.querySelector("#q4Choices");
  choicesContainer.textContent = "";

  for (let choice of q4ChoicesArray) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "q4";
    input.id = choice;
    input.value = choice;

    let label = document.createElement("label");
    label.htmlFor = choice;
    label.textContent = choice;

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(document.createTextNode(" "));
  }
}
 
let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

displayQ4Choices();