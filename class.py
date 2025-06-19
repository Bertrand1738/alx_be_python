class FileHandler:
    def __init__(self,filename):
        self.filename = filename
        self.file = open(filename,'r')
    def read_data(self):
        return self.file.read()

file_object = FileHandler('greetings.txt')
print(file_object.read_data())