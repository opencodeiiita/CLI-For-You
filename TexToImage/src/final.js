const {latexToImage} = require('./latexToImage');
const readline = require('readline');

function getInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let inputs = {};

    return new Promise((resolve, reject) => {
        rl.question('Enter the LATEX string: ', (latex) => {
            inputs.latex = latex;
            rl.question('Enter the output file path: ', (outputPath) => {
                inputs.outputPath = outputPath;

                rl.question('Enter width (optional): ', (width) => {
                    inputs.width = width ? parseInt(width) : undefined;

                    rl.question('Enter height (optional): ', (height) => {
                        inputs.height = height ? parseInt(height) : undefined;

                        rl.close();
                        resolve(inputs);
                    });
                });
            });
        });
    });
}

async function takeUserInput() {
    try {
        const inputs = await getInput();

        const { latex, outputPath, width, height } = inputs;

        if (!latex) {
            throw new Error('Latex string is required.');
        }
        if (!outputPath) {
            throw new Error('Output file path is required.');
        }

        await latexToImage(latex, outputPath, { width, height });

        console.log(`Image successfully created at ${outputPath}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
//for now lets just call the function here
takeUserInput();

module.exports = takeUserInput;