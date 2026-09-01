import os
import sys
import subprocess

def run_test_module(name, command_args):
    print("=" * 80)
    print(f"RUNNING: {name}")
    print("=" * 80)
    
    # Set PYTHONPATH to include the backend folder
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
    
    result = subprocess.run(
        [sys.executable] + command_args,
        env=env,
        capture_output=False,
        text=True
    )
    
    if result.returncode == 0:
        print(f"\n[SUCCESS] {name} passed successfully!\n")
        return True
    else:
        print(f"\n[FAILURE] {name} failed with exit code {result.returncode}.\n")
        return False

def main():
    print("=" * 80)
    print("KISANSETU UNIFIED SYSTEM TEST RUNNER")
    print("=" * 80)
    
    success = True
    
    # 1. FPO Module Database & Relationship Audit
    success &= run_test_module(
        "FPO Module DB & Relationship Audit",
        ["backend/test_fpo_e2e.py"]
    )
    
    # 2. Auth & Security Unit Tests
    success &= run_test_module(
        "Auth & Security Unit Tests",
        ["backend/app/tests/test_auth_security.py"]
    )
    
    # 3. Lot Race Condition Unit Tests
    success &= run_test_module(
        "Lot Race Condition Unit Tests",
        ["backend/app/tests/test_lot_race_condition.py"]
    )
    
    print("=" * 80)
    if success:
        print("ALL TESTS PASSED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED. Please review the logs above.")
    print("=" * 80)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
