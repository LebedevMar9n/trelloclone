const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
}, { timestamps: true }
);

module.exports = mongoose.model('Section', sectionSchema);