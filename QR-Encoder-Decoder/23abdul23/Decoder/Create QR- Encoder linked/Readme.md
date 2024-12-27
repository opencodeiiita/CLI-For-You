# QR-Encoder Link

## Setup Instructions
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **IAM & Admin > Service Accounts > KEYS**.
3. Generate a service account key (JSON) and save it as `config/your_downloaded_key.json`.
4. Make sure the file is not included in Git by verifying `.gitignore`.

## Running the Project
```bash
cd "QR-Encoder Link"
python QR_link.py
