const fs = require('fs');
const path = require('path');

function createAndDeleteFilesWithCallbacks() {
  createRandomJSONFile('file1.json', () => {
    createRandomJSONFile('file2.json', () => {
      createRandomJSONFile('file3.json', () => {
        deleteFile('file1.json', () => {
          deleteFile('file2.json', () => {
            deleteFile('file3.json', () => {
              console.log('Files deleted concurrently with callbacks.');
            });
          });
        });
      });
    });
  });
}

function createRandomJSONFile(filename, callback) {
  const data = JSON.stringify({ data: Math.random() });
  fs.writeFile(filename, data, callback);
}

function deleteFile(filename, callback) {
  fs.unlink(filename, callback);
}

function createAndDeleteFilesWithPromises() {
  createRandomJSONFilePromise('file1.json')
    .then(() => createRandomJSONFilePromise('file2.json'))
    .then(() => createRandomJSONFilePromise('file3.json'))
    .then(() => {
      return Promise.all([
        deleteFilePromise('file1.json'),
        deleteFilePromise('file2.json'),
        deleteFilePromise('file3.json'),
      ]);
    })
    .then(() => {
      console.log('Files deleted concurrently with promises.');
    });
}

function createRandomJSONFilePromise(filename) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ data: Math.random() });
    fs.writeFile(filename, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function deleteFilePromise(filename) {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function createAndDeleteFilesWithAsyncAwait() {
  try {
    await createRandomJSONFileAsync('file1.json');
    await createRandomJSONFileAsync('file2.json');
    await createRandomJSONFileAsync('file3.json');

    await Promise.all([
      deleteFileAsync('file1.json'),
      deleteFileAsync('file2.json'),
      deleteFileAsync('file3.json'),
    ]);

    console.log('Files deleted concurrently with async/await.');
  } catch (err) {
    console.error('Error:', err);
  }
}

function createRandomJSONFileAsync(filename) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ data: Math.random() });
    fs.writeFile(filename, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function deleteFileAsync(filename) {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const method = process.argv[2];
if (method === 'callbacks') {
  createAndDeleteFilesWithCallbacks();
} else if (method === 'promises') {
  createAndDeleteFilesWithPromises();
} else if (method === 'asyncawait') {
  createAndDeleteFilesWithAsyncAwait();
} else {
  console.log('Please provide a valid method (callbacks, promises, or asyncawait).');
}
