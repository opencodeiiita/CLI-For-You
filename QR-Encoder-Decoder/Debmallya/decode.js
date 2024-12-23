const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

var argv = process.argv.slice(2);
if(argv.length < 2) {
    console.log(`Usage: node encoder.js <input file> <output file>`);
    process.exit(1);
}

const inputFilePath = argv[0];
const outputFilePath = argv[1];

if (!fs.existsSync(inputFilePath)) {
    console.error(`Input file does not exist: ${inputFilePath}`);
    process.exit(1);
}

// Check if the file is a text file or a binary file (image, etc.)
const fileExtension = path.extname(inputFilePath).toLowerCase();
let inputData;

try {
    if (fileExtension === '.txt' || fileExtension === '.json' || fileExtension === '.csv') {
        // For text files, read the file as plain text
        inputData = fs.readFileSync(inputFilePath, 'utf-8');
    } else if (fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.gif') {
        // For image files, read them as binary data and encode as Base64
        inputData = fs.readFileSync(inputFilePath).toString('base64');
    } else {
        console.error(`Unsupported file type: ${fileExtension}`);
        process.exit(1);
    }

    // QR codes have size limitations. You can add a check for file size.
    // Max capacity for QR Code is around 2953 bytes (for the largest version and error correction level L).
    if (Buffer.byteLength(inputData, 'utf8') > 2953) {
        console.error('Error: File size exceeds the maximum size allowed for a QR code (2953 bytes).');
        process.exit(1);
    }

    // Generate the QR code with the appropriate data (text or Base64-encoded binary data)
    QRCode.toFile(outputFilePath, inputData)
        .then(() => {
            console.log(`Successfully saved to ${outputFilePath}`);
        })
        .catch(err => {
            console.error('Error generating QR code: ', err);
            process.exit(1);
        });
} catch (err) {
    console.error('Error occurred: ', err);
    process.exit(1);
}
