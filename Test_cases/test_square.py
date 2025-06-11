import unittest


# Buggy function
def square(num):
    return num * num  # ❌ Bug


# Unit tests
class TestSquareFunction(unittest.TestCase):

    def test_valid_input(self):
        self.assertEqual(square(3), 9)
        self.assertEqual(square(5), 25)

    def test_negative_input(self):
        self.assertEqual(square(-4), 16)

    def test_invalid_input(self):
        with self.assertRaises(TypeError):
            square("hello")
        with self.assertRaises(TypeError):
            square(None)


if __name__ == '__main__':
    unittest.main()
