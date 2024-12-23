const fs = require("fs");
const path = require("path");
const jsqr = require("jsqr");
const { PNG } = require("pngjs");
const base64 = require("base64-js");

/**
 * Validate if the given string is a valid Base64-encoded string.
 * @param {string} data
 * @returns {boolean}
 */
function validateBase64(data) {
  try {
    const decoded = Buffer.from(data, "base64").toString("base64");
    return decoded === data;
  } catch {
    return false;
  }
}

/**
 * Convert a binary string (e.g., "01010101") into a Buffer object.
 * @param {string} binaryString
 * @returns {Buffer}
 */
function binaryToBytes(binaryString) {
  const cleanString = binaryString.replace(/[^01]/g, "");
  if (cleanString.length % 8 !== 0) {
    throw new Error("Binary string length must be a multiple of 8.");
  }
  const byteArray = [];
  for (let i = 0; i < cleanString.length; i += 8) {
    byteArray.push(parseInt(cleanString.slice(i, i + 8), 2));
  }
  return Buffer.from(byteArray);
}

/**
 * Extract raw QR code data from an image.
 * @param {string} imagePath
 * @returns {string}
 */
async function extractQRData(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const png = PNG.sync.read(buffer);
    const { data, width, height } = png;

    // Decode the image data with jsqr
    const qrCode = jsqr(data, width, height);
    if (!qrCode) {
      throw new Error("No QR code found in the image.");
    }
    return qrCode.data;
  } catch (error) {
    throw new Error(`Failed to extract QR data: ${error.message}`);
  }
}

/**
 * Interpret raw QR code data.
 * @param {string | Buffer} rawData
 * @returns {Buffer}
 */
function interpretData(rawData) {
  try {
    const dataString = rawData.toString();

    // Check for binary data
    if (/^[01\s]+$/.test(dataString)) {
      return binaryToBytes(dataString);
    }

    // Check for Base64 data
    if (validateBase64(dataString)) {
      const decodedBase64 = Buffer.from(dataString, "base64");
      const asciiString = decodedBase64.toString("ascii");

      if (/^[01\s]+$/.test(asciiString)) {
        return binaryToBytes(asciiString);
      }

      return decodedBase64;
    }

    // If none of the above, return raw data as a Buffer
    return Buffer.isBuffer(rawData) ? rawData : Buffer.from(dataString, "utf-8");
  } catch (error) {
    throw new Error(`Failed to interpret data: ${error.message}`);
  }
}

/**
 * Save the processed data to a file.
 * @param {string} outputPath
 * @param {Buffer} data
 */
function saveToFile(outputPath, data) {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, data);
    console.log(`Data saved successfully to ${outputPath}`);
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

/**
 * Save the decoded QR code data to a text file.
 * @param {string} outputPath
 * @param {string} data
 */
function saveToTextFile(outputPath, data) {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, data, "utf8");
    console.log(`Decoded QR data saved to ${outputPath}`);
  } catch (error) {
    throw new Error(`Failed to save text file: ${error.message}`);
  }
}

// Example usage
(async () => {
  try {
    const isBinary = process.argv[2] === "true"; // Whether the output should be binary or not
    const imagePath = process.argv[3]; // Input image path
    const outputPath = process.argv[4]; // Output file path

    if (!imagePath || !outputPath) {
      throw new Error("Please provide both an image path and an output path.");
    }

    const rawData = await extractQRData(imagePath);

    if (isBinary) {
      const processedData = interpretData(rawData);
      saveToFile(outputPath, processedData);
    } else {
      const dataString = rawData.toString(); // Treat as string data
      saveToTextFile(outputPath, dataString);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
