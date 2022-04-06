const mongoose = require('mongoose')

const timeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default:"time"
  },
  endTime: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Time', timeSchema)