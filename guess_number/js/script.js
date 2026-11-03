//alert("running external JS code!")
//document.querySelector("h1").style.color = "red";

document.querySelector("#resetBtn").addEventListener("click", initializeGame);

//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);

//Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
   randomNumber = Math.floor(Math.random() * 99) + 1;
   console.log("randomNumber: " + randomNumber);
   attempts = 0;
   document.querySelector("#attemptsLeft").textContent = 7 - attempts;

   //hiding the Reset button
   document.querySelector("#resetBtn").style.display = "none";

   //showing the Guess button
   document.querySelector("#guessBtn").style.display = "inline";

   let playerGuess = document.querySelector("#playerGuess");
   playerGuess.focus(); //adding focus to textbox
   playerGuess.value = ""; //clearing the textbox
   
   let feedback = document.querySelector("#feedback");
   feedback.textContent = ""; //clearing the feedback text
   
   //clearing the previous guesses
   document.querySelector("#guesses").textContent = "";
   
   //document.querySelector("#playerGuess").focus();
}

function checkGuess(){
    let feedback = document.querySelector("#feedback");
    feedback.textContent ="";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (isNaN(guess) || guess < 1 || guess > 99) { //checking if the guess is a "number" between 1 and 99
        let feedback = document.querySelector("#feedback");
        feedback.textContent = "Enter a number between 1 and 99.";
        feedback.style.color = "red";
        return;
    }
    attempts++;
    console.log("Attempts: " + attempts);
    document.querySelector("#attemptsLeft").textContent = 7 - attempts;
    feedback.style.color = "orange";
    if (guess == randomNumber) {
        feedback.textContent = "You guesseed it!. You Won!";
        feedback.style.color = "green";
        wins++;
        document.querySelector("#wins").textContent = wins;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == 7) {
            feedback.textContent = "Sorry you lost!";
            feedback.style.color = "red";
            losses++;
            document.querySelector("#losses").textContent = losses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }    
    }
}

function gameOver(){
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none"; //hides guess button
    resetBtn.style.display = "inline"; //displays reset button
}