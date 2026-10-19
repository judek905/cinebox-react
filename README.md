# CineBox

CineBox is a movie and TV show discovery website. You can browse trending and popular titles, search by name, filter by genre, open any title to read about it and watch its trailer, and save titles to a personal watchlist.

The design is inspired by the browsing experience of MovieBox (dark theme, rows of posters, a featured banner). The name, logo and code are my own. CineBox is a discovery app only: there is no video playback, no downloads, no payments, no accounts and no backend.

**Live app:** _paste your Vercel or Netlify link here_

## Technologies used

- **React** (JavaScript, JSX) created with **Vite**
- **Material UI** for the interface (AppBar, Drawer, Dialog, Card, Typography, TextField, Chip, Button, Box and more)
- **React Router** for navigation between pages
- **React Hooks** (`useState`, `useEffect`, plus small custom hooks) and **Context** for shared state
- **Fetch API** to call the TMDB REST API
- **localStorage** to keep the watchlist after a refresh

## Selected API

CineBox uses the **TMDB (The Movie Database) API**. Every title, poster, rating, release date, genre and description is loaded live from TMDB. Nothing is hardcoded in the source code, including the genre list.

Missing information is handled: a missing poster shows a placeholder, and a missing rating, date, genre or description is simply left out. Loading, empty results and API errors (missing key, bad key, rate limit, no connection) each show a clear message.

## Features

- Homepage with a rotating featured banner and three rows: Trending Now, Popular Movies, Popular TV Shows
- Navigation for Home, Movies, TV Shows and My Watchlist (a drawer on mobile)
- Search by title with a loading message, results, a "no results" message and an error message
- Genre filter and Load more on the Movies and TV Shows pages
- Details dialog with poster, overview, release date, rating, genres, runtime and trailer
- My Watchlist: add, view and remove titles, saved in the browser
- Responsive layout for desktop, tablet and mobile

## Running it locally

You need Node.js 18 or newer and a free TMDB API key (create an account at themoviedb.org, then open Settings and choose API).

```bash
git clone <your-repository-link>
cd <project-folder>
npm install
```

Create your environment file from the example and paste your key into it:

```bash
cp .env.example .env
```

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

On Windows PowerShell, use `Copy-Item .env.example .env`. Then start the app:

```bash
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173). Restart the dev server after changing `.env`.

To make and preview a production build:

```bash
npm run build
npm run preview
```

## Keeping the API key safe

The key lives in `.env`, which is listed in `.gitignore` and is never committed. The repository only contains `.env.example` with a placeholder. No passwords or private server credentials are used.

Vite includes `VITE_` variables in the code the browser downloads, so a TMDB key used this way can be seen by anyone who inspects the site. TMDB keys are free and personal, so this is acceptable for a learning project, but a larger project should send requests through a small server that keeps the key private.

## Project structure

```text
src/
  components/    Navbar, SearchBox, HeroBanner, MovieRow, MovieGrid, MovieCard,
                 GenreFilter, DetailsDialog, StatusMessage, Section, Footer, Logo
  pages/         HomePage, MoviesPage, TVShowsPage, CatalogPage, SearchPage,
                 WatchlistPage, NotFoundPage
  context/       WatchlistContext, DetailsContext, GenresContext
  hooks/         useAsync, usePagedList
  services/      tmdb.js (every API request)
  utils/         helpers.js (image URLs, formatting)
  theme.js       Material UI dark theme
  App.jsx        providers and routes
  main.jsx       entry point
```

## How it works

- **Components:** small reusable pieces. One `MovieCard` shows every poster; `MovieRow` and `MovieGrid` arrange cards; `StatusMessage` shows loading, error and empty states everywhere.
- **Getting data:** all requests are in `services/tmdb.js`, which returns titles in one consistent shape. Pages call it inside `useEffect` (through the `useAsync` and `usePagedList` hooks) and keep the results, a loading flag and any error in state.
- **Search:** the search box waits about half a second after typing stops, then updates the `/search` page, which asks TMDB for matching movies and TV shows.
- **Filtering:** the genre chips come from TMDB's genre list. Choosing one sends that genre to TMDB's discover endpoint and replaces the list.
- **Watchlist:** `WatchlistContext` keeps the list in state and writes it to localStorage every time it changes, so the posters, the details dialog, the menu badge and the watchlist page always agree. It is stored in this browser only and does not sync between devices.
- **Mobile:** the poster grid changes columns with the screen width, the menu becomes a drawer, and nothing scrolls sideways.

## Deployment

CineBox is a static site and works on Vercel or Netlify.

1. Push the project to GitHub (without `.env` or `node_modules`).
2. Import the repository on Vercel or Netlify. The build command is `npm run build` and the output folder is `dist`.
3. Add `VITE_TMDB_API_KEY` in the hosting platform's environment variable settings, then deploy.

## Troubleshooting

- **A red message says the API key is missing:** check `.env` is in the project root, the variable is named exactly `VITE_TMDB_API_KEY`, and restart `npm run dev`.
- **Nothing loads on the live site:** add the key in the hosting environment settings and redeploy.
- **`npm install` fails:** update Node.js, delete `node_modules` and `package-lock.json`, and try again.

## Screenshots

_Add at least two screenshots here: the homepage and a movie or TV show details view._

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV information and images are provided by TMDB, and their use is subject to TMDB's terms of use. Trailers are embedded from YouTube using its privacy-enhanced domain.
