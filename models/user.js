const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = mongoose.Schema({
  google_email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  google_access_token: {
    type: String,
    required: true
  },
  google_access_token_expiry: {
    type: String,
    required: true
  },
  google_refresh_token: {
    type: String,
    required: true
  },
  spotify_email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  spotify_access_token: {
    type: String,
    required: true
  },
  spotify_access_token_expiry: {
    type: String,
    required: true
  },
  spotify_refresh_token: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    google_email: Joi.string().min(5).max(255).required().email(),
    spotify_email: Joi.string().min(5).max(255).required().email(),
    google_access_token: Joi.string().required(),
    google_refresh_token: Joi.string().required(),
    spotify_access_token: Joi.string().required(),
    spotify_refresh_token: Joi.string().required(),
    spotify_access_token_expiry: Joi.string().required(),
    google_access_token_expiry: Joi.string().required()
  });

  return schema.validate(user);
}

function validateID(_id) {
  const schema = Joi.object({
    _id: Joi.string().alphanum().length(24)
  });

  return schema.validate(_id);
}

exports.User = User;
exports.validate = validateUser;
exports.validateID = validateID;