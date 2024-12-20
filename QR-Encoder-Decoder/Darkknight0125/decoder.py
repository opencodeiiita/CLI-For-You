import base64
import sys
from pathlib import Path
import qrcode
from PIL import Image
from pyzbar.pyzbar import decode

def decode_qr(input_image_path, output_file_name, is_binary_format):
    try:
        # Open the QR code image
        qr_image = Image.open(input_image_path)

        # Decode the QR code
        decoded_data = decode(qr_image)
        if not decoded_data:
            print("No QR code found in the image.")
            return

        # Extract data from the first detected QR code
        qr_data = decoded_data[0].data.decode('utf-8')

        # Check if the data is base64 encoded
        try:
            base64_decoded = base64.b64decode(qr_data)
            if base64.b64encode(base64_decoded).decode('utf-8') == qr_data:
                is_base64 = True
            else:
                is_base64 = False
        except Exception:
            is_base64 = False

        # If the data is base64, decode it
        if is_base64:
            file_data = base64.b64decode(qr_data)
        else:
            file_data = qr_data

        # Write the decoded data to the output file
        output_path = Path(output_file_name)
        write_mode = 'wb' if is_binary_format else 'w'

        with open(output_path, write_mode) as output_file:
            if is_binary_format:
                output_file.write(file_data)
            else:
                output_file.write(file_data if isinstance(file_data, str) else file_data.decode('utf-8'))

        print(f"Decoded data has been written to {output_file_name}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Example usage:
    input_image_path = input("Enter the path to the image containing the QR code: ")
    output_file_name = input("Enter the output file name with extension: ")
    is_binary_format = input("Is the data binary (yes/no): ").strip().lower() == 'yes'

    decode_qr(input_image_path, output_file_name, is_binary_format)
