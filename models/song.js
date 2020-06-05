const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {artistSchema} = require('./artist');

const songSchema = mongoose.Schema({
  artists: [artistSchema], // array of ids represented as strings
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  albumName: {
    type: String
  },
  spotify_id: {
    type: String,
    required: true
  },
  spotify_url: {
    type: String,
    required: true
  }
});

const Song = mongoose.model("Song", songSchema);

function validateSong(song) {
  const schema = Joi.object({
    artists: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      spotify_id: Joi.string().required()
    })),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    albumName: Joi.string().required(),
    spotify_id: Joi.string().required(),
    spotify_url: Joi.string().required(),
  });

  return schema.validate(song);
}

// function validateID(_id) {
//   const schema = Joi.object({
//     _id: Joi.string().alphanum().length(24)
//   });

//   return schema.validate(_id);
// }

exports.Song = Song;
exports.validate = validateSong;
exports.validateID = validateID;