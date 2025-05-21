# Finance Calculator
# This program calculates monthly savings and yearly savings with interest based on income and expenses

# Get user input for monthly income and expenses
monthly_income = input("Enter your monthly income: ")
monthly_expenses = input("Enter your total monthly expenses: ")

# Convert string inputs to float values
monthly_income = float(monthly_income)
monthly_expenses = float(monthly_expenses)

# Calculate monthly savings
monthly_savings = monthly_income - monthly_expenses

# Calculate projected annual savings with 5% interest
annual_savings_base = monthly_savings * 12
interest_amount = annual_savings_base * 0.05
projected_annual_savings = annual_savings_base + interest_amount

# Display results
print(f"Your monthly savings are ${monthly_savings:.2f}.")
print(f"Projected savings after one year, with interest, is: ${projected_annual_savings:.2f}.")