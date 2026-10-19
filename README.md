# CineBox

CineBox is a movie and TV show discovery website. You can browse what is trending and popular, search for any title, filter by genre, open a title to read about it and watch its trailer, and save the ones you want to watch later in a personal watchlist.

The look is inspired by the browsing experience of MovieBox: a dark theme, rows of posters and a featured banner. The name, logo and code are my own. CineBox is only for discovering titles, so there is no video playback, no downloads, no payments, no user accounts and no backend.

| | |
| --- | --- |
| **Live app** | https://velvety-sunflower-54c25d.netlify.app/ |
| **Source code** | https://github.com/judek905/simple_cinebox |
| **Built by** | Jude Kakama |

## Screenshots

| Homepage | Details view |
| --- | --- |
| ![CineBox homepage](screenshots/homepage.png) | ![CineBox details view](screenshots/details.png) |

## Features

- A featured banner that rotates through the trending titles, with Play trailer and More details buttons
- Three poster rows on the homepage: Trending Now, Popular Movies and Popular TV Shows
- Navigation for Home, Movies, TV Shows and My Watchlist, which becomes a drawer on small screens
- Search by title, with a loading indicator, results, a "no results" message and an error message
- A genre filter and a Load more button on the Movies and TV Shows pages
- A details dialog with the poster, overview, release date, rating, genres, runtime and trailer
- My Watchlist: add titles, view them and remove them. They are saved in the browser and stay after a refresh.
- A responsive layout for desktop, tablet and mobile

## Technologies used

| Technology | What it is used for |
| --- | --- |
| React (JavaScript, JSX) | Building the interface from reusable components |
| Vite | Creating the project, the dev server and the production build |
| Material UI | The main interface elements: AppBar, Drawer, Dialog, Card, Typography, TextField, Chip, Button and Box |
| React Router | Moving between Home, Movies, TV Shows, My Watchlist and Search |
| React Hooks and Context | `useState` and `useEffect`, two small custom hooks, and shared state for the watchlist, genres and details dialog |
| Fetch API | Calling the TMDB REST API |
| localStorage | Saving the watchlist in the browser |

## Selected API

CineBox uses the **TMDB (The Movie Database) API**. Titles, posters, backdrops, ratings, release dates, genres, descriptions and trailers are all loaded live from TMDB. No movie catalogue is written into the code, and even the genre list comes from the API.

APIs do not always return every field, so missing information is handled. A missing poster shows a placeholder, and a missing rating, date, genre or description is left out instead of showing a blank. Loading, empty results and errors each have their own message. The error messages cover a missing or rejected key, TMDB's rate limit and a lost connection.

## Getting started

### What you need

