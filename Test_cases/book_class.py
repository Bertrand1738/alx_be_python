# Define a class called Book
class Book:
    # Constructor method to initialize the attributes
    def __init__(self, title, author, pages):
        self.title = title    # Set the title attribute
        self.author = author  # Set the author attribute
        self.pages = pages    # Set the pages attribute

    # __str__ method: returns a user-friendly string (for readers/users)
    def __str__(self):
        return f"'{self.title}' by {self.author}, {self.pages} pages"

    # __repr__ method: returns a developer-friendly string (for debugging)
    def __repr__(self):
        return f"Book(title='{self.title}', author='{self.author}', pages={self.pages})"


# Example of using the Book class
book1 = Book("The Great Gatsby", "F. Scott Fitzgerald", 180)

# Print using str() or just print() — this will call __str__()
print(book1)

# Print using repr() — this will call __repr__()
print(repr(book1))