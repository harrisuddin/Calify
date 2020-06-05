const jwt = require("jsonwebtoken");

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (ex) {
    //console.log(ex);
    return null;
  }
}

function generateJWT(_id, google_email) {
  const token = jwt.sign({ _id, google_email }, process.env.JWT_SECRET);
  return token;
}

exports.verifyJWT = verifyJWT;
exports.generateJWT = generateJWT; 