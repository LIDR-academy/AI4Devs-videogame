import os

# Define the project root directory
project_root = "OJJ/endless-runner"

# Create the main directories
directories = [
    project_root,
    os.path.join(project_root, "assets"),
    os.path.join(project_root, "assets/images"),
    os.path.join(project_root, "assets/audio")
]

# Create directories
for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"Created directory: {directory}")

# Create empty files
files = [
    os.path.join(project_root, "index.html"),
    os.path.join(project_root, "main.js")
]

for file_path in files:
    with open(file_path, 'w') as f:
        pass
    print(f"Created file: {file_path}")

print("Project structure created successfully!") 