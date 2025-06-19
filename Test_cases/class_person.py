# Define a class called Person
class Person:
    # The constructor method __init__ is called automatically when a new object is created
    def __init__(self, name, age):
        # self.name and self.age are attributes of the object
        self.name = name  # Assign the value of the 'name' parameter to the object's 'name' attribute
        self.age = age    # Assign the value of the 'age' parameter to the object's 'age' attribute

    # The destructor method __del__ is called automatically when the object is about to be destroyed
    def __del__(self):
        # Print a farewell message
        print(f"Goodbye {self.name}, you were {self.age} years old. The object is being deleted.")

# Example of using the Person class
# Creating an object 'person1' of class Person
person1 = Person("Alice", 30)

# Accessing the attributes of the object
print(f"Name: {person1.name}")
print(f"Age: {person1.age}")

# Deleting the object manually to trigger the destructor
del person1
