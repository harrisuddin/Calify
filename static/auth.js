"use strict";
// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const IV_LENGTH = 16; // For AES, this is always 16
/**
 * Note: 256 (in algorithm name) is key size.
 * Block size for AES is always 128
 */
const KEY_LENGTH = 32;

/**
 *
 * @param {Buffer | String} password - The password to be used for generating key
 * @param {Buffer | String} salt - The salt that is added to the key
 * @return {Buffer} ```key```
 * 
 */
const getKeyFromPassword = (password, salt) => {
  return crypto.scryptSync(password, salt, KEY_LENGTH);
};

/**
 * A helper function for getKeyFromPassword
 * @param {Buffer | String} salt - The salt that is added to the key
 */
const getKey = (salt) => getKeyFromPassword(process.env.AUTH_SECRET, salt);

/**
 * Encrypt text with a salt.
 * @param {Buffer | String} text - The clear text message to be encrypted
 * @param {Buffer | String} salt - The salt to be used for encryption
 */
function encrypt(text, salt) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(algorithm, getKey(salt), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypt text with a salt.
 * @param {String} text - The ciphertext message to be decrypted
 * @param {Buffer | String} salt - The salt to be used for decryption
 */
function decrypt(text, salt) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(algorithm, getKey(salt), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// function verifyJWT(token) {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (ex) {
//     //console.log(ex);
//     return null;
//   }
// }

// function generateJWT(_id, google_email) {
//   const token = jwt.sign({ _id, google_email }, process.env.JWT_SECRET);
//   return token;
// }

// exports.verifyJWT = verifyJWT;
// exports.generateJWT = generateJWT;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
