import cv2
import base64

def decode_qr(image_path):
    """
    Decode QR code using OpenCV's QRCodeDetector.
    """
    image = cv2.imread(image_path)
    qr_code_detector = cv2.QRCodeDetector()
    data, _, _ = qr_code_detector.detectAndDecode(image)
    if data:
        return data
    else:
        raise ValueError("No QR code detected in the image!")

def is_base64(data):
    """
    Check if a string is Base64 encoded.
    """
    try:
        decoded = base64.b64decode(data, validate=True)
        re_encoded = base64.b64encode(decoded).decode('utf-8')
        return re_encoded == data
    except Exception:
        return False

def process_data(data, is_binary):
    """
    Decode Base64 data if it's Base64 encoded, otherwise return as-is.
    """
    if is_base64(data):
        return base64.b64decode(data)  # Return decoded binary data
    return data.encode('utf-8') if is_binary else data  # Encode as bytes if binary, else leave as string

def write_to_file(output_file, data, is_binary):
    """
    Write the processed data to the output file.
    """
    mode = 'wb' if is_binary else 'w'
    with open(output_file, mode) as file:
        file.write(data if is_binary else data)  # Write binary or string data
    print(f"Data successfully written to {output_file}")

def qr_decoder(image_path, output_file, is_binary):
    """
    Main QR decoder function.
    """
    try:
        # Decode the QR code
        qr_data = decode_qr(image_path)
        
        # Process the QR data
        processed_data = process_data(qr_data, is_binary)
        
        # Write to the output file
        write_to_file(output_file, processed_data, is_binary)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Get inputs from the user
    image_path = input("Enter the path of the QR image: ")
    output_file = input("Enter the output file name with extension: ")
    is_binary = input("Is the file binary? (yes/no): ").strip().lower() == 'yes'
    
    # Run the QR decoder
    qr_decoder(image_path, output_file, is_binary)
