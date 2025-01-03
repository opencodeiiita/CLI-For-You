import qrcode

def generate_qr_code(data, output_file="qr_code.png"):
    try:
        qr = qrcode.QRCode(
            version=1, 
            error_correction=qrcode.constants.ERROR_CORRECT_L, 
            box_size=10,  
            border=4, 
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img.save(output_file)
        print(f"QR code saved as {output_file}")
    except Exception as e:
        print(f"An error occurred while generating the QR code: {e}")

if __name__ == "__main__":
    url = input("Enter the URL to encode into a QR code: ")
    output_file = input("Enter the name of the output image file (e.g., qr_code.png): ")
    generate_qr_code(url, output_file)
