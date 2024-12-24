import os
import sys
import base64
import logging
from typing import Union
from pathlib import Path
from dataclasses import dataclass
from enum import Enum, auto

import PIL
from PIL import Image
from pyzbar.pyzbar import decode as pyzbar_decode
from pyzbar.pyzbar import Decoded


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class DataFormat(Enum):
    """Enumeration for supported data formats."""
    BINARY = auto()
    TEXT = auto()


@dataclass
class QRContent:
    """Data class to store decoded QR content and metadata."""
    raw_data: bytes
    is_base64: bool
    decoded_data: bytes
    data_format: DataFormat


class QRDecoderError(Exception):
    """Base exception class for QR decoder errors."""
    pass


class QRCodeNotFoundError(QRDecoderError):
    """Exception raised when no QR code is found in the image."""
    pass


class ImageLoadError(QRDecoderError):
    """Exception raised when the image cannot be loaded."""
    pass


class QRDecoder:
    """Sophisticated QR code decoder with support for multiple formats and encodings."""

    @staticmethod
    def _is_base64(data: bytes) -> bool:
        """Check if data is base64 encoded."""
        try:
            # Try to decode then re-encode to verify
            decoded = base64.b64decode(data, validate=True)
            reencoded = base64.b64encode(decoded)
            return data == reencoded
        except Exception:
            return False

    @staticmethod
    def _binary_string_to_bytes(binary_string: str) -> bytes:
        """Convert a string of binary digits to actual binary data."""
        # Remove spaces and newlines
        binary_string = ''.join(binary_string.split())

        if not all(c in '01' for c in binary_string):
            raise ValueError("Invalid binary string - contains non-binary characters")

        # Process 8 bits at a time
        byte_array = bytearray()
        for i in range(0, len(binary_string), 8):
            byte = binary_string[i:i + 8]
            byte_array.append(int(byte, 2))
        return bytes(byte_array)

    def decode(self, image_path: Union[str, Path], data_format: DataFormat) -> QRContent:
        """Decode QR code from image file."""
        logger.info(f"Processing image: {image_path}")

        try:
            # Load and decode QR code
            image = Image.open(image_path)
            decoded_objects = pyzbar_decode(image)
            if not decoded_objects:
                raise QRCodeNotFoundError("No QR code found in image")

            qr_data = decoded_objects[0].data

            # Default: use the raw data directly
            decoded_data = qr_data

            # Try to decode as ASCII to check for binary string
            try:
                text_data = qr_data.decode('ascii')
                # Check if it's a binary string representation
                if all(c in '01 \n' for c in text_data):
                    logger.info("Detected binary string representation")
                    decoded_data = self._binary_string_to_bytes(text_data)
                    logger.debug(f"Converted binary string to {len(decoded_data)} bytes")
                    return QRContent(
                        raw_data=qr_data,
                        is_base64=False,
                        decoded_data=decoded_data,
                        data_format=data_format
                    )
            except UnicodeDecodeError:
                pass

            # Check for base64 encoding
            if self._is_base64(qr_data):
                logger.info("Detected base64 encoded data")
                try:
                    decoded_data = base64.b64decode(qr_data)
                    # Check if base64-decoded data is a binary string
                    binary_data_as_text = decoded_data.decode('ascii')
                    if all(c in '01 \n' for c in binary_data_as_text):
                        logger.info("Base64 decoded binary string representation detected")
                        decoded_data = self._binary_string_to_bytes(binary_data_as_text)
                except (UnicodeDecodeError, ValueError):
                    logger.info("Base64 decoded data is not a binary string")
            else:
                logger.info("Using raw data as non-base64 content")

            # Return the QR content
            return QRContent(
                raw_data=qr_data,
                is_base64=self._is_base64(qr_data),
                decoded_data=decoded_data,
                data_format=data_format
            )

        except Exception as e:
            raise QRDecoderError(f"Failed to decode QR code: {str(e)}")


class FileWriter:
    """Handles writing decoded data to files."""

    @staticmethod
    def write(content: QRContent, output_path: Union[str, Path], binary_mode: bool) -> None:
        """Write decoded content to file."""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if binary_mode:
            try:
                binary_data = content.decoded_data
                with open(output_path, 'wb') as f:
                    f.write(binary_data)
                logger.info(f"File successfully written to {output_path}")
            except Exception as e:
                raise IOError(f"Failed to write binary file: {str(e)}")
        else:
            mode = 'w'
            try:
                with open(output_path, mode) as f:
                    f.write(content.decoded_data.decode('utf-8'))
                logger.info(f"Successfully wrote file: {output_path}")
            except Exception as e:
                raise IOError(f"Failed to write file: {str(e)}")


def parse_arguments() -> tuple:
    """Parse command line arguments."""
    if len(sys.argv) != 4:
        logger.error("Usage: python qr_decoder.py <QR_image_path> <output_file_name> <is_binary(True/False)>")
        sys.exit(1)

    image_path = sys.argv[1]
    output_path = sys.argv[2]
    is_binary = sys.argv[3].lower() == 'true'

    return image_path, output_path, is_binary


def main() -> int:
    """Main entry point."""
    try:
        image_path, output_path, is_binary = parse_arguments()

        logger.info(f"Starting to decode QR from {image_path} and write to {output_path}")

        data_format = DataFormat.BINARY if is_binary else DataFormat.TEXT

        decoder = QRDecoder()

        # Decode QR code
        content = decoder.decode(image_path, data_format)

        # Write output
        FileWriter.write(content, output_path, binary_mode=is_binary)

        return 0

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
