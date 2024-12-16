import qrcode
import sys

def generate_qr_code(input_path, output_path):
    try:
        with open(input_path, 'r', encoding='utf-8') as file:
            content = file.read()

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(content)
        qr.make(fit=True)

        qr_image = qr.make_image(fill_color="black", back_color="white")
        qr_image.save(output_path)
        print(f"QR Code successfully saved to: {output_path}")
    except FileNotFoundError:
        print(f"Error: File not found at path: {input_path}")
    except Exception as error:
        print(f"An unexpected error occurred: {error}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 qr_encoder.py <input_file> <output_image>")
        return

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    generate_qr_code(input_file_path, output_file_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 qr_encoder.py <input_file> <output_image>")
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        generate_qr(input_file, output_file)
