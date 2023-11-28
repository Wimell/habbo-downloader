// convertXmlToJson.js
const { readFile, writeFile } = require('fs/promises');
const { parseStringPromise } = require('xml2js');

async function convertXmlToJson(xmlFilePath, jsonFilePath) {
  try {
    const xml = await readFile(xmlFilePath, 'utf8').trim();
    const result = await parseStringPromise(xml);
    await writeFile(jsonFilePath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Converted ${xmlFilePath} to JSON.`);
  } catch (error) {
    console.error('Error converting XML to JSON:', error);
  }
}

const xmlFilePath = './resource/gamedata/external_flash_texts.txt';
const jsonFilePath = './resource/gamedata/ExternalTexts.json';
convertXmlToJson(xmlFilePath, jsonFilePath);
