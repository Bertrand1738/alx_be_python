filename = input("Enter a filename: ")
try :
    with open(filename, 'r') as file :
        content = file.read()
        print("File contents: ", content)

except FileNotFoundError :
    print(f"Error: The file '{filename}' does not exist.")