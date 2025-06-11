class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price  # per unit
        self.quantity = quantity  # number of units in stock

    def total_value(self):
        """Calculate total value of product in stock."""
        return self.price * self.quantity

    def __str__(self):
        return f"{self.name}: ${self.price:.2f} x {self.quantity} units = ${self.total_value():.2f}"

# Create some products
product1 = Product("Laptop", 1200.00, 5)
product2 = Product("Smartphone", 800.00, 10)

# Print product details and total stock value
print(product1)  # Output: Laptop: $1200.00 x 5 units = $6000.00
print(product2)  # Output: Smartphone: $800.00 x 10 units = $8000.00

# Total value of all products in catalog
catalog = [product1, product2]
total_catalog_value = sum(p.total_value() for p in catalog)
print(f"Total catalog value: ${total_catalog_value:.2f}")
