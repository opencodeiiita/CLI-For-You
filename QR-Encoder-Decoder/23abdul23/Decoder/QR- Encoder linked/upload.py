import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

import io
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.http import MediaIoBaseDownload


import base64
import qrcode

from pyzbar.pyzbar import decode
from PIL import Image



# Define the Google Drive API scopes and service account file path
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = "ytube-upload-qr-81155ded7dea.json"

# Create credentials using the service account file
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Build the Google Drive service
drive_service = build('drive', 'v3', credentials=credentials)

def upload_file(file_path, file_name, mime_type='text/plain', parent_folder_id=None):
    """Upload a file to Google Drive."""
    file_metadata = {
    'name': file_name,
    'parents': [parent_folder_id] if parent_folder_id else []
    }
    media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
    file = drive_service.files().create(
    body=file_metadata, media_body=media, fields='id').execute()
    print(f"Uploaded file with ID: {file.get('id')}\n")

    return file.get('id')

def download_file(file_id, destination_path):
    """Download a file from Google Drive by its ID."""
    request = drive_service.files().get_media(fileId=file_id)
    fh = io.FileIO(destination_path, mode='wb')
    
    downloader = MediaIoBaseDownload(fh, request)
    
    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"\nDownload {int(status.progress() * 100)}%.")

def qr_genrate(id, output_qr_path):

    base64_data = base64.b64encode(id.encode("utf-8")).decode("utf-8")
   
    qr = qrcode.QRCode(
        version=None,  # Automatically adjust size
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # Lower error correction for more data
        box_size=10,
        border=4,
    )
    qr.add_data(base64_data)
    qr.make(fit=True)

    # Save the QR code
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_qr_path)
    print("QR Code is made Succesfully...")

def qr_decoder(qr_input,output_path):
    
    qr_path = qr_input
    output = output_path
    
    # Open and decode the QR code
    img = Image.open(qr_path)
    decoded_img = decode(img)

    if not decoded_img:
        print("No QR code detected!")
        return

    # Extract and decode Base64 data from the QR code
    data = b"".join(obj.data for obj in decoded_img)

    try:
        decoded_data = base64.b64decode(data).decode("utf-8")  # Decode Base64 to string
    except Exception as e:
        print(f"Error decoding Base64: {e}")
        return

    download_file(decoded_data, output)


if __name__ == '__main__':

    uploaded_id = upload_file("1.png", "Test_img.png")

    qr_genrate(uploaded_id, "out_img.png")

    qr_decoder("out_img.png", "final_img.png")


