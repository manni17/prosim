import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from engine.content import ContentManager

def run_tests():
    print("Verifying Narrative Content Loading...")
    
    manager = ContentManager()
    
    # Test 1: Emails Loaded
    emails = manager.get_emails()
    print(f"1. Emails Loaded: {len(emails)} items...", end=" ")
    assert len(emails) >= 3
    print("PASS")

    # Test 2: Specific Crisis Found
    print("2. Searching for 'Cart Abandonment' التقليدي...", end=" ")
    crisis = next((e for e in emails if "Cart Abandonment" in e.subject), None)
    assert crisis is not None
    assert crisis.type == "crisis"
    print("PASS")

    # Test 3: Options Verification
    print("3. Verifying Options for Crisis...", end=" ")
    assert len(crisis.options) == 2
    assert crisis.options[0].action_id == "hotfix_checkout"
    print("PASS")
    
    # Test 4: Chats Loaded
    chats = manager.get_chats()
    print(f"4. Chats Loaded: {len(chats)} items...", end=" ")
    assert len(chats) >= 1
    print("PASS")

    print("\nNarrative Content Verification Complete.")

if __name__ == "__main__":
    run_tests()
