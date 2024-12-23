import cv2
from pyzbar.pyzbar import decode
from PIL import Image
import sys
import io
import os

def decode_qr_to_image(input_qr, output_file):
    try:
        # Read the QR code image
        img = cv2.imread(input_qr)
        if img is None:
            raise Exception(f"Could not read image file: {input_qr}")
        
        # Decode QR code
        decoded_objects = decode(img)
        if not decoded_objects:
            raise Exception("No QR code found in image")
        
        for obj in decoded_objects:
            # Get the decoded data as bytes
            image_data = obj.data
            
            # Save the decoded data as image
            with open(output_file, 'wb') as f:
                f.write(image_data)
            print(f"Successfully decoded image to: {output_file}")
            return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def decode_qr_to_text(input_qr, output_file):
    try:
        # Read the QR code image
        img = cv2.imread(input_qr)
        if img is None:
            raise Exception(f"Could not read image file: {input_qr}")
        
        # Decode QR code
        decoded_objects = decode(img)
        if not decoded_objects:
            raise Exception("No QR code found in image")
        
        for obj in decoded_objects:
            # Get the decoded text
            text_data = obj.data.decode('utf-8')
            
            # Save the decoded text to file
            with open(output_file, 'w') as f:
                f.write(text_data)
            print(f"Successfully decoded text to: {output_file}")
            return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    # Decode first QR code to image
    if not decode_qr_to_image('img1.png', 'output1.png'):
        sys.exit(1)
        
    # Decode second QR code to text
    if not decode_qr_to_text('img2.png', 'output2.txt'):
        sys.exit(1)