const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-ctr';
let key = 'MySecretKey';

key = crypto
  .createHash('sha256')
  .update(String(key))
  .digest('base64')
  .substring(0, 32);

console.log('key: ', key);

const encrypt = (buffer) => {
  const iv = crypto.randomBytes(16);
  console.log('iv: ', iv);

  const cipher = crypto.createDecipheriv(algorithm, key, iv);
  console.log('cipher: ', cipher);

  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  console.log('result: ', result);
  return result;
};

const decrypt = (encrypted) => {
  console.log('decrypt data: ', encrypted);
  const iv = encrypted.slice(0, 16);
  console.log('iv: ', iv);

  encrypted = encrypted.slice(16);
  console.log('encrypted: ', encrypted);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
};

function encryptFile() {
  fs.readFile('./file.txt', (err, file) => {
    if (err) return console.error(err.message);

    console.log(`Current File Date: ${file}`);

    const encryptedFile = encrypt(file);

    fs.writeFile('./cipherFile.txt', encryptedFile, (err, file) => {
      if (err) return console.error(err.message);

      if (file) {
        console.log('File Encrypted Successfully: ', file);
      }
    });
  });
}

// encryptFile();

function decryptFile() {
  fs.readFile('./cipherFile.txt', (err, file) => {
    if (err) return console.error(err.message);

    console.log(`Current File Date: ${file}`);

    const decryptedFile = decrypt(file);

    fs.writeFile('./decryptedFile.txt', decryptedFile, (err, file) => {
      if (err) return console.error(err.message);

      if (file) {
        console.log('File Decrypted Successfully: ', file);
      }
    });
  });
}

decryptFile();
