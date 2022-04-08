const mongoose = require('mongoose')

const rowSchema = new mongoose.Schema({
  row: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Row', rowSchema)