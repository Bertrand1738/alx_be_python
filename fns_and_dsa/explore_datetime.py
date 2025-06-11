# explore_datetime.py

from datetime import datetime, timedelta  # Import tools from datetime module

def display_current_datetime():
    """
    This function displays the current date and time in the format YYYY-MM-DD HH:MM:SS
    """
    current_date = datetime.now()  # Gets the current date and time
    print("Current date and time:", current_date.strftime("%Y-%m-%d %H:%M:%S"))  # Nicely formatted

def calculate_future_date():
    """
    This function calculates a future date by adding user-specified days to today's date
    """
    try:
        days_to_add = int(input("Enter the number of days to add to the current date: "))  # User input
        current_date = datetime.now()
        future_date = current_date + timedelta(days=days_to_add)  # Adds days
        print("Future date:", future_date.strftime("%Y-%m-%d"))  # Formats date
    except ValueError:
        print("Invalid input! Please enter an integer value.")

# Calling both functions
if __name__ == "__main__":
    display_current_datetime()
    calculate_future_date()
