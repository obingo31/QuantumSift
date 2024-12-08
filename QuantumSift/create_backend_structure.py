import os

# Define base directory
base_dir = r"c:/Users/obing/OneDrive/Desktop/Dapp/QuantumSift/backend"

# Define directory structure
dirs = [
    f"{base_dir}/app",
    f"{base_dir}/app/models",
    f"{base_dir}/app/routes",
    f"{base_dir}/app/services",
    f"{base_dir}/app/static",
]

# Create directories
for dir_path in dirs:
    os.makedirs(dir_path, exist_ok=True)

print("Backend directory structure created successfully!")
