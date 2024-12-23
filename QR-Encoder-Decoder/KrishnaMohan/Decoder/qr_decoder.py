import os
import sys
import base64
from pathlib import Path
from pyzbar.pyzbar import decode as scan_qr # type: ignore
from PIL import Image # type: ignore

def check_base64_encoding(data: bytes) -> bool:
    try:
        return data == base64.b64encode(base64.b64decode(data, validate=True))
    except Exception:
        return False

def binary_string_to_bytes(binary_string: str) -> bytes:
    binary_string = ''.join(binary_string.split())
    if not all(char in '01' for char in binary_string):
        raise ValueError("Invalid binary string format")
    return bytes(int(binary_string[i:i+8], 2) for i in range(0, len(binary_string), 8))

def read_qr_code(image_path: Path) -> bytes:
    try:
        image = Image.open(image_path)
        qr_result = scan_qr(image)
        if not qr_result:
            raise ValueError("No QR code detected in the image")
        return qr_result[0].data
    except Exception as error:
        raise ValueError(f"Failed to process image: {error}")

def process_qr_data(raw_data: bytes, binary_mode: bool) -> bytes:
    try:
        decoded_text = raw_data.decode('ascii')
        if all(char in '01 \n' for char in decoded_text):
            return binary_string_to_bytes(decoded_text)
    except UnicodeDecodeError:
        pass

    if check_base64_encoding(raw_data):
        try:
            decoded_base64 = base64.b64decode(raw_data)
            decoded_text = decoded_base64.decode('ascii')
            return binary_string_to_bytes(decoded_text) if all(char in '01 \n' for char in decoded_text) else decoded_base64
        except (UnicodeDecodeError, ValueError):
            pass
    return raw_data

def save_to_file(content: bytes, output_path: Path, binary_mode: bool) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    mode, data_to_write = ('wb', content) if binary_mode else ('w', content.decode('utf-8'))
    try:
        with open(output_path, mode) as file:
            file.write(data_to_write)
        print(f"Data successfully saved to {output_path}")
    except Exception as error:
        raise IOError(f"Error saving output file: {error}")

def runner(input_file: str, output_file: str, binary: bool) -> int:
    try:
        qr_content = read_qr_code(Path(input_file))
        processed_content = process_qr_data(qr_content, binary)
        save_to_file(processed_content, Path(output_file), binary)
        return 0
    except Exception as error:
        print(f"Error: {error}")
        return 1

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <input_image> <output_file> [--binary]")
        print("Example: python script.py QR1.png output.txt --binary")
        sys.exit(1)

    input_image = sys.argv[1]
    output_file = sys.argv[2]
    binary_flag = '--binary' in sys.argv

    sys.exit(runner(input_image, output_file, binary_flag))
