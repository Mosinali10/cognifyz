"""
Cognifyz Python Projects — Main Launcher
Run this file to access all projects from a single menu.
"""

from src import task_manager, task_storage, pattern_generator, temperature_converter, web_scraper, mystery_game

PROJECTS = {
    "1": ("📂 Task Manager (CRUD)",            task_manager.run),
    "2": ("💾 Task Manager with File Storage",  task_storage.run),
    "3": ("🔷 Pattern Generator",               pattern_generator.run),
    "4": ("🌡️  Temperature Converter",          temperature_converter.run),
    "5": ("🌐 Web Scraper",                     web_scraper.run),
    "6": ("🏚️  The Mysterious Village Game",    mystery_game.run),
}


def main():
    print("\n" + "=" * 50)
    print("       🚀 COGNIFYZ PYTHON PROJECTS")
    print("=" * 50)
    print("  A collection of Python mini-projects\n")

    while True:
        print("Select a project to run:\n")
        for key, (label, _) in PROJECTS.items():
            print(f"  {key}. {label}")
        print("  7. 🚪 Exit\n")

        choice = input("Enter choice: ").strip()
        if choice == "7":
            print("\n👋 Goodbye!\n")
            break
        elif choice in PROJECTS:
            PROJECTS[choice][1]()
        else:
            print("⚠️  Invalid choice. Please enter 1–7.\n")


if __name__ == "__main__":
    main()
