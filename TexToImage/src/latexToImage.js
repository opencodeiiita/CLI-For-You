const tex2svg = require('tex-to-svg');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Converts LaTeX expressions to PNG images
 * @param {string} latex - The LaTeX expression to convert
 * @param {string} outputFile - Path to save the output image
 * @param {Object} [dimensions] - Optional dimensions for the output image
 * @param {number} [dimensions.width=800] - Width of the output image
 * @param {number} [dimensions.height=400] - Height of the output image
 * @returns {Promise<void>} - A promise that resolves when the image is saved
 */

async function latexToImage(latex, outputFile, dimensions = {}) {
    try {
        if (!latex || typeof latex !== 'string') {
            throw new Error('Invalid LaTeX string provided');
        }
        if (!outputFile || typeof outputFile !== 'string') {
            throw new Error('Invalid output file path');
        }

        const width = dimensions.width || 800;
        const height = dimensions.height || 400;

        const svg = tex2svg(latex);

        const tempSvgPath = `${outputFile}.svg`;
        fs.writeFileSync(tempSvgPath, svg);

        await sharp(tempSvgPath)
            .resize(width, height, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .png()
            .toFile(outputFile);

        fs.unlinkSync(tempSvgPath);
    } catch (error) {
        throw new Error(`LaTeX to image conversion failed: ${error.message}`);
    }
}

module.exports = { latexToImage };
