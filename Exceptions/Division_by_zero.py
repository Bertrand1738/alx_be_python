number1 = float(input("Enter the first number: "))
number2 = float(input("Enter the second number: "))

try:
    result = number1 / number2
    print("Result: ",result)
except ZeroDivisionError:
    print("Error : Impossible to divide by zero!")
