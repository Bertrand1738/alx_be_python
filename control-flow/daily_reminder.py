# daily_reminder.py

# Prompt for task description
task = input("Enter your task: ")

# Prompt for priority level
priority = input("Priority (high/medium/low): ").lower()

# Prompt for time sensitivity
time_bound = input("Is it time-bound? (yes/no): ").lower()

# Process based on priority using match-case
match priority:
    case "high":
        if time_bound == "yes":
            print(f"Reminder: '{task}' is a high priority task that requires immediate attention today!")
        else:
            print(f"Reminder: '{task}' is a high priority task. Try to complete it soon.")
    case "medium":
        if time_bound == "yes":
            print(f"Note: '{task}' is a medium priority task that requires attention today.")
        else:
            print(f"Note: '{task}' is a medium priority task. Plan to do it when possible.")
    case "low":
        if time_bound == "yes":
            print(f"Note: '{task}' is a low priority task, but it is time-sensitive. Don't forget it!")
        else:
            print(f"Note: '{task}' is a low priority task. Consider completing it when you have free time.")
    case _:
        print("Invalid priority. Please enter high, medium, or low.")
