import queue
import threading
import time

# Job queue
job_queue = queue.Queue()

# Worker function to process jobs
def worker():
    while True:
        job = job_queue.get()  # Get a job from the queue
        if job is None:  # Sentinel value to stop the worker
            break
        job_id, job_data = job
        print(f"Processing job {job_id} with data: {job_data}")
        time.sleep(2)  # Simulate job processing
        print(f"Completed job {job_id}")
        job_queue.task_done()  # Mark the job as done

# Function to allow users to submit jobs dynamically
def user_input_thread():
    job_id = 1
    while True:
        user_input = input("Enter job data (or 'quit' to stop): ")
        if user_input.lower() == "quit":
            break
        job_queue.put((job_id, user_input))
        print(f"Job {job_id} added to the queue.")
        job_id += 1

# Start worker threads
num_workers = 3
threads = []
for i in range(num_workers):
    t = threading.Thread(target=worker)
    t.start()
    threads.append(t)

# Start user input thread
input_thread = threading.Thread(target=user_input_thread, daemon=True)
input_thread.start()

# Wait for user input thread to finish
input_thread.join()

# Stop worker threads
for i in range(num_workers):
    job_queue.put(None)  # Send sentinel value to stop workers

# Wait for all workers to finish
for t in threads:
    t.join()

print("All jobs processed. System shutting down.")
