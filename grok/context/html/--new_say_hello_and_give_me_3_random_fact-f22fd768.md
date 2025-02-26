```python
import random

def say_hello_and_facts():
    print("Hello!")
    facts = [
        "The shortest war in history lasted for 38-45 minutes between Britain and Zanzibar on August 27, 1896.",
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
        "The world's oldest known musical instrument is a flute made from a vulture bone, found in Germany, and it's about 40,000 years old."
    ]
    for _ in range(3):
        fact = random.choice(facts)
        print(f"- {fact}")
        facts.remove(fact)  # Ensure no duplicates

say_hello_and_facts()
```

This Python script defines a function `say_hello_and_facts` that prints a greeting and three random facts from a predefined list. The `random.choice` function is used to select facts randomly, and `facts.remove` ensures that the same fact isn't printed twice.

Would you like to know more about how to customize this script? Or perhaps you're interested in learning how to add more facts to the list?

