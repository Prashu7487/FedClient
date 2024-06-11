import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python test.py <arg1> <arg2>")
        return

    arg1 = sys.argv[1]
    arg2 = sys.argv[2]

    try:
        num1 = float(arg1)
        num2 = float(arg2)
    except ValueError:
        print("Both arguments must be numbers.")
        return

    result = num1 + num2
    print(f"The sum of {num1} and {num2} is {result}")

if __name__ == "__main__":
    main()
