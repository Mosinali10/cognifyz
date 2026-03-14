"""
The Mysterious Village — Text Adventure Game
Solve riddles, puzzles, and quizzes to escape the forest.
Every wrong answer costs you a resource. Lose them all and it's game over.
"""

import random

RESOURCES = ["gun", "fellow officer", "radio", "map"]


class GameState:
    def __init__(self):
        self.resources = list(RESOURCES)
        self.hints_left = 3

    def lose_resource(self):
        """Remove the first resource. Returns True if the player is now dead."""
        if self.resources:
            lost = self.resources.pop(0)
            print(f"  💔 You lost your {lost}.")
            if not self.resources:
                print("\n  ☠️  You have nothing left. The head officer dies.")
                print("  ══════════════  GAME OVER  ══════════════\n")
                return True
        return False

    def use_hint(self, hint_text):
        if self.hints_left > 0:
            self.hints_left -= 1
            print(f"  💡 Hint: {hint_text}  (hints remaining: {self.hints_left})")
        else:
            print("  ℹ️  No hints left.")


# ── Challenge data ────────────────────────────────────────────────────────────

RIDDLES = [
    {"q": "What room can no one enter?",
     "a": "mushroom", "hint": "It's a type of fungus."},
    {"q": "I can be cracked, made, told, and played. What am I?",
     "a": "joke", "hint": "It makes people laugh."},
    {"q": "I have a spine but no bones. What am I?",
     "a": "book", "hint": "You find it in a library."},
]

PUZZLES = [
    {"q": "What is full of holes but still holds water?",
     "a": "sponge", "hint": "Think of something absorbent."},
    {"q": "As light as a feather, yet the strongest person can't hold it for a minute?",
     "a": "breath", "hint": "You do it every second."},
    {"q": "Has a head, a tail, is brown, and has no legs?",
     "a": "penny", "hint": "It's a coin."},
]

QUIZ = [
    {"q": "What do ghosts eat for dinner?",
     "a": "spooketti", "hint": "It's a type of pasta."},
    {"q": "What is a witch's favourite subject in school?",
     "a": "spelling", "hint": "It involves words."},
    {"q": "In which room do ghosts sleep?",
     "a": "living room", "hint": "It's a common area in a house."},
    {"q": "What is a monster's favourite dessert?",
     "a": "ice scream", "hint": "Sounds like a cold treat."},
]

MONSTER_CHALLENGES = [
    {"q": "What do you call a ghost that tells good jokes?",
     "a": "boogie man", "hint": "It boogies."},
    {"q": "What kind of music do mummies listen to?",
     "a": "rap", "hint": "They like to wrap things."},
    {"q": "Why did the vampire need mouthwash?",
     "a": "because he had bad breath", "hint": "Think about what vampires drink."},
]


# ── Stage helpers ─────────────────────────────────────────────────────────────

def ask_challenge(state, challenge):
    """
    Present a single challenge dict {q, a, hint}.
    Returns True if answered correctly, False if player died.
    """
    print(f"\n  ❓ {challenge['q']}")
    while True:
        answer = input("  Your answer: ").strip().lower()
        if answer == challenge["a"]:
            print("  ✅ Correct!\n")
            return True
        print("  ❌ Wrong.")
        if state.lose_resource():
            return False
        state.use_hint(challenge["hint"])


# ── Game stages ───────────────────────────────────────────────────────────────

def stage_riddle(state):
    print("\n🔮 STAGE 1 — Riddle")
    print("  Solve the riddle to move forward.")
    return ask_challenge(state, random.choice(RIDDLES))


def stage_puzzle(state):
    print("\n🧩 STAGE 2 — Puzzle")
    print("  Solve the puzzle to continue.")
    return ask_challenge(state, random.choice(PUZZLES))


def stage_quiz(state):
    print("\n📚 STAGE 3 — Quiz")
    print("  Answer the quiz question correctly.")
    return ask_challenge(state, random.choice(QUIZ))


def stage_imposter(state):
    print("\n👥 STAGE 4 — The Imposter")
    print("  Two officers give conflicting advice. One is an imposter.")
    print("  1. Follow Officer A — head deeper into the forest.")
    print("  2. Follow Officer B — stay near the village and wait for rescue.")

    while True:
        choice = input("\n  Your choice (1/2): ").strip()
        if choice == "2":
            print("\n  🎉 You waited for rescue. Help arrived and you escaped safely.")
            print("  ══════════════  YOU WIN!  ══════════════\n")
            return False  # game ends (victory)
        elif choice == "1":
            print("\n  Something feels wrong deep in the forest...")
            return stage_final_choice(state)
        else:
            print("  ⚠️  Please enter 1 or 2.")


def stage_final_choice(state):
    print("\n⚔️  FINAL STAGE — Fight or Flee")
    while True:
        action = input("  What will you do? (fight / escape): ").strip().lower()
        if action == "fight":
            if random.choice([True, False]):
                print("\n  💪 You defeated the imposters! You survived — at great cost.")
                print("  ══════════════  YOU WIN!  ══════════════\n")
            else:
                print("\n  The imposters overpowered you.")
                state.lose_resource()
                print("  ══════════════  GAME OVER  ══════════════\n")
            return False
        elif action == "escape":
            print("\n  A monster lurks in the forest. Solve this to hide from it.\n")
            return stage_monster(state)
        else:
            print("  ⚠️  Type 'fight' or 'escape'.")


def stage_monster(state):
    challenge = random.choice(MONSTER_CHALLENGES)
    print(f"  ❓ {challenge['q']}")
    answer = input("  Your answer: ").strip().lower()
    if answer == challenge["a"]:
        print("\n  ✅ You hid successfully and escaped the forest!")
        print("  ══════════════  YOU WIN!  ══════════════\n")
    else:
        print("\n  ❌ The monster caught you.")
        state.lose_resource()
        print("  ══════════════  GAME OVER  ══════════════\n")
    return False


# ── Entry point ───────────────────────────────────────────────────────────────

def run():
    print("\n" + "=" * 50)
    print("       🏚️  THE MYSTERIOUS VILLAGE GAME")
    print("=" * 50)
    print("\n  You are lost in a forest maze.")
    print("  Solve every challenge to escape.")
    print("  Each wrong answer costs you a resource.")
    print("  Lose everything — and it's game over.\n")

    while True:
        state = GameState()
        stages = [stage_riddle, stage_puzzle, stage_quiz, stage_imposter]

        for stage in stages:
            result = stage(state)
            if result is False:
                break  # game ended (win or lose)

        again = input("Play again? (yes/no): ").strip().lower()
        if again != "yes":
            print("👋 Thanks for playing!")
            break


if __name__ == "__main__":
    run()
