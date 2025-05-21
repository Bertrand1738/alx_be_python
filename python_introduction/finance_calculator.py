user_monthly_income = float(input("Enter your monthly income: "))
user_monthly_expenses = float(input("Enter your total monthly expenses: "))
# Calculate the user's monthly savings
user_monthly_savings = user_monthly_income - user_monthly_expenses
# Calculate the user's annual savings   
projected_savings = user_monthly_savings * 12 + (user_monthly_savings * 12 * 0.05)
# Print the user's monthly savings and projected annual savings 
print(f"Your monthly savings are: ${user_monthly_savings}")
print(f"Projected savings after one year, with interest, is: ${projected_savings}")
