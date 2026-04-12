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
var debounceTimer = null;

function saveFavorites() {
  localStorage.setItem("memeBusterFavorites", JSON.stringify(favoriteIds));
}

function loadFavorites() {
  var storedFavorites = localStorage.getItem("memeBusterFavorites");

  if (storedFavorites) {
    favoriteIds = JSON.parse(storedFavorites);
  }
}

function saveTheme(themeName) {
  localStorage.setItem("memeBusterTheme", themeName);
}

function loadTheme() {
  var savedTheme = localStorage.getItem("memeBusterTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙";
  }
}

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
  jokesGrid.innerHTML = "";
  statusText.textContent = "Could not load jokes";
}

function updateCounts(list) {
  totalCount.textContent = allJokes.length;
  showingCount.textContent = list.length;
  favoriteCount.textContent = favoriteIds.length;
}

function createJokeCard(joke) {
  var isFavorite = favoriteIds.indexOf(joke.id) !== -1;
  var heart = isFavorite ? "❤" : "♡";
  var activeClass = isFavorite ? "active" : "";

  return (
    '<article class="joke-card">' +
      '<div class="card-top">' +
        '<span class="joke-type">' + joke.type + "</span>" +
        '<button class="favorite-btn ' + activeClass + '" data-id="' + joke.id + '" title="Favorite">' + heart + "</button>" +
      "</div>" +
      "<h3>" + joke.setup + "</h3>" +
      "<p>Tap the heart to save this joke and view it later.</p>" +
      '<p class="punchline">' + joke.punchline + "</p>" +
      '<div class="card-footer">Joke ID: ' + joke.id + "</div>" +
    "</article>"
  );
}

function renderJokes(jokes) {
  updateCounts(jokes);

  if (jokes.length === 0) {
    jokesGrid.innerHTML = "";
    emptyBox.classList.remove("hidden");
    statusText.textContent = "No jokes matched your current selection";
    return;
  }

  emptyBox.classList.add("hidden");

  var cards = "";

  jokes.forEach(function (joke) {
    cards = cards + createJokeCard(joke);
  });

  jokesGrid.innerHTML = cards;
  statusText.textContent = jokes.length + " jokes ready to enjoy";

  bindFavoriteButtons();
}

function bindFavoriteButtons() {
  var favoriteButtons = document.querySelectorAll(".favorite-btn");

  favoriteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var jokeId = Number(button.getAttribute("data-id"));
      toggleFavorite(jokeId);
    });
  });
}

function toggleFavorite(jokeId) {
  var index = favoriteIds.indexOf(jokeId);

  if (index === -1) {
    favoriteIds.push(jokeId);
  } else {
    favoriteIds.splice(index, 1);
  }

  saveFavorites();
  applyFilters();
}

function applyFilters() {
  var searchValue = searchInput.value.toLowerCase().trim();
  var selectedType = filterType.value;
  var selectedSort = sortBy.value;
  var filteredJokes = [];

  allJokes.forEach(function (joke) {
    var combinedText = (joke.setup + " " + joke.punchline).toLowerCase();
    var matchesSearch = combinedText.indexOf(searchValue) !== -1;
    var matchesType = selectedType === "all" || joke.type === selectedType;
    var matchesFavorite = !showFavoritesOnly || favoriteIds.indexOf(joke.id) !== -1;

    if (matchesSearch && matchesType && matchesFavorite) {
      filteredJokes.push(joke);
    }
  });

  if (selectedSort === "setup-asc") {
    filteredJokes.sort(function (a, b) {
      return a.setup.localeCompare(b.setup);
    });
  } else if (selectedSort === "setup-desc") {
    filteredJokes.sort(function (a, b) {
      return b.setup.localeCompare(a.setup);
    });
  } else if (selectedSort === "short-long") {
    filteredJokes.sort(function (a, b) {
      var firstLength = a.setup.length + a.punchline.length;
      var secondLength = b.setup.length + b.punchline.length;
      return firstLength - secondLength;
    });
  } else if (selectedSort === "long-short") {
    filteredJokes.sort(function (a, b) {
      var firstLength = a.setup.length + a.punchline.length;
      var secondLength = b.setup.length + b.punchline.length;
      return secondLength - firstLength;
    });
  }

  renderJokes(filteredJokes);
}

function debounceSearch() {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(function () {
    applyFilters();
  }, 350);
}

function resetControls() {
  searchInput.value = "";
  filterType.value = "all";
  sortBy.value = "default";
  showFavoritesOnly = false;
  favoritesOnlyBtn.textContent = "Show Favorites";
  applyFilters();
}

function toggleFavoritesView() {
  showFavoritesOnly = !showFavoritesOnly;

  if (showFavoritesOnly) {
    favoritesOnlyBtn.textContent = "Show All Jokes";
  } else {
    favoritesOnlyBtn.textContent = "Show Favorites";
  }

  applyFilters();
}

function toggleTheme() {
  var isDark = document.body.classList.contains("dark");

  if (isDark) {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙";
    saveTheme("light");
  } else {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
    saveTheme("dark");
  }
}

function fetchJokes() {
  showLoading();
  jokesGrid.innerHTML = "";

  fetch("https://official-joke-api.appspot.com/random_ten")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    })
    .then(function (data) {
      allJokes = data;
      hideLoading();
      errorBox.classList.add("hidden");
      applyFilters();
    })
    .catch(function () {
      hideLoading();
      showError();
    });
}

searchInput.addEventListener("input", debounceSearch);
filterType.addEventListener("change", applyFilters);
sortBy.addEventListener("change", applyFilters);
refreshBtn.addEventListener("click", fetchJokes);
clearBtn.addEventListener("click", resetControls);
favoritesOnlyBtn.addEventListener("click", toggleFavoritesView);
themeBtn.addEventListener("click", toggleTheme);

loadFavorites();
loadTheme();
fetchJokes();