"""
Task Data Storage
Extends the Task Manager with persistent file I/O — save and load tasks from disk.
"""

import os

FILENAME = "data/tasks.txt"


class Task:
    def __init__(self, title, description):
        self.title = title
        self.description = description

    def __str__(self):
        return f"  Title      : {self.title}\n  Description: {self.description}"


def save_tasks(tasks):
    """Persist tasks to a pipe-delimited text file."""
    os.makedirs("data", exist_ok=True)
    with open(FILENAME, "w") as f:
        for task in tasks:
            f.write(f"{task.title}|{task.description}\n")
    print(f"💾 Tasks saved to '{FILENAME}'.")


def load_tasks():
    """Load tasks from file. Returns empty list if file not found."""
    tasks = []
    try:
        with open(FILENAME, "r") as f:
            for line in f:
                parts = line.strip().split("|")
                if len(parts) == 2:
                    tasks.append(Task(*parts))
        print(f"📂 Loaded {len(tasks)} task(s) from '{FILENAME}'.")
    except FileNotFoundError:
        print("ℹ️  No saved tasks found. Starting fresh.")
    return tasks


def create_task(tasks):
    title = input("  Title       : ").strip()
    description = input("  Description : ").strip()
    if not title or not description:
        print("⚠️  Title and description cannot be empty.")
        return
    tasks.append(Task(title, description))
    print("✅ Task created.")


def view_tasks(tasks):
    if not tasks:
        print("\n🗃️  No tasks available.")
        return
    print(f"\n📋 Tasks ({len(tasks)} total)")
    print("-" * 35)
    for i, task in enumerate(tasks, start=1):
        print(f"[{i}]\n{task}")
        print("-" * 35)


def update_task(tasks):
    view_tasks(tasks)
    if not tasks:
        return
    try:
        idx = int(input("\n✏️  Task number to update: ")) - 1
        if not (0 <= idx < len(tasks)):
            print("❗ Invalid number.")
            return
    except ValueError:
        print("❗ Enter a valid number.")
        return

    task = tasks[idx]
    task.title = input(f"  New title       [{task.title}]: ").strip() or task.title
    task.description = input(f"  New description [{task.description}]: ").strip() or task.description
    print("🔄 Task updated.")


def delete_task(tasks):
    view_tasks(tasks)
    if not tasks:
        return
    try:
        idx = int(input("\n❌ Task number to delete: ")) - 1
        if not (0 <= idx < len(tasks)):
            print("❗ Invalid number.")
            return
    except ValueError:
        print("❗ Enter a valid number.")
        return

    removed = tasks.pop(idx)
    print(f"🗑️  '{removed.title}' deleted.")


def run():
    print("\n" + "=" * 40)
    print("    💾 TASK MANAGER WITH FILE STORAGE")
    print("=" * 40)
    tasks = []
    while True:
        print("\n  1. ➕ Create task")
        print("  2. 📋 View tasks")
        print("  3. ✏️  Update task")
        print("  4. ❌ Delete task")
        print("  5. 💾 Save tasks")
        print("  6. 📂 Load tasks")
        print("  7. 🚪 Exit")
        choice = input("\nChoose (1-7): ").strip()

        actions = {
            "1": lambda: create_task(tasks),
            "2": lambda: view_tasks(tasks),
            "3": lambda: update_task(tasks),
            "4": lambda: delete_task(tasks),
            "5": lambda: save_tasks(tasks),
            "6": None,
        }
        if choice == "7":
            print("👋 Goodbye!")
            break
        elif choice == "6":
            tasks[:] = load_tasks()
        elif choice in actions:
            actions[choice]()
        else:
            print("⚠️  Invalid choice.")


if __name__ == "__main__":
    run()
