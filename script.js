var jokesGrid = document.getElementById("jokesGrid");
var loadingBox = document.getElementById("loadingBox");
var errorBox = document.getElementById("errorBox");
var statusText = document.getElementById("statusText");
var totalCount = document.getElementById("totalCount");
var refreshBtn = document.getElementById("refreshBtn");

function showLoading() {
  loadingBox.classList.remove("hidden");
  errorBox.classList.add("hidden");
  statusText.textContent = "Loading latest jokes...";
}

function hideLoading() {
  loadingBox.classList.add("hidden");
}

function showError() {
  errorBox.classList.remove("hidden");
  statusText.textContent = "Could not load jokes";
}

function createJokeCard(joke, index) {
  var card = document.createElement("article");
  card.className = "joke-card";

  var type = document.createElement("span");
  type.className = "joke-type";
  type.textContent = joke.type;

  var setup = document.createElement("h4");
  setup.textContent = joke.setup;

  var info = document.createElement("p");
  info.textContent = "Card #" + (index + 1) + " from the live joke batch.";

  var punchline = document.createElement("p");
  punchline.className = "punchline";
  punchline.textContent = joke.punchline;

  var burst = document.createElement("div");
  burst.className = "card-burst";

  card.appendChild(type);
  card.appendChild(setup);
  card.appendChild(info);
  card.appendChild(punchline);
  card.appendChild(burst);

  return card;
}

function renderJokes(jokes) {
  jokesGrid.innerHTML = "";

  if (!jokes || jokes.length === 0) {
    statusText.textContent = "No jokes available right now";
    totalCount.textContent = "0";
    return;
  }

  var i;
  for (i = 0; i < jokes.length; i++) {
    jokesGrid.appendChild(createJokeCard(jokes[i], i));
  }

  totalCount.textContent = jokes.length;
  statusText.textContent = jokes.length + " jokes loaded successfully";
}

function fetchJokes() {
  showLoading();
  jokesGrid.innerHTML = "";

  fetch("https://official-joke-api.appspot.com/random_ten")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then(function(data) {
      hideLoading();
      renderJokes(data);
    })
    .catch(function() {
      hideLoading();
      showError();
    });
}

refreshBtn.addEventListener("click", function() {
  fetchJokes();
});

fetchJokes();