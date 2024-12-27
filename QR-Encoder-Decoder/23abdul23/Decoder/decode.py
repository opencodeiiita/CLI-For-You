import sys
from pyzbar.pyzbar import decode
from PIL import Image
import base64


def QR_decoder():
    
    args = sys.argv
    
    if len(args) != 4:
        print("Usage: ")
        print("decode.py qr_code output_file(with extension) type(binary/normal)")
        return
    
    qr_path = args[1]
    output = args [2]
    type = args[3]

    img = Image.open(qr_path)
    decoded_img = decode(img)

    data = b"".join(obj.data for obj in decoded_img) 

    
    try:
        decoded_data = base64.b64decode(data)
    
        if "\\" in str(decoded_data):
            pass
        else:
            # First decode from base64
            binary_str = base64.b64decode(data).decode()
            # Clean up the binary string
            binary_str = binary_str.replace(" ", "").replace("\n", "").replace("b'", "").replace("'", "")
            # Convert binary string to bytes
            decoded_data = int(binary_str, 2).to_bytes((len(binary_str) + 7) // 8, byteorder='big')
    except:
        decoded_data = data


    file_t = "wb" if type == "binary" else "w"

    if ".txt" in output:
        with open(output, file_t) as file:
            if type == "normal":
                file.write(decoded_data.decode("utf-8"))
            else:
                file.write(decoded_data)
    
    else:
        with open(output, 'wb') as file:
                file.write(decoded_data)


QR_decoder()