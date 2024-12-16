import qrcode
import argparse
import os

def encode_file_to_qr(input_file, output_image):
    if not os.path.isfile(input_file):
        print(f"Error: {input_file} does not exist.")
        return

    with open(input_file, 'rb') as file:
        file_content = file.read()

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(file_content)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')
    img.save(output_image)
    print(f"QR code saved as {output_image}")

def main():
    parser = argparse.ArgumentParser(description='Encode a file into a QR code image.')
    parser.add_argument('input_file', type=str, help='The file to encode')
    parser.add_argument('output_image', type=str, help='The name of the output QR code image')
    
    args = parser.parse_args()
    encode_file_to_qr(args.input_file, args.output_image)

if __name__ == '__main__':
    main()
