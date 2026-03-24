# Meme Buster

## Overview
A responsive web application that fetches and displays hilarious Chuck Norris jokes from a public API, busting boredom with epic "facts." Users can browse, search, filter by category, and sort jokes interactively using JavaScript array higher-order functions (HOFs). Purpose: Demonstrate API integration, client-side data manipulation, and modern UI/UX in vanilla JS.[web:33]

## Features Planned
- **API Data Display**: Load and render multiple random jokes dynamically.
- **Search**: Keyword search across joke text using `filter()`.
- **Filtering**: By categories (e.g., 'dev', 'animal', 'food') via `filter()`.
- **Sorting**: By joke length (asc/desc) with `sort()`.
- **UI Enhancements**: Responsive design, dark/light mode toggle, loading states.
- **Bonus**: Debouncing for search, localStorage for favorites, error handling.

Project supports all milestones: Setup (now), API integration (by Apr 1), core HOF features (Apr 8), deploy (Apr 10). Feasible in timeline with simple API.[web:32][web:36]

## Technologies
- **Frontend**: HTML5, CSS3 (Flexbox/Grid, responsive media queries), Vanilla JavaScript (ES6+).
- **API**: Chuck Norris API (https://api.chucknorris.io/) – no auth, CORS-friendly.
- **Optional**: Tailwind CSS for styling.
- **Tools**: Git/GitHub, live-server for dev.[web:33]

## API Used
- Base: https://api.chucknorris.io/
- Endpoints:
  - `/jokes/random` – Single random joke.
  - `/jokes/categories` – List categories.
  - `/jokes/random?category={cat}` – Category-specific.
  - `/jokes/search?query={term}` – Search matching jokes.[web:33][web:32]
Fetches stored client-side for HOF ops (no server needed).

## Setup & Run
1. Clone repo: `git clone https://github.com/{yourusername}/meme-buster.git`
2. Open `index.html` in browser, or install live-server: `npm install -g live-server`, then `live-server`.
3. View at http://127.0.0.1:8080 (auto-reloads).





