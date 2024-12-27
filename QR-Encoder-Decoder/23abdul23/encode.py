import sys, os
import base64
import qrcode


def qr_genrate():

    if len(sys.argv) != 3:
        print("Usage: ")
        print("encode.py inputfile output_filename")
        return

    args = sys.argv

    file_path = args[1]
    output_qr_path = args[2]


    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")

    # Step 1: Read the file and encode it as Base64
    with open(file_path, "rb") as file:
        base64_data = base64.b64encode(file.read()).decode('utf-8')

    print(base64_data)

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


try:
    qr_genrate()

except ValueError:
    print("File is Too Large to encode")

    