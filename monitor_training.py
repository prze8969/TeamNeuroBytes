import os
import time
import sys

print("="*60)
print("CROP QUALITY TRAINING MONITOR")
print("="*60)
print("Checking every 30 seconds...")
print("Press Ctrl+C to stop monitoring\n")

checkpoint_file = "checkpoints/best_model.pth"
results_file = "results/final_report.txt"
last_size = 0

try:
    while True:
        if os.path.exists(results_file):
            print("\n" + "="*60)
            print("✅ TRAINING COMPLETE!")
            print("="*60)
            print(f"\nResults saved to: {results_file}")
            print("\nFinal metrics:")
            with open(results_file, 'r') as f:
                print(f.read())
            break
        
        elif os.path.exists(checkpoint_file):
            current_size = os.path.getsize(checkpoint_file)
            if current_size != last_size:
                last_size = current_size
                print(f"⏳ Training in progress... Checkpoint updated ({last_size:,} bytes)")
            else:
                print(f" Training in progress... (last checkpoint: {last_size:,} bytes)")
        
        else:
            print("⏳ Waiting for training to start...")
        
        time.sleep(30)
        
except KeyboardInterrupt:
    print("\n\nMonitoring stopped by user.")
    sys.exit(0)
