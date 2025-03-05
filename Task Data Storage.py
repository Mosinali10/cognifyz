             # WELCOME TO TASK 5 IN THIS TASK WE ARE GOING TO MAKE A PROGRAM TO ENHANCE 
                  # A SIMPLE CRUD APPLICATION TO SAVE AND LOAD TASKS USING FILE I/O  
                                                                          # BY-MOSIN ALI

class Task:
    def __init__(self,title):
        self.title=title
        self.description=description

    def __str__(self):
        return f"Task: {self.title}\nDescription: {self.description}"

def show_menu():
    print("\n Welcome to Task Manager")
    print("1. Create a new task")
    print("2. View all tasks")
    print("3. Update a task")
    print("4. Delete a task")
    print("5. Save tasks to file")
    print("6. Load tasks from file")
    print("7. Exit")

def create_task(tasks):
    title=input("Enter task title:").strip()
    description=input("Enter task description:").strip()
    tasks.append(Task(title,description))
    print("\nTask created successfully")

def view_tasks(tasks):
    if not tasks:
        print("\nNo tasks available.")
    else:
        for i,task in enumerate(tasks,start=1):
            print(f"\nTask {i}:")
            print(task)

def update_task(tasks):
    if not tasks:
        print("\nNo tasks to update.")
        return
    view_tasks(tasks)
    try:
        task_number=int(input("\nEnter the task number to update:"))
        if 1<=task_number<=len(tasks):
            task=tasks[task_number-1]
            task.title=input(f"Enter new title (current: {task.title}):").strip()
            task.description=input(f"Enter new description (current: {task.description}):").strip()
            print("\nTask updated successfully")
        else:
            print("\nInvalid task number.")
    except ValueError:
        print("\nPlease enter a valid number.")

def delete_task(tasks):
    if not tasks:
        print("\nNo tasks to delete.")
        return
    view_tasks(tasks)
    try:
        task_number=int(input("\nEnter the task number to delete:"))
        if 1<=task_number<=len(tasks):
            tasks.pop(task_number-1)
            print("\nTask deleted successfully")
        else:
            print("\nInvalid task number.")
    except ValueError:
        print("\nPlease enter a valid number.")

def save_tasks_to_file(tasks,filename):
    with open(filename,'w') as file:
        for task in tasks:
            file.write(f"{task.title}|{task.description}\n")
    print("\nTasks saved to file.")

def load_tasks_from_file(filename):
    tasks=[]
    try:
        with open(filename,'r') as file:
            for line in file:
                title,description=line.strip().split('|')
                tasks.append(Task(title,description))
        print("\nTasks loaded from file.")
    except FileNotFoundError:
        print("\nFile not found.")
    return tasks

def run_task_manager():
    tasks=[]
    filename="tasks.txt"

    while True:
        show_menu()
        choice=input("\nChoose an option (1-7):").strip()

        if choice=='1':
            create_task(tasks)
        elif choice=='2':
            view_tasks(tasks)
        elif choice=='3':
            update_task(tasks)
        elif choice=='4':
            delete_task(tasks)
        elif choice=='5':
            save_tasks_to_file(tasks,filename)
        elif choice=='6':
            tasks=load_tasks_from_file(filename)
        elif choice=='7':
            print("\nExiting Task Manager, Goodbye")
            break
        else:
            print("\nInvalid choice. Please select a number between 1 and 7.")

run_task_manager()
