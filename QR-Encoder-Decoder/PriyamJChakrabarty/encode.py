import qrcode
from PIL import Image
import sys
import base64

def generate_qr(file_name, output_image):
    # Read the file content
    with open(file_name, 'rb') as file:
        file_data = file.read()
    encoded_data = base64.b64encode(file_data).decode('utf-8')

    # Generate  QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(encoded_data)
    qr.make(fit=True)

    # Create image
    img = qr.make_image(fill='black', back_color='white')

    # Save image
    img.save(output_image)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 encode.py <input_file> <output_image>")
        sys.exit(1)
    input_file = sys.argv[1]
    output_image = sys.argv[2]
    generate_qr(input_file, output_image)
