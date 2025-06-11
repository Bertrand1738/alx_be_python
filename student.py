class student:
    def __init__ (self,name,age):
        self.name = name
        self.age = age
    def infor(self):
        print(f"{self.name} is a  {self.age} years old.")
student1= student("John",20)
student2 = student("Luke", 32)
print(f"{student1.name} is {student1.age} years old.")
print(f"{student2.name} is {student2.age} years old.")