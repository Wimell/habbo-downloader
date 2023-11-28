const fs = require('fs');
const path = require('path');
const process = require('process');

async function convertTxtToJson(inputFilePath, outputFilePath) {
    try {
        const content = await fs.promises.readFile(inputFilePath, 'utf8');
        const jsonOutput = mapTextToJSON(content);
        await fs.promises.writeFile(outputFilePath, JSON.stringify(jsonOutput, null, 2), 'utf8');
        console.log(`Conversion successful. JSON saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

function mapTextToJSON(text) {
    if (!text) return {};

    const output = {};
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
        const [key, ...valueParts] = line.split('=');
        if (key) {
            output[key] = valueParts.join('=');
        }
    }

    return output;
}

// Main execution
if (process.argv.length !== 4) {
    console.log('Usage: node convertTxtToJson.js <inputFilePath> <outputFilePath>');
    process.exit(1);
}

const inputFilePath = path.resolve(process.argv[2]);
const outputFilePath = path.resolve(process.argv[3]);

convertTxtToJson(inputFilePath, outputFilePath);
