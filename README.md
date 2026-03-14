# 🚀 Developer Utility Hub

A production-quality React web application featuring six interactive developer tools — all in one clean, responsive dashboard. Built as part of the **Cognifyz Technologies Internship**.

> 🌐 **Live Demo: [cognifyz-eight.vercel.app](https://cognifyz-eight.vercel.app/)**

---

## ✨ Features

| Tool | Description | Route |
|------|-------------|-------|
| 🌡️ Temperature Converter | Real-time conversion between °C, °F, and K | `/converter` |
| 🔷 Pattern Generator | Visual ASCII pattern generator with live preview | `/patterns` |
| ✅ Task Manager | Add, complete, edit, and delete tasks (LocalStorage) | `/tasks` |
| 🗂️ CRUD Dashboard | Manage user records in a searchable table | `/crud` |
| 🏚️ Mystery Village Game | Decision-based text adventure with score tracking | `/game` |
| 🌐 Live Data Fetcher | Fetch and display data from public APIs | `/data-fetch` |

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** — client-side routing
- **Vanilla CSS** — custom design system, no UI library
- **LocalStorage** — persistent data without a backend
- **Public APIs** — JSONPlaceholder, Official Joke API, Cat Facts

---

## 📁 Project Structure

```
cognifyz/
├── index.html
├── vite.config.js
├── vercel.json              # SPA routing for Vercel
├── package.json
├── README.md
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.jsx             # App entry point
    ├── App.jsx              # Route definitions
    │
    ├── styles/
    │   └── global.css       # Design system (variables, components)
    │
    ├── components/          # Reusable UI components
    │   ├── Navbar.jsx
    │   ├── Layout.jsx
    │   ├── ToolCard.jsx
    │   ├── Button.jsx
    │   ├── InputField.jsx
    │   └── Modal.jsx
    │
    ├── pages/               # One file per route
    │   ├── Home.jsx
    │   ├── Converter.jsx
    │   ├── PatternGenerator.jsx
    │   ├── TaskManager.jsx
    │   ├── CrudDashboard.jsx
    │   ├── Game.jsx
    │   └── DataFetcher.jsx
    │
    └── utils/               # Pure logic, separated from UI
        ├── converter.js
        ├── patternUtils.js
        ├── taskUtils.js
        ├── crudUtils.js
        └── apiUtils.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/Mosinali10/cognifyz.git
cd cognifyz
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## 🚀 Deployment on Vercel

**Option 1 — Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option 2 — GitHub Integration**
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your `cognifyz` repository
4. Framework preset: **Vite**
5. Click **Deploy**

The `vercel.json` file handles SPA routing automatically — all routes redirect to `index.html`.

---

## 👤 Author

**Mosin Ali**  
Internship at [Cognifyz Technologies](https://cognifyz.com)  
GitHub: [@Mosinali10](https://github.com/Mosinali10)

---

## 📄 License

MIT
