from datetime import datetime

tasks = []

class Task:
    def __init__(self, title, description, start_date, end_date):
        self.title = title
        self.description = description
        self.start_date = start_date
        self.end_date = end_date

def create_task():
    print("\n📝 Let's create a new task")
    title = input("Enter task title: ").strip()
    description = input("Enter task description: ").strip()
    start_date = input("Enter task start date (YYYY-MM-DD): ").strip()
    end_date = input("Enter task end date (YYYY-MM-DD): ").strip()

    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")

        if start_date_obj >= end_date_obj:
            print("⚠️ Start date must be earlier than end date")
            return
    except ValueError:
        print("⚠️ Please enter valid dates in YYYY-MM-DD format")
        return

    if title and description:
        tasks.append(Task(title, description, start_date, end_date))
        print("✅ Task created successfully")
        print(f"🗓️ Task Details: Title: {title}, Description: {description}, Start Date: {start_date}, End Date: {end_date}")
    else:
        print("⚠️ Task title and description cannot be empty")

def view_tasks():
    if tasks:
        print("\n📋 Here are your tasks")
        for index, task in enumerate(tasks, start=1):
            print(f"{index}. {task.title} - {task.description} (Start: {task.start_date}, End: {task.end_date})")
    else:
        print("\n🗃️ No tasks available. Add some tasks to get started")

def update_task():
    view_tasks()
    if tasks:
        try:
            task_num = int(input("\n✏️ Enter the task number to update: ")) - 1
            if 0 <= task_num < len(tasks):
                new_title = input("Enter new title: ").strip()
                new_description = input("Enter new description: ").strip()
                new_start_date = input("Enter new start date (YYYY-MM-DD): ").strip()
                new_end_date = input("Enter new end date (YYYY-MM-DD): ").strip()

                try:
                    new_start_date_obj = datetime.strptime(new_start_date, "%Y-%m-%d")
                    new_end_date_obj = datetime.strptime(new_end_date, "%Y-%m-%d")

                    if new_start_date_obj >= new_end_date_obj:
                        print("⚠️ Start date must be earlier than end date")
                        return
                except ValueError:
                    print("⚠️ Please enter valid dates in YYYY-MM-DD format")
                    return

                if new_title and new_description:
                    tasks[task_num].title = new_title
                    tasks[task_num].description = new_description
                    tasks[task_num].start_date = new_start_date
                    tasks[task_num].end_date = new_end_date
                    print("🔄 Task updated successfully")
                else:
                    print("⚠️ Title and description cannot be empty")
            else:
                print("❗ Invalid task number")
        except ValueError:
            print("❗ Please enter a valid number")

def delete_task():
    view_tasks()
    if tasks:
        try:
            task_num = int(input("\n❌ Enter the task number to delete: ")) - 1
            if 0 <= task_num < len(tasks):
                deleted_task = tasks.pop(task_num)
                print(f"🗑️ Task '{deleted_task.title}' deleted successfully")
            else:
                print("❗ Invalid task number")
        except ValueError:
            print("❗ Please enter a valid number")

def show_menu():
    while True:
        print("\n--- 📂 Task Manager ---")
        print("1. 📝 Create a new task")
        print("2. 📋 View all tasks")
        print("3. ✏️ Update a task")
        print("4. ❌ Delete a task")
        print("5. 🚪 Exit")

        choice = input("Choose an option: ").strip()

        if choice == '1':
            create_task()
        elif choice == '2':
            view_tasks()
        elif choice == '3':
            update_task()
        elif choice == '4':
            delete_task()
        elif choice == '5':
            print("👋 Exiting Task Manager. Goodbye")
            break
        else:
            print("⚠️ Invalid choice. Please select a valid option")

show_menu()
