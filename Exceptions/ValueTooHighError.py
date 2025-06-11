class ValueTooHighError(Exception):
    pass
num = float(input("Enter a number: "))

try:
    if num > 100:
        raise ValueTooHighError("The value is too high! Must be 100 or less.")
    else:
        print("Good number!")
except ValueTooHighError as e:
    print("Error:", e)


