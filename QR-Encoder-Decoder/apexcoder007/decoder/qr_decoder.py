import base64
import cv2
import qrcode
from pyzbar.pyzbar import decode
import os

def decode_qr(image_path, output_file, binary_format):
    img = cv2.imread(image_path)
    decoded_objects = decode(img)
    
    if not decoded_objects:
        print("No QR code found.")
        return

    qr_data = decoded_objects[0].data.decode('utf-8')

    try:
        decoded_data = base64.b64decode(qr_data)
        reencoded_data = base64.b64encode(decoded_data).decode('utf-8')
        is_base64 = reencoded_data == qr_data
    except Exception:
        is_base64 = False

    if is_base64:
        final_data = decoded_data
    else:
        final_data = qr_data
        
    mode = 'wb' if binary_format.lower() == 'binary' else 'w'
    with open(output_file, mode) as f:
        if binary_format.lower() == 'binary':
            f.write(final_data)
        else:
            f.write(final_data.decode('utf-8') if is_base64 else final_data)

    print(f"Data saved to {output_file}")

if __name__ == "__main__":
    image_path = input("Enter the path to the QR code image: ")
    output_file = input("Enter the output file name with extension (e.g., output.png, text.txt): ")
    binary_format = input("Is the data binary or text? (Enter 'binary' or 'text'): ")
    
    decode_qr(image_path, output_file, binary_format)
