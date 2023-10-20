const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const inputFilename = '../lipsum.txt';
const filenamesFilename = '../filenames.txt';

async function readInputFile() {
  try {
    const inputText = await readFile(inputFilename, 'utf8');
    return inputText;
  } catch (err) {
    console.error('An error occurred while reading the input file:', err);
    throw err;
  }
}

async function convertToUppercase(inputText) {
  const uppercaseText = inputText.toUpperCase();
  try {
    await writeFile('uppercase.txt', uppercaseText);
    await writeFile(filenamesFilename, 'uppercase.txt\n', { flag: 'a' });
  } catch (err) {
    console.error('An error occurred while converting to uppercase:', err);
    throw err;
  }
  return uppercaseText;
}

async function convertToLowercaseAndSplit(inputText) {
  const lowercaseText = inputText.toLowerCase();
  const sentences = lowercaseText.split('.');
  return sentences;
}

async function writeSentencesToFiles(sentences) {
  const newFilenames = [];
  for (let i = 0; i < sentences.length; i++) {
    const filename = `sentence${i}.txt`;
    await writeFile(filename, sentences[i]);
    newFilenames.push(filename);
  }
  try {
    await writeFile(filenamesFilename, newFilenames.join('\n'), { flag: 'a' });
  } catch (err) {
    console.error('An error occurred while writing sentences to files:', err);
    throw err;
  }
}

async function sortAndWriteFiles(sentences) {
  sentences.sort();
  try {
    await writeFile('sorted.txt', sentences.join('\n'));
    await writeFile(filenamesFilename, '\nsorted.txt', { flag: 'a' });
  } catch (err) {
    console.error('An error occurred while sorting and writing files:', err);
    throw err;
  }
}

async function readAndDeleteFiles() {
  try {
    const filenamesText = await readFile(filenamesFilename, 'utf8');
    const filenames = filenamesText.split('\n').filter(Boolean);

    for (const filename of filenames) {
      await unlink(filename);
    }
  } catch (err) {
    console.error('An error occurred while reading and deleting files:', err);
    throw err;
  }
}

async function main() {
  try {
    await writeFile(`${filenamesFilename}`, '', { flag: 'w' });
    const inputText = await readInputFile();
    const uppercaseText = await convertToUppercase(inputText);
    const sentences = await convertToLowercaseAndSplit(inputText);
    await writeSentencesToFiles(sentences);
    await sortAndWriteFiles(sentences);
    await readAndDeleteFiles();

    console.log('File operations completed.');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

module.exports = main;
