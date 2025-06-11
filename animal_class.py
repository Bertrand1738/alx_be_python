class Animal:
    def __init__(self,name):
        self.name = name

    def speak(self ):
         pass
class Lion (Animal):
    def speak(self):
        return f"{self.name} the lion roars"

class Elephant(Animal):
    def speak(self):
        return f"{self.name} the elephant trumpets "

zoo = [
    Lion("Simba"),
    Elephant("Julia")
]
for animal in zoo:
  print( animal.speak())