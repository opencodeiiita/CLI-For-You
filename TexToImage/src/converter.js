const { latexToImage } = require('./latexToImage');
const path = require('path');
const fs = require('fs'); 

async function testConverter() {
    const testCases = [
        '\\int_0^\\infty e^{-x} dx',
        '\\frac{1}{2}',
        'E = mc^2',
        '\\sum_{i=1}^n i',
        '\\int_a^b f(x) dx',
        '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
        '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    ];

    console.log('Starting LaTeX to PNG conversion tests...\n');

    const outputDir = path.resolve('./output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [index, testCase] of testCases.entries()) {
        try {
            const outputPath = path.join(outputDir, `latex_test_${index + 1}.png`);
            console.log(`Converting: ${testCase}`);
            await latexToImage(testCase, outputPath);
            console.log(`Success! Image saved to: ${outputPath}\n`);
        } catch (error) {
            console.error(`Error converting "${testCase}": ${error.message}\n`);
        }
    }
}

module.exports = { testConverter };

if (require.main === module) {
    testConverter().catch(console.error);
}
