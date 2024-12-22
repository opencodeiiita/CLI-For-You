import base64
import cv2
import os
import sys

def decode_qr(input_image_path, output_file_name, binary_format):
    try:
        # Load the QR code image
        qr_image = cv2.imread(input_image_path)
        if qr_image is None:
            raise FileNotFoundError(f"Error: Cannot open the file {input_image_path}")

        # Decode the QR code
        detector = cv2.QRCodeDetector()
        data, _, _ = detector.detectAndDecode(qr_image)

        if not data:
            raise ValueError("Error: No QR code data found in the provided image.")

        # Check if data is base64 encoded
        def is_base64_encoded(data):
            try:
                decoded_data = base64.b64decode(data, validate=True)
                # Re-encode and compare to confirm base64 encoding
                return base64.b64encode(decoded_data).decode() == data
            except Exception:
                return False

        # Process data based on whether it's base64 encoded
        if is_base64_encoded(data):
            decoded_data = base64.b64decode(data)
        else:
            decoded_data = data.encode()

        # Write data to the output file
        mode = "wb" if binary_format.lower() == "yes" else "w"
        with open(output_file_name, mode) as output_file:
            output_file.write(decoded_data if mode == "wb" else decoded_data.decode())
        
        print(f"Data successfully written to {output_file_name}")

    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Take inputs from the user
    input_image_path = input("Enter the path to the QR code image: ")
    output_file_name = input("Enter the output file name (with extension): ")
    binary_format = input("Is the data binary? (yes/no): ")
    
    decode_qr(input_image_path, output_file_name, binary_format)
