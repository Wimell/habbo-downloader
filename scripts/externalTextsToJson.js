const fs = require('fs');

// Read the input text file
const inputFile = './resource/gamedata/external_flash_texts.txt';
const textData = fs.readFileSync(inputFile, 'utf8');

// Split the text into lines
const lines = textData.split('\n');

// Initialize variables to store the JSON object
let jsonObject = {};

// Process each line of the text
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Check if the line starts with "START" or "END"
  if (line.startsWith("START - .txt") || line.startsWith("END - .txt")) {
    continue; // Skip these lines
  }

  const [key, ...value] = line.split('=');

  // Remove any leading numbers and characters from the key
  const cleanedKey = key.replace(/^\d+[a-zA-Z_\.]+/, '');

  // Join the value using '=' to handle values with '=' within them
  const cleanedValue = value.join('=');

  jsonObject[cleanedKey] = cleanedValue;
}

// Convert the JSON object to a JSON string
const jsonString = JSON.stringify(jsonObject, null, 2);

// Write the JSON string to an output file
const outputFile = './resource/gamedata/ExternalTexts.json';
fs.writeFileSync(outputFile, jsonString);

console.log(`Conversion completed. JSON data saved to ${outputFile}`);
