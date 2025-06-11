class Dog :
    def __init__(self,name, breed):
        self.name = name
        self.breed = breed
    def bark(self):
        return "woof"
dog1 = Dog("squid","Germand sphefaerd")
dog2 = Dog("Bob","Golden retriever")
print(f" {dog1.name} is a  {dog2.breed}. He says {dog1.bark()}")
print(f" {dog2.name} is a  {dog2.breed}. He says {dog2.bark()}")
