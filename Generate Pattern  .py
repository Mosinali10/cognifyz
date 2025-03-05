                        #SIMPLE PROGRAM TO PRINT DIFFERENT PATTERNS 
                       #HERE YOU CAN PRINT SIX TYPES OF PATTERNS LIKE :
# 1)Equilateral Triangle,2)Pyramid,3)Square,4)Diamond,5)Right-Angle Triangle,6) Hollow Square
                                                                             #by-MOSIN ALI

def print_pattern(pattern_type, size):
    """Prints a specific pattern based on the pattern type and size."""
    if pattern_type == 1:  
        for i in range(1, size + 1):
            print(" " * (size - i) + "*" * (2 * i - 1))
    elif pattern_type == 2:  
        for i in range(1, size + 1):
            print(" " * (size - i) + "*" * (2 * i - 1))
    elif pattern_type == 3:  
        for i in range(size):
            print("*" * size)
    elif pattern_type == 4:  
         
        for i in range(1, size + 1):
            print(" " * (size - i) + "*" * (2 * i - 1))
        
        for i in range(size - 1, 0, -1):
            print(" " * (size - i) + "*" * (2 * i - 1))
    elif pattern_type == 5:  
        for i in range(1, size + 1):
            print("*" * i)
    elif pattern_type == 6: 
        for i in range(size):
            if i == 0 or i == size - 1:
                print("*" * size)  
            else:
                print("*" + " " * (size - 2) + "*")  
    else:
        print("Invalid selection. Please choose a valid option.")

def main():
    while True:
        
        print("Select the pattern type:")
        print("1: Equilateral Triangle")
        print("2: Pyramid")
        print("3: Square")
        print("4: Diamond")
        print("5: Right-Angle Triangle")
        print("6: Hollow Square")

        
        try:
            pattern_type = int(input("Enter the pattern number (1/2/3/4/5/6): "))
            if pattern_type < 1 or pattern_type > 6:
                raise ValueError("Invalid selection.")
            
            
            size = int(input("Enter the size of the pattern (positive integer): "))
            if size <= 0:
                raise ValueError("Size must be a positive integer.")

            
            print_pattern(pattern_type, size)
        
        except ValueError as e:
            print(f"Error: {e}. Please enter valid inputs.")

        
        continue_choice = input("Do you want to print another pattern? (yes/no): ").strip().lower()
        if continue_choice != 'yes':
            print("Thank you for using the pattern printer! Goodbye.")
            break

main()
#THANKYOU FOR WATCHING
