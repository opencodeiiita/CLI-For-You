import { Jimp } from 'jimp';
import jsQR from 'jsqr';
import path from 'path';
import fs from 'fs';

function isbase64(data) {
    try {
        const decodedData = Buffer.from(data, 'base64');
        const encodedData = decodedData.toString('base64');
        return encodedData === data;
    } catch (e) {
        return false;
    }
}

function saveFile(decodedData, outputFile, isBinary) {
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (isBinary) {
        const binaryArray = decodedData.split(' ').map(binary => parseInt(binary, 2));
        // Convert the array of integers into a Buffer (which holds binary data)
        const buffer = Buffer.from(binaryArray);
    
        fs.writeFileSync(outputFile, buffer);
        console.log(`Binary file saved: ${outputFile}`);
    } else {
        fs.writeFileSync(outputFile, decodedData, 'utf-8');
        console.log(`Text file saved: ${outputFile}`);
    }
}

async function decodeQRCode(imagePath) {
    try {
        const image = await Jimp.read(imagePath);

        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height,
        };

        const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);
        if (!decodedQR) {
            throw new Error('QR code not found in the image.');
        }

        return decodedQR.data;
    } catch (error) {
        console.error('Error decoding QR code:', error);
        process.exit(1);
    }
}

async function processQRCode(imagePath, outputFile, isBinary) {
    try {
        const qrData = await decodeQRCode(imagePath);
        console.log('QR Code Data:', qrData);

        let decodedData;
        if (isbase64(qrData)) {
            decodedData = Buffer.from(qrData, 'base64').toString();
            console.log('Base64 Data Detected and Decoded.');
        } else {
            decodedData = qrData;
        }

        saveFile(decodedData, outputFile, isBinary);
    } catch (err) {
        console.error("Error:", err);
    }
}

var argv = process.argv.slice(2);
if(argv.length < 3) {
    console.log(`Usage: node decode.js <input file> <output file> <is binary(true/false)>`);
    process.exit(1);
}


const imagePath = argv[0];
const outputFile = argv[1];
const isBinary = (argv[2] == 'false') ? false : true;

// const imagePath = 'input1.png';
// const outputFile = 'output1.txt';
// const isBinary = false;

// const imagePath = 'input2.png';
// const outputFile = 'output2.png';
// const isBinary = true;

processQRCode(imagePath, outputFile, isBinary);