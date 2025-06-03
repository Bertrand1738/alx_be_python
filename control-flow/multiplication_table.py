# multiplication_table.py

# Prompt the user for input
number = int(input("Enter a number to see its multiplication table:"))

# Loop through numbers 1 to 10
for i in range(1, 11):
    product = number * i
    print(f"{number} * {i} = {product}")