"""
Task Manager - CRUD Operations
Supports creating, viewing, updating, and deleting tasks with date validation.
"""

from datetime import datetime

tasks = []


class Task:
    def __init__(self, title, description, start_date, end_date):
        self.title = title
        self.description = description
        self.start_date = start_date
        self.end_date = end_date

    def __str__(self):
        return (
            f"  Title      : {self.title}\n"
            f"  Description: {self.description}\n"
            f"  Start Date : {self.start_date}\n"
            f"  End Date   : {self.end_date}"
        )


def _parse_dates(start, end):
    """Validate and parse date strings. Returns (start_obj, end_obj) or raises ValueError."""
    start_obj = datetime.strptime(start, "%Y-%m-%d")
    end_obj = datetime.strptime(end, "%Y-%m-%d")
    if start_obj >= end_obj:
        raise ValueError("Start date must be earlier than end date.")
    return start_obj, end_obj


def create_task():
    print("\n📝 Create a New Task")
    title = input("  Title       : ").strip()
    description = input("  Description : ").strip()

    if not title or not description:
        print("⚠️  Title and description cannot be empty.")
        return

    start_date = input("  Start Date (YYYY-MM-DD): ").strip()
    end_date = input("  End Date   (YYYY-MM-DD): ").strip()

    try:
        _parse_dates(start_date, end_date)
    except ValueError as e:
        print(f"⚠️  {e}")
        return

    tasks.append(Task(title, description, start_date, end_date))
    print("✅ Task created successfully.")


def view_tasks():
    if not tasks:
        print("\n🗃️  No tasks found. Create one to get started.")
        return
    print(f"\n📋 All Tasks ({len(tasks)} total)")
    print("-" * 40)
    for i, task in enumerate(tasks, start=1):
        print(f"[{i}]\n{task}")
        print("-" * 40)


def update_task():
    view_tasks()
    if not tasks:
        return
    try:
        idx = int(input("\n✏️  Enter task number to update: ")) - 1
        if not (0 <= idx < len(tasks)):
            print("❗ Invalid task number.")
            return
    except ValueError:
        print("❗ Please enter a valid number.")
        return

    task = tasks[idx]
    new_title = input(f"  New title       [{task.title}]: ").strip() or task.title
    new_desc = input(f"  New description [{task.description}]: ").strip() or task.description
    new_start = input(f"  New start date  [{task.start_date}]: ").strip() or task.start_date
    new_end = input(f"  New end date    [{task.end_date}]: ").strip() or task.end_date

    try:
        _parse_dates(new_start, new_end)
    except ValueError as e:
        print(f"⚠️  {e}")
        return

    task.title, task.description, task.start_date, task.end_date = (
        new_title, new_desc, new_start, new_end
    )
    print("🔄 Task updated successfully.")


def delete_task():
    view_tasks()
    if not tasks:
        return
    try:
        idx = int(input("\n❌ Enter task number to delete: ")) - 1
        if not (0 <= idx < len(tasks)):
            print("❗ Invalid task number.")
            return
    except ValueError:
        print("❗ Please enter a valid number.")
        return

    removed = tasks.pop(idx)
    print(f"🗑️  Task '{removed.title}' deleted.")


def run():
    print("\n" + "=" * 40)
    print("       📂 TASK MANAGER (CRUD)")
    print("=" * 40)
    menu = {
        "1": ("📝 Create task", create_task),
        "2": ("📋 View tasks", view_tasks),
        "3": ("✏️  Update task", update_task),
        "4": ("❌ Delete task", delete_task),
        "5": ("🚪 Exit", None),
    }
    while True:
        print()
        for key, (label, _) in menu.items():
            print(f"  {key}. {label}")
        choice = input("\nChoose an option: ").strip()
        if choice == "5":
            print("👋 Goodbye!")
            break
        elif choice in menu:
            menu[choice][1]()
        else:
            print("⚠️  Invalid choice.")


if __name__ == "__main__":
    run()
