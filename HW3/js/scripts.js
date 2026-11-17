const API_URL = "https://rickandmortyapi.com/api/character/";

// Grab the elements we need from the page
const form = document.getElementById("search-form");
const nameInput = document.getElementById("name");
const speciesSelect = document.getElementById("species");
const nameError = document.getElementById("name-error");
const statusMsg = document.getElementById("status");
const results = document.getElementById("results");
const loadMoreBtn = document.getElementById("load-more");

// URL of the next page of results (the API returns 20 per page)
let nextPageUrl = null;

// Event listeners
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  if (!validateName()) {
    nameInput.focus();
    return;
  }

  // Build the query string
  const params = new URLSearchParams({ name: nameInput.value.trim() });
  if (speciesSelect.value) {
    params.append("species", speciesSelect.value);
  }

  fetchCharacters(`${API_URL}?${params.toString()}`);
});

// Re-validate as the user types so the error clears once fixed
nameInput.addEventListener("input", () => {
  if (nameError.textContent) validateName();
});

loadMoreBtn.addEventListener("click", () => {
  if (nextPageUrl) fetchCharacters(nextPageUrl, true);
});

// Validation - Name can't be empty, must be 2-40 characters,
// can only contain letters, spaces, hyphens, apostrophes, and periods.
function validateName() {
  const value = nameInput.value.trim();
  let message = "";

  if (value === "") {
    message = "Please enter a character name.";
  } else if (value.length < 2) {
    message = "Name must be at least 2 characters.";
  } else if (value.length > 40) {
    message = "Name must be 40 characters or fewer.";
  } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
    message = "Use letters, spaces, hyphens, apostrophes, or periods only.";
  }

  nameError.textContent = message;
  nameInput.classList.toggle("invalid", message !== "");
  return message === "";
}

// Fetch
async function fetchCharacters(url, append = false) {
  statusMsg.textContent = "Searching the multiverse...";
  loadMoreBtn.hidden = true;

  try {
    const response = await fetch(url);

    // The API answers with 404 when nothing matches the search
    if (response.status === 404) {
      if (!append) results.innerHTML = "";
      statusMsg.textContent = "No characters found. Try a different name or species.";
      return;
    }
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    displayCharacters(data.results, append);

    nextPageUrl = data.info.next;
    loadMoreBtn.hidden = !nextPageUrl;
    const shown = results.children.length;
    statusMsg.textContent = `Showing ${shown} of ${data.info.count} character(s).`;
  } catch (error) {
    console.error(error);
    statusMsg.textContent = "Something went wrong while contacting the API. Please try again.";
  }
}

// Display
function displayCharacters(characters, append) {
  if (!append) results.innerHTML = "";

  characters.forEach((character) => {
    const card = document.createElement("article");
    card.className = "card";

    const statusClass = character.status.toLowerCase();

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <div class="card-body">
        <h2>${character.name}</h2>
        <p><span class="dot ${statusClass}"></span>${character.status} - ${character.species}</p>
        <p><strong>Gender:</strong> ${character.gender}</p>
        <p><strong>Origin:</strong> ${character.origin.name}</p>
        <p><strong>Last seen:</strong> ${character.location.name}</p>
        <p><strong>Episodes:</strong> ${character.episode.length}</p>
      </div>
    `;
    results.appendChild(card);
  });
}
