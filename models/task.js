const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true,
    default: "Everyone"
  },
  index:{
      type: Number,
      required:true
  }
})

module.exports = mongoose.model('Task', taskSchema)