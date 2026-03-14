"""
Pattern Generator
Prints six ASCII patterns: Equilateral Triangle, Pyramid, Square,
Diamond, Right-Angle Triangle, and Hollow Square.
"""


def equilateral_triangle(size):
    for i in range(1, size + 1):
        print(" " * (size - i) + "*" * (2 * i - 1))


def pyramid(size):
    """Pyramid — same shape as equilateral triangle, centred."""
    for i in range(1, size + 1):
        print(" " * (size - i) + "*" * (2 * i - 1))


def square(size):
    for _ in range(size):
        print("*" * size)


def diamond(size):
    for i in range(1, size + 1):
        print(" " * (size - i) + "*" * (2 * i - 1))
    for i in range(size - 1, 0, -1):
        print(" " * (size - i) + "*" * (2 * i - 1))


def right_angle_triangle(size):
    for i in range(1, size + 1):
        print("*" * i)


def hollow_square(size):
    for i in range(size):
        if i == 0 or i == size - 1:
            print("*" * size)
        else:
            print("*" + " " * (size - 2) + "*")


PATTERNS = {
    1: ("Equilateral Triangle", equilateral_triangle),
    2: ("Pyramid",              pyramid),
    3: ("Square",               square),
    4: ("Diamond",              diamond),
    5: ("Right-Angle Triangle", right_angle_triangle),
    6: ("Hollow Square",        hollow_square),
}


def run():
    print("\n" + "=" * 40)
    print("        🔷 PATTERN GENERATOR")
    print("=" * 40)
    while True:
        print("\nAvailable patterns:")
        for num, (name, _) in PATTERNS.items():
            print(f"  {num}. {name}")

        try:
            choice = int(input("\nSelect pattern (1-6): "))
            if choice not in PATTERNS:
                raise ValueError
            size = int(input("Enter size (positive integer): "))
            if size <= 0:
                raise ValueError("Size must be positive.")
        except ValueError as e:
            print(f"⚠️  Invalid input: {e}")
            continue

        print()
        PATTERNS[choice][1](size)

        again = input("\nPrint another pattern? (yes/no): ").strip().lower()
        if again != "yes":
            print("👋 Goodbye!")
            break


if __name__ == "__main__":
    run()
