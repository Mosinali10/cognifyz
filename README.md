# 🚀 Cognifyz Python Projects

A collection of six Python mini-projects built during the **Cognifyz Technologies Internship**, covering core programming concepts including CRUD operations, file I/O, pattern generation, data conversion, web scraping, and interactive game logic.

---

## 📌 Overview

| # | Project | Description |
|---|---------|-------------|
| 1 | Task Manager (CRUD) | Create, view, update, and delete tasks with date validation |
| 2 | Task Manager + File Storage | Extends CRUD with persistent save/load via file I/O |
| 3 | Pattern Generator | Prints 6 ASCII patterns (triangle, diamond, hollow square, etc.) |
| 4 | Temperature Converter | Converts between Celsius, Fahrenheit, and Kelvin |
| 5 | Web Scraper | Fetches and extracts paragraph content from any URL |
| 6 | The Mysterious Village Game | Text adventure — solve riddles, puzzles, and quizzes to escape |

---

## 🛠️ Technologies Used

- **Language:** Python 3.8+
- **Libraries:** `requests`, `beautifulsoup4`
- **Concepts:** OOP, file I/O, exception handling, web scraping, CLI design

---

## 📁 Project Structure

```
cognifyz/
├── main.py               # Unified launcher — run all projects from one menu
├── requirements.txt      # Python dependencies
├── .gitignore
├── README.md
├── src/
│   ├── __init__.py
│   ├── task_manager.py       # Project 1 — CRUD Task Manager
│   ├── task_storage.py       # Project 2 — Task Manager with File I/O
│   ├── pattern_generator.py  # Project 3 — ASCII Pattern Generator
│   ├── temperature_converter.py  # Project 4 — Temperature Converter
│   ├── web_scraper.py        # Project 5 — Web Scraper
│   └── mystery_game.py       # Project 6 — Text Adventure Game
└── data/
    └── tasks.txt             # Auto-generated when tasks are saved
```

---

## ⚙️ Installation

**1. Clone the repository**
```bash
git clone https://github.com/Mosinali10/cognifyz.git
cd cognifyz
```

**2. Create and activate a virtual environment** *(recommended)*
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

---

## ▶️ Usage

Run all projects from a single launcher:

```bash
python main.py
```

Or run any project individually:

```bash
python src/task_manager.py
python src/task_storage.py
python src/pattern_generator.py
python src/temperature_converter.py
python src/web_scraper.py
python src/mystery_game.py
```

---

## ✨ Features

### 📂 Task Manager (CRUD)
- Add tasks with title, description, start date, and end date
- Date validation — start date must be before end date
- Update any field of an existing task (press Enter to keep current value)
- Delete tasks by number

### 💾 Task Manager with File Storage
- All CRUD features above
- Save tasks to `data/tasks.txt` and reload them across sessions
- Pipe-delimited format for simple, human-readable storage

### 🔷 Pattern Generator
- Six patterns: Equilateral Triangle, Pyramid, Square, Diamond, Right-Angle Triangle, Hollow Square
- Configurable size
- Loop to print multiple patterns in one session

### 🌡️ Temperature Converter
- Six conversion modes: °C ↔ °F, °C ↔ K, °F ↔ K
- Input validation with clear error messages
- Results displayed to 2 decimal places

### 🌐 Web Scraper
- Accepts any valid URL
- Extracts and numbers all paragraph elements
- Handles network errors and timeouts gracefully

### 🏚️ The Mysterious Village Game
- Four stages: Riddle → Puzzle → Quiz → Imposter encounter
- Resource system — wrong answers cost you items
- 3 hints available per game
- Multiple endings based on player choices
- Replay support

---

## 👤 Author

**Mosin Ali**  
Internship at [Cognifyz Technologies](https://cognifyz.com)  
GitHub: [@Mosinali10](https://github.com/Mosinali10)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
