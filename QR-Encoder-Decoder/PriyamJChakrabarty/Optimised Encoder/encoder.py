# Import required libraries
# pip install google-api-python-client qrcode[pil]
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
import qrcode

SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'service_account.json'
PARENT_FOLDER_ID = "YOUR_PARENT_FOLDER_ID"

def authenticate():
    """Authenticate using the service account."""
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return creds

def upload_photo(file_path):
    """Upload a photo to Google Drive and return its shared URL."""
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': 'Demonstration',  
        'parents': [PARENT_FOLDER_ID]
    }

    media = MediaFileUpload(file_path, mimetype='image/jpeg')
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    file_id = file.get('id')
    service.permissions().create(
        fileId=file_id,
        body={'type': 'anyone', 'role': 'reader'}
    ).execute()

    shared_url = f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"
    return shared_url

def generate_qr_code(data, output_path="qr_code.png"):
    """Generate a QR code from the provided data and save it as an image."""
    qr = qrcode.QRCode(
        version=1,  
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_path)
    print(f"QR code saved to {output_path}")

def main():
    file_path = "thumbnail.jpg"  
    shared_url = upload_photo(file_path)
    print(f"Shared URL: {shared_url}")
    generate_qr_code(shared_url)

if __name__ == "__main__":
    main()
