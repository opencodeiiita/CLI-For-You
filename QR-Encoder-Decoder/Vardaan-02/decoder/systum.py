import os
import base64
from PIL import Image
from pyzbar.pyzbar import decode

def decode_qr_code(image_path, output_file_name, is_binary):
    """
    Decode a QR code and write the decoded content to an output file.

    Parameters:
    image_path (str): Path to the image containing the QR code.
    output_file_name (str): Name of the output file to save the decoded content.
    is_binary (bool): Specifies if the QR code content is binary.

    Returns:
    None
    """
    # Step 1: Read the QR code image
    try:
        qr_image = Image.open(image_path)
    except FileNotFoundError:
        raise FileNotFoundError(f"Image at {image_path} not found.")

    # Step 2: Decode the QR code using pyzbar
    decoded_objects = decode(qr_image)
    if not decoded_objects:
        raise ValueError("No QR code detected or QR code could not be decoded.")

    # Extract data from the first detected QR code
    decoded_data = decoded_objects[0].data

    # Step 3: Check if the data is Base64 encoded
    try:
        # Attempt to decode and re-encode to verify Base64 validity
        decoded_bytes = base64.b64decode(decoded_data, validate=True)
        reencoded_data = base64.b64encode(decoded_bytes)

        # Check if re-encoded data matches original data
        if reencoded_data == decoded_data:
            is_base64 = True
        else:
            is_base64 = False
    except Exception:
        is_base64 = False

    # Step 4: If Base64 encoded, decode it
    if is_base64:
        final_data = base64.b64decode(decoded_data)
    else:
        final_data = decoded_data

    # Step 5: Write the data to the output file
    mode = 'wb' if is_binary else 'w'
    with open(output_file_name, mode) as output_file:
        if is_binary:
            output_file.write(final_data)  # Write bytes directly for binary files
        else:
            output_file.write(final_data.decode('utf-8'))  # Decode bytes to string for text files

    print(f"Decoded content successfully saved to {output_file_name}.")

if __name__ == "__main__":
    # Folder setup
    folder_name = "./output"
    os.makedirs(folder_name, exist_ok=True)

    # Inputs
    image_path = input("Enter the path to the image containing the QR code: ")
    output_file_name = input("Enter the output file name (with extension): ")
    is_binary = input("Is the data inside the QR code binary? (yes/no): ").strip().lower() == "yes"

    try:
        decode_qr_code(image_path, os.path.join(folder_name, output_file_name), is_binary)
    except Exception as e:
        print(f"Error: {e}")
