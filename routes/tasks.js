const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// Getting all
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getTask, (req, res) => {
  res.json(res.task)
})

// Creating one
router.post('/', async (req, res) => {
  const task = new Task({
    type: req.body.type,
    task: req.body.task,
    assignedTo: req.body.assignedTo,
    index: req.body.index
  })
  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getTask, async (req, res) => {
  if (req.body.type != null) {
    res.task.type = req.body.type
  }
  if (req.body.task != null) {
    res.task.task = req.body.task
  }
  if (req.body.assignedTo != null) {
    res.subscriber.assignedTo = req.body.assignedTo
  }
  if (req.body.index != null) {
    res.subscriber.index = req.body.index
  }
  try {
    const updatedTask = await res.task.save()
    res.json(updatedTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getTask, async (req, res) => {
  try {
    await res.task.remove()
    res.json({ message: 'Deleted Task' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id)
    if (task == null) {
      return res.status(404).json({ message: 'Cannot find task' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.task = task
  next()
}

module.exports = router