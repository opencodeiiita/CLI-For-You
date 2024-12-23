import base64
from pyzbar.pyzbar import decode
from PIL import Image

def is_base64_encoded(data):
    try:
        if isinstance(data, str):
            data = data.encode('utf-8')  # Convert string to bytes
        return data == base64.b64encode(base64.b64decode(data, validate=True))
    except Exception:
        return False

def bin_to_bytes(bin_str):
    bin_str = ''.join(bin_str.split())
    if not all(c in '01' for c in bin_str):
        raise ValueError("Invalid binary string")
    return bytes(int(bin_str[i:i+8], 2) for i in range(0, len(bin_str), 8))

def process_data(input_data, bin_mode):
    try:
        ascii_text = input_data.decode('ascii')
        if all(char in '01 \n' for char in ascii_text): 
            return bin_to_bytes(ascii_text)
    except UnicodeDecodeError:
        pass

    if is_base64_encoded(input_data):
        try:
            decoded_data = base64.b64decode(input_data)
            decoded_text = decoded_data.decode('ascii')
            if all(char in '01 \n' for char in decoded_text):
                return bin_to_bytes(decoded_text)
            return decoded_data
        except (UnicodeDecodeError, ValueError):
            pass

    return input_data

def decode_qr(image_path):
    try:
        image = Image.open(image_path)
        decoded_objects = decode(image)
        if decoded_objects:
            return decoded_objects[0].data
        return None
    except Exception as e:
        print(f"Error decoding QR code: {e}")
        return None

def write_to_file(output_filename, data, binary_mode):
    mode = 'wb' if binary_mode else 'w'
    with open(output_filename, mode) as file:
        if binary_mode:
            file.write(data)
        else:
            file.write(data.decode('utf-8'))


def main():
    image_path = input("Enter the path to the image containing the QR code: ")
    output_filename = input("Enter the output file name with extension: ")
    binary_mode = input("Is the data binary? (yes/no): ").strip().lower() == 'yes'

    print("Decoding QR code...")
    qr_data = decode_qr(image_path)

    if not qr_data:
        print("Failed to decode QR code or no data found.")
        return

    decoded_data = process_data(qr_data, binary_mode)

    print("Writing data to output file...")
    write_to_file(output_filename, decoded_data, binary_mode)

    print(f"File saved as {output_filename}.")

if __name__ == "__main__":
    main()