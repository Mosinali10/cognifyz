"""
Temperature Converter
Converts between Celsius, Fahrenheit, and Kelvin with input validation.
"""


def celsius_to_fahrenheit(c):
    return (c * 9 / 5) + 32


def fahrenheit_to_celsius(f):
    return (f - 32) * 5 / 9


def celsius_to_kelvin(c):
    return c + 273.15


def kelvin_to_celsius(k):
    return k - 273.15


def fahrenheit_to_kelvin(f):
    return celsius_to_kelvin(fahrenheit_to_celsius(f))


def kelvin_to_fahrenheit(k):
    return celsius_to_fahrenheit(kelvin_to_celsius(k))


CONVERSIONS = {
    "1": ("Celsius → Fahrenheit",  celsius_to_fahrenheit,  "°C", "°F"),
    "2": ("Fahrenheit → Celsius",  fahrenheit_to_celsius,  "°F", "°C"),
    "3": ("Celsius → Kelvin",      celsius_to_kelvin,      "°C", "K"),
    "4": ("Kelvin → Celsius",      kelvin_to_celsius,      "K",  "°C"),
    "5": ("Fahrenheit → Kelvin",   fahrenheit_to_kelvin,   "°F", "K"),
    "6": ("Kelvin → Fahrenheit",   kelvin_to_fahrenheit,   "K",  "°F"),
}


def run():
    print("\n" + "=" * 40)
    print("      🌡️  TEMPERATURE CONVERTER")
    print("=" * 40)
    while True:
        print("\nConversion options:")
        for key, (label, *_) in CONVERSIONS.items():
            print(f"  {key}. {label}")
        print("  7. 🚪 Exit")

        choice = input("\nChoose (1-7): ").strip()
        if choice == "7":
            print("👋 Goodbye!")
            break
        if choice not in CONVERSIONS:
            print("⚠️  Invalid choice.")
            continue

        label, fn, unit_in, unit_out = CONVERSIONS[choice]
        try:
            value = float(input(f"  Enter temperature in {unit_in}: "))
        except ValueError:
            print("⚠️  Please enter a numeric value.")
            continue

        result = fn(value)
        print(f"\n  ✅ {value}{unit_in} = {result:.2f}{unit_out}")


if __name__ == "__main__":
    run()
