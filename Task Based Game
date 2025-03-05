                          #WELCOME TO THE MYSTERIOUS VILLAGE GAME
#RULES ARE SIMPLE INVESTIGATE THE VILLAGE AND PASS ALL THE RIDDLES AND SAVE YOUR FELLOW MEN 
#ONLY GOOD AND WISE DECISION CAN SAVE EVERYONE,
import random

officer_resources = ["gun", "fellow officer", "radio", "map"]
hints_left = 3

def start_game():
    print("Welcome to the Mysterious Village Game.")
    print("You are lost in a forest maze, and the only way to escape is by solving a series of challenges.")
    print("For every wrong guess, you will lose something precious. Lose everything, and the head officer may not survive.")
    print("Your journey begins...\n")
    global officer_resources
    officer_resources = ["gun", "fellow officer", "radio", "map"]
    riddle()

def lose_resource():
    if officer_resources:
        lost_item = officer_resources.pop(0)
        print(f"You lost your {lost_item}.")
        if not officer_resources:
            print("You have nothing left. The head officer dies.")
            print("YOU ARE DEAD\n")
            return True
    return False

def use_hint():
    global hints_left
    if hints_left > 0:
        hints_left -= 1
        print(f"You used a hint. You have {hints_left} hints left.")
        return True
    else:
        print("No hints left.")
        return False

def riddle():
    print("Complete this riddle to escape the village.\n")
    riddles = [
        {"question": "What room can no one enter?", "answer": "mushroom", "hint": "It's a type of fungus."},
        {"question": "I can be cracked, made, told, and played. What am I?", "answer": "joke", "hint": "It's something that makes people laugh."},
        {"question": "I have a spine but no bones. What am I?", "answer": "book", "hint": "You can find it in a library."}
    ]
    riddle = random.choice(riddles)
    print("Riddle:", riddle["question"])
    while True:
        answer = input("Your answer:").lower()
        if answer == riddle["answer"]:
            print("Correct. You've solved the riddle.\n")
            puzzle()  # Move to the puzzle after solving the riddle
            break
        else:
            print("Incorrect. You feel something slip away.")
            if lose_resource():
                return
            if use_hint():
                print("Hint:", riddle["hint"])

def puzzle():
    print("Complete this puzzle to escape the village.\n")
    puzzles = [
        "What is full of holes but still holds water?",
        "What is as light as a feather, yet the strongest person can't hold it for much longer than a minute?",
        "What has a head, a tail, is brown, and has no legs?"
    ]
    correct_solutions = [
        "sponge",
        "breath",
        "penny"
    ]
    puzzle = random.choice(puzzles)
    print("Puzzle:", puzzle)
    while True:
        solution = input("Your solution:").lower()
        if solution in correct_solutions:
            print("Correct. You have solved the puzzle.\n")
            quiz() 
            break
        else:
            print("Incorrect. You lose another valuable resource.")
            if lose_resource():
                return
            if use_hint():
                print("Hint: Think about something that absorbs water.")

def quiz():
    print("Complete this quiz to escape the village.\n")
    quiz_questions = [
        {"question": "What do ghosts eat for dinner?", "answer": "spooketti", "hint": "It's a type of pasta."},
        {"question": "What is a witch's favorite subject in school?", "answer": "spelling", "hint": "It involves words."},
        {"question": "In which room do ghosts go to sleep?", "answer": "living room", "hint": "It's a common area in a house."},
        {"question": "What is a monster's favorite dessert?", "answer": "ice scream", "hint": "It sounds like a cold treat."}
    ]
    question = random.choice(quiz_questions)
    print("Quiz Question:", question["question"])
    while True:
        answer = input("Your answer:").lower()
        if answer == question["answer"]:
            print("Correct. You passed the quiz.\n")
            imposter()  # Move to the imposter stage after passing the quiz
            break
        else:
            print("Incorrect. You lose another vital resource.")
            if lose_resource():
                return
            if use_hint():
                print("Hint:", question["hint"])

def imposter():
    print("You finally reach the camp where the remaining team is gathered.")
    print("Two officers are giving conflicting advice, but you don’t know who to trust. One could be real, and the other could be the imposter.\n")
    print("One officer suggests heading deeper into the forest, claiming it's the safest way.")
    print("The other advises staying near the village and waiting for rescue.\n")
    print("Be careful — you don’t know who is real or who is the imposter.")
    while True:
        option = input("Which option do you choose? (1: deeper into the forest or 2: stay near the village):").strip()
        if option == '1':
            print("\nYou chose to follow the first officer’s suggestion. As you venture deeper, something feels wrong.")
            print("Suddenly, loyal officers are attacked, and only you remain. Was the officer you followed the imposter?\n")
            final_choice()
            break
        elif option == '2':
            print("\nYou chose to stay near the village. After a tense wait, rescue arrives, and you safely return home.")
            print("You survived the ordeal.")
            break
        else:
            print("Invalid choice. Please choose 1 or 2.")

def final_choice():
    while True:
        action = input("What will you do? (fight/escape):").lower()
        if action == 'fight':
            if random.choice([True, False]):
                print("\nYou master all your strength and defeat the imposters. You have survived, but at a huge cost.")
            else:
                print("\nYou fought bravely, but the imposters overpowered you.")
                if lose_resource():
                    return
                print("You have been defeated.")
            break
        elif action == 'escape':
            print("\nYou try to escape, but a massive monster is lurking in the forest. To hide from it, you must solve a challenge.\n")
            monster_challenge()
            break
        else:
            print("Invalid action. Please choose 'fight' or 'escape'.")

def monster_challenge():
    print("Solve this puzzle to hide from the monster and escape safely.\n")
    challenges = [
        "What do you call a ghost that tells good jokes?",
        "What kind of music do mummies listen to?",
        "Why did the vampire need mouthwash?"
    ]
    answers = ["boogie man", "rap", "because he had bad breath"]
    challenge = random.choice(challenges)
    print("Challenge:", challenge)
    while True:
        answer = input("Your answer:").lower()
        if answer in answers:
            print("Correct! You hide successfully and manage to escape the forest.\n")
            print("You have survived the ordeal.")
            break
        else:
            print("Incorrect! The monster catches up with you. You did not survive.\n")
            if lose_resource():
                return
            break

start_game()