- [Node.js](https://nodejs.org) 18 or newer (this includes npm)
- A free TMDB API key. Create an account at https://www.themoviedb.org, then open **Settings**, choose **API**, and request a developer key. Copy the **API Key (v3 auth)**.

### Install and run

1. Clone the repository and open the folder:

   ```bash
   git clone https://github.com/judek905/simple_cinebox.git
   cd simple_cinebox
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create your environment file from the example:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `Copy-Item .env.example .env`.

4. Open `.env` and paste your key:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the address shown in the terminal, usually http://localhost:5173.

Restart the dev server any time you change `.env`.

### Other commands

```bash
npm run build     # creates the production build in the dist folder
npm run preview   # serves the production build locally to check it
```

## Environment variables

| Variable | What it is |
| --- | --- |
| `VITE_TMDB_API_KEY` | Your TMDB API key (the v3 key, or the v4 read access token) |

The real `.env` file is listed in `.gitignore` and is never committed. The repository only contains `.env.example` with a placeholder. No passwords or private server credentials are used anywhere.

Vite includes `VITE_` variables in the files the browser downloads, so a TMDB key used this way can be seen by anyone who inspects the site. TMDB keys are free and personal, which is fine for a learning project. A bigger project should send requests through a small server that keeps the key private.

## Project structure

```text
├── public/
│   ├── favicon.svg
│   └── _redirects            # makes page refresh work on Netlify
├── src/
│   ├── components/           # Navbar, SearchBox, HeroBanner, MovieRow, MovieGrid,
│   │                         # MovieCard, GenreFilter, DetailsDialog, StatusMessage,
│   │                         # Section, PageContainer, Footer, Logo
│   ├── pages/                # HomePage, MoviesPage, TVShowsPage, CatalogPage,
│   │                         # SearchPage, WatchlistPage, NotFoundPage
│   ├── context/              # WatchlistContext, DetailsContext, GenresContext
│   ├── hooks/                # useAsync, usePagedList
│   ├── services/tmdb.js      # every request to the TMDB API
│   ├── utils/helpers.js      # image URLs and formatting helpers
│   ├── theme.js              # Material UI dark theme
│   ├── App.jsx               # providers and routes
│   ├── main.jsx              # entry point
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json               # makes page refresh work on Vercel
├── vite.config.js
└── README.md
```

## How it works

**Components.** The interface is built from small pieces that are reused. One `MovieCard` shows every poster in the app. `MovieRow` and `MovieGrid` arrange cards in a scrolling row or a grid, and `StatusMessage` shows the loading, error and empty states everywhere.

**Getting the data.** All API calls are in `services/tmdb.js`, which returns every title in the same shape. Pages call it inside `useEffect` through the `useAsync` and `usePagedList` hooks, and keep the results, a loading flag and any error in state. That decides whether to show a skeleton, the posters, an empty message or an error.

**Search.** The search box waits about half a second after you stop typing before it updates the `/search` page, so TMDB is not called on every key press. Pressing Enter searches immediately.

**Filtering.** The genre chips are built from TMDB's genre list. Choosing one sends that genre to the discover endpoint and replaces the list with the new results.

**Watchlist.** `WatchlistContext` keeps the list in state and writes it to localStorage whenever it changes. The poster buttons, the details dialog, the menu badge and the watchlist page all use the same list, so they always agree.

**Responsive design.** The poster grid changes its number of columns with the screen width, the menu turns into a drawer on small screens, images keep a fixed shape, and nothing scrolls sideways.

## Deployment

CineBox is a static site and works on Netlify or Vercel.

1. Push the project to GitHub, without `.env` or `node_modules`.
2. Import the repository on Netlify or Vercel.
3. Use the build command `npm run build` and the output folder `dist`.
4. Add `VITE_TMDB_API_KEY` in the platform's environment variable settings.
5. Deploy. If you add or change the variable later, redeploy so the build picks it up.

The `_redirects` file (Netlify) and `vercel.json` (Vercel) send every address to `index.html`, so refreshing a page like `/movies` does not give a 404.

## Troubleshooting

- **A red message says the API key is missing:** check that `.env` is in the project root, that the variable is named exactly `VITE_TMDB_API_KEY`, and restart `npm run dev`.
- **The live site shows the same message:** add the key in the hosting platform's environment settings and redeploy.
- **"TMDB rejected the API key":** copy the key again from your TMDB account settings with no spaces or quotes around it.
- **Refreshing a page gives a 404 on the live site:** make sure `public/_redirects` (Netlify) or `vercel.json` (Vercel) is in the repository.
- **`npm install` fails:** update Node.js, delete `node_modules` and `package-lock.json`, and try again.

## Limitations

- The watchlist is stored in the browser only. There are no accounts, and it does not sync between devices.
- CineBox depends on TMDB. If TMDB is down or the key is missing, the pages show an error message instead of titles.
- Trailers only appear when TMDB has a YouTube trailer for the title.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV information and images are provided by TMDB and are subject to [TMDB's terms of use](https://www.themoviedb.org/api-terms-of-use). Trailers are embedded from YouTube using its privacy-enhanced domain.
