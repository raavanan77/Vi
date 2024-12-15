import subprocess
import time

# Start the subprocess
process = subprocess.Popen(
    ['ping','-c10','1.1.1.1'],  # Replace with the command you want to run
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

start_time = time.perf_counter()  # Get the start time

# Monitor the time progress
while process.poll() is None:  # Polling to check if the process has finished
    elapsed_time = time.perf_counter() - start_time
    print(f"Elapsed Time: {elapsed_time:.2f} seconds", end="\r")  # Update the time in place
    time.sleep(1)  # Wait for a second before checking again

# After the process finishes, print total time
elapsed_time = time.perf_counter() - start_time
print(f"\nProcess completed in {elapsed_time:.2f} seconds")
