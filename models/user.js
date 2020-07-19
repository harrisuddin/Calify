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
  spotify_refresh_token: {
    type: String,
    required: true
  },
  google_calendar_id: {
    type: String,
    required: true
  },
  // a unix timestamp for when the calendar was last updated
  calendar_last_updated: {
    type: String,
    default: ''
  }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    google_email: Joi.string().min(5).max(255).required().email(),
    spotify_email: Joi.string().min(5).max(255).required().email(),
    google_refresh_token: Joi.required(),
    spotify_refresh_token: Joi.required(),
    google_calendar_id: Joi.string().required(),
    calendar_last_updated: Joi.string()
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