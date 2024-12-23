import qrcode
import argparse
import os

def encode_file_to_qr(input_file, output_file):
    if not os.path.isfile(input_file):
        raise FileNotFoundError(f"The file '{input_file}' does not exist.")
    with open(input_file, 'rb') as file:
        file_content = file.read()

    if len(file_content) > 2953: 
        raise ValueError("The file is too large to encode into a single QR code.")

    qr = qrcode.QRCode(
        version=None, 
        error_correction=qrcode.constants.ERROR_CORRECT_M, 
        box_size=10,
        border=4,
    )

    qr.add_data(file_content)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    img.save(output_file)
    print(f"QR code successfully saved to '{output_file}'")

def main():
    parser = argparse.ArgumentParser(description="Encode a file into a QR code.")
    parser.add_argument(
        "input_file", type=str, help="Path to the input file to encode."
    )
    parser.add_argument(
        "output_file", type=str, help="Path to save the QR code image (e.g., output.png)."
    )

    args = parser.parse_args()
    try:
        encode_file_to_qr(args.input_file, args.output_file)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
