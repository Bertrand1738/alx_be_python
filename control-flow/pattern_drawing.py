# pattern_drawing.py

# Prompt the user to enter the size of the pattern
size = int(input("Enter the size of the pattern: "))

# Initialize row counter
row = 0

# Outer while loop for each row
while row < size:
    # Inner for loop to print asterisks in the current row
    for col in range(size):
        print("*", end="")  # Print without newline
    print()  # Print newline after each row
    row += 1