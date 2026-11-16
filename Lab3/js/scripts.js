// Event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#password").addEventListener("click", displaySuggestedPassword);
document.querySelector("#signupForm").addEventListener("submit", validateForm);

loadStates();

async function displayCity() { // async allows us to use await inside the function
  let zipCode = document.querySelector("#zip").value;
  let zipError = document.querySelector("#zipError");
  zipError.textContent = "";

  try {
    let url = `https://csumb.space/api/geo/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url); // await pauses the function until the fetch is complete
    let data = await response.json();

    // the API returns false when the zip code is not found
    if (data === false) {
      zipError.textContent = "Zip code not found";
      document.querySelector("#city").textContent = "";
      document.querySelector("#latitude").textContent = "";
      document.querySelector("#longitude").textContent = "";
      return;
    }

    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;
  } catch (error) {
    zipError.textContent = "Unable to retrieve city";
    console.error(error);
  }
}

async function loadStates() {
  let stateMenu = document.querySelector("#state");
  stateMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  stateMenu.appendChild(defaultOption);

  try {
    let url = "https://csumb.space/api/geo/statesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.usps;
      option.textContent = item.state;
      stateMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);
    defaultOption.textContent = "Unable to load states";
  }
}

async function displayCounties() {
  let state = document.querySelector("#state").value;
  let countyMenu = document.querySelector("#county");
  countyMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  countyMenu.appendChild(defaultOption);

  if (state === "") {
    return;
  }

  try {
    let url = `https://csumb.space/api/geo/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.county;
      option.textContent = item.county;
      countyMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);
    defaultOption.textContent = "Unable to load counties";
  }
}

async function checkUsername() {
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.className = "text-danger";
    return false;
  }

  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  // ignore old responses if the user kept typing while this one was loading
  if (username !== document.querySelector("#username").value) {
    return data.available;
  }

  if (data.available) {
    usernameError.textContent = "Username available!";
    usernameError.className = "text-success";
    return true;
  } else {
    usernameError.textContent = "Username taken";
    usernameError.className = "text-danger";
    return false;
  }
}

async function displaySuggestedPassword() {
  let suggestedPwd = document.querySelector("#suggestedPwd");

  try {
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url);
    let data = await response.json();
    suggestedPwd.textContent = `Suggested: ${data.password}`;
  } catch (error) {
    console.error(error);
  }
}

async function validateForm(event) {
  event.preventDefault(); // stop the form from submitting until we check it

  let isValid = true;

  // username must be filled in and available
  let usernameAvailable = await checkUsername();
  if (usernameAvailable === false) {
    isValid = false;
  }

  // password checks
  let password = document.querySelector("#password").value;
  let passwordAgain = document.querySelector("#passwordAgain").value;
  let passwordError = document.querySelector("#passwordError");
  passwordError.textContent = "";

  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    isValid = false;
  } else if (password !== passwordAgain) {
    passwordError.textContent = "Passwords do not match";
    isValid = false;
  }

  if (isValid) {
    document.querySelector("#signupForm").submit();
  }
}
