import requests
import time
import sys

BASE_URL = "http://localhost:8000"

def run_tests():
    try:
        # 1. Reset Game
        print("1. Resetting Game...")
        resp = requests.post(f"{BASE_URL}/new-game")
        resp.raise_for_status()
        state = resp.json()['state']
        print(f"   Success. Status: {state['status']}, Health: {state['health']}")

        # 2. Get State
        print("2. Getting State...")
        resp = requests.get(f"{BASE_URL}/state")
        resp.raise_for_status()
        state = resp.json()
        print(f"   Success. Phase: {state['phase']}")

        # 3. Execute Turn
        print("3. Executing Turn (Patch)...")
        resp = requests.post(f"{BASE_URL}/turn", json={"action_id": "patch"})
        resp.raise_for_status()
        state = resp.json()
        print(f"   Success. New Health: {state['health']:.2f}")
        
    except Exception as e:
        print(f"FAIL: {e}")
        if hasattr(e, 'response') and e.response:
             print(e.response.text)
        sys.exit(1)

if __name__ == "__main__":
    # Wait for server to potentially start if run immediately after start command
    time.sleep(2) 
    run_tests()
