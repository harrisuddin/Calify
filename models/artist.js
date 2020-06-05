const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const artistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  spotify_id: {
    type: String,
    required: true
  }
});

const Artist = mongoose.model("Artist", artistSchema);

function validateArtist(artist) {
  const schema = Joi.object({
    // google_email: Joi.string().min(5).max(255).required().email(),
    // spotify_email: Joi.string().min(5).max(255).required().email(),
    // google_access_token: Joi.string().required(),
    // google_refresh_token: Joi.string().required(),
    // spotify_access_token: Joi.string().required(),
    // spotify_refresh_token: Joi.string().required()
    name: Joi.string().required(),
    spotify_id: Joi.string().required()
  });

  return schema.validate(artist);
}

// function validateID(_id) {
//   const schema = Joi.object({
//     _id: Joi.string().alphanum().length(24)
//   });

//   return schema.validate(_id);
// }

exports.Artist = Artist;
exports.validate = validateArtist;
exports.artistSchema = artistSchema;
// exports.validateID = validateID;