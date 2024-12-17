
import qrcode
import cv2


def encode_file_to_qr(input_file, output_image):
    """
    Encode a file into a QR Code and save it as an image.
    """
    try:
       
        with open(input_file, 'rb') as file:
            data = file.read()
        
        
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(data)
        qr.make(fit=True)

     
        qr_image = qr.make_image(fill='black', back_color='white')
        qr_image.save(output_image)
        print(f"QR Code successfully created: {output_image}")
    except Exception as e:
        print(f"Error during encoding: {e}")


def decode_qr_to_file_opencv(input_image, output_file):
    """
    Decode a QR Code image to retrieve its content and save it as a file.
    """
    try:
       
        qr_image = cv2.imread(input_image)
        if qr_image is None:
            print("Error: Could not load the image. Check the file path.")
            return

        
        detector = cv2.QRCodeDetector()
        data, _, _ = detector.detectAndDecode(qr_image)

        if data:
           
            with open(output_file, 'wb') as file:
                file.write(data.encode() if isinstance(data, str) else data)
            print(f"Data successfully decoded and saved to: {output_file}")
        else:
            print("No QR Code found in the image.")
    except Exception as e:
        print(f"Error during decoding: {e}")


if __name__ == "__main__":
    print("Welcome to QR Encoder-Decoder!")
    print("Choose an option:")
    print("1. Encode a file into a QR Code")
    print("2. Decode a QR Code to retrieve a file")

    choice = input("Enter your choice (1/2): ").strip()

    if choice == "1":
        input_file = input("Enter the path of the file to encode: ").strip()
        output_image = input("Enter the name of the output image file (with .png or .jpg extension): ").strip()
        encode_file_to_qr(input_file, output_image)
    elif choice == "2":
        input_image = input("Enter the path of the QR Code image to decode: ").strip()
        output_file = input("Enter the name of the output file (with the correct extension): ").strip()
        decode_qr_to_file_opencv(input_image, output_file)
    else:
        print("Invalid choice. Please run the program again.")
