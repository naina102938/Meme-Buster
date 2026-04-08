var jokesGrid = document.getElementById("jokesGrid");
var loadingBox = document.getElementById("loadingBox");
var errorBox = document.getElementById("errorBox");
var emptyBox = document.getElementById("emptyBox");
var statusText = document.getElementById("statusText");
var totalCount = document.getElementById("totalCount");
var showingCount = document.getElementById("showingCount");
var favoriteCount = document.getElementById("favoriteCount");
var refreshBtn = document.getElementById("refreshBtn");
var searchInput = document.getElementById("searchInput");
var filterType = document.getElementById("filterType");
var sortBy = document.getElementById("sortBy");
var clearBtn = document.getElementById("clearBtn");
var favoritesOnlyBtn = document.getElementById("favoritesOnlyBtn");
var themeBtn = document.getElementById("themeBtn");

var allJokes = [];
var favoriteIds = [];
var showFavoritesOnly = false;
var darkMode = false;

function showLoading() {
  loadingBox.classList.remove("hidden");
  errorBox.classList.add("hidden");
  emptyBox.classList.add("hidden");
  statusText.textContent = "Loading latest jokes...";
}

function hideLoading() {
  loadingBox.classList.add("hidden");
}

function showError() {
  errorBox.classList.remove("hidden");
  statusText.textContent = "Could not load jokes";
}

function updateCounts(list) {
  totalCount.textContent = allJokes.length;
  showingCount.textContent = list.length;
  favoriteCount.textContent = favoriteIds.length;
}

function createJokeCard(joke) {
  var isFavorite = favoriteIds.indexOf(joke.id) !== -1;

  return (
    '<article class="joke-card">' +
      '<div class="card-top">' +
        '<span class="joke-type">' + joke.type + "</span>" +
        '<button class="favorite-btn ' + (isFavorite ? "active" : "") + '" data-id="' + joke.id + '" title="Favorite">' + (isFavorite ? "❤" : "♡") + "</button>" +
      "</div>" +
      "<h3>" + joke.setup + "</h3>" +
      "<p>Tap the heart to save this joke to your favorites.</p>" +
      '<p class="punchline">' + joke.punchline + "</p>" +
      '<div class="card-footer">Joke ID: ' + joke.id + "</div>" +
    "</article>"
  );
}

function applyFeatures() {
  var query = searchInput.value.toLowerCase().trim();
  var selectedType = filterType.value;
  var selectedSort = sortBy.value;

  var filteredJokes = allJokes.filter(function (joke) {
    var fullText = (joke.setup + " " + joke.punchline).toLowerCase();
    var matchesSearch = fullText.indexOf(query) !== -1;
    var matchesType = selectedType === "all" || joke.type === selectedType;
    var matchesFavorite = !showFavoritesOnly || favoriteIds.indexOf(joke.id) !== -1;

    return matchesSearch && matchesType && matchesFavorite;
  });

  var sortedJokes = filteredJokes.slice().sort(function (a, b) {
    if (selectedSort === "setup-asc") {
      return a.setup.localeCompare(b.setup);
    }

    if (selectedSort === "setup-desc") {
      return b.setup.localeCompare(a.setup);
    }

    if (selectedSort === "short-long") {
      return (a.setup.length + a.punchline.length) - (b.setup.length + b.punchline.length);
    }

    if (selectedSort === "long-short") {
      return (b.setup.length + b.punchline.length) - (a.setup.length + a.punchline.length);
    }

    return 0;
  });

  renderJokes(sortedJokes);
}

function renderJokes(jokes) {
  updateCounts(jokes);

  if (!jokes.length) {
    jokesGrid.innerHTML = "";
    emptyBox.classList.remove("hidden");
    statusText.textContent = "No jokes matched your current options";
    return;
  }

  emptyBox.classList.add("hidden");

  jokesGrid.innerHTML = jokes
    .map(function (joke) {
      return createJokeCard(joke);
    })
    .join("");

  statusText.textContent = jokes.length + " jokes ready to enjoy";

  var favoriteButtons = document.querySelectorAll(".favorite-btn");

  favoriteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var id = Number(button.getAttribute("data-id"));
      toggleFavorite(id);
    });
  });
}

function toggleFavorite(id) {
  var alreadyFavorite = favoriteIds.find(function (item) {
    return item === id;
  });

  if (alreadyFavorite) {
    favoriteIds = favoriteIds.filter(function (item) {
      return item !== id;
    });
  } else {
    favoriteIds = favoriteIds.concat(id);
  }

  applyFeatures();
}

function resetControls() {
  searchInput.value = "";
  filterType.value = "all";
  sortBy.value = "default";
  showFavoritesOnly = false;
  favoritesOnlyBtn.textContent = "Show Favorites";
  applyFeatures();
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  themeBtn.textContent = darkMode ? "☀" : "🌙";
}

function fetchJokes() {
  showLoading();
  jokesGrid.innerHTML = "";

  fetch("https://official-joke-api.appspot.com/random_ten")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then(function (data) {
      hideLoading();
      errorBox.classList.add("hidden");
      allJokes = data;
      applyFeatures();
    })
    .catch(function () {
      hideLoading();
      showError();
    });
}

searchInput.addEventListener("input", applyFeatures);
filterType.addEventListener("change", applyFeatures);
sortBy.addEventListener("change", applyFeatures);
refreshBtn.addEventListener("click", fetchJokes);
clearBtn.addEventListener("click", resetControls);
themeBtn.addEventListener("click", toggleTheme);

favoritesOnlyBtn.addEventListener("click", function () {
  showFavoritesOnly = !showFavoritesOnly;
  favoritesOnlyBtn.textContent = showFavoritesOnly ? "Show All Jokes" : "Show Favorites";
  applyFeatures();
});

fetchJokes();