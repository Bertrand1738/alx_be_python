# Define a base class called Animal
class Animal:
    # Method to simulate eating
    def eat(self):
        print("The animal is eating.")

    # Method to simulate sleeping
    def sleep(self):
        print("The animal is sleeping.")


# Define a subclass Dog that inherits from Animal
class Dog(Animal):
    # Override eat method
    def eat(self):
        print("The dog is eating.")

    # Override sleep method
    def sleep(self):
        print("The dog is sleeping.")

    # Method specific to Dog
    def bark(self):
        print("The dog is barking.")

    def bark(self,):
        print("The dog is barking.")


# Create an instance of Animal
animal1 = Animal()

# Call methods from Animal class
animal1.eat()
animal1.sleep()

print()  # Print an empty line for clarity

# Create an instance of Dog (subclass)
dog1 = Dog()

# Call inherited methods from Animal
dog1.eat()
dog1.sleep()

# Call method defined in Dog class
dog1.bark()
