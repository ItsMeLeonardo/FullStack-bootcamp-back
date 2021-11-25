const mongoose = require('mongoose')
const notesRouter = require('express').Router()

const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.status(200).json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return response.status(404).end()
      }
      return response.json(note)
    })
    .catch((error) => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

notesRouter.post('/', async (request, response, next) => {
  const note = request.body
  if (!note?.content || !note?.user) {
    console.error('note.content', note.user)
    response.status(400).json({
      error: 'content missing',
    })
    return
  }
  try {
    const newNote = new Note({
      content: note.content,
      important: note.important || false,
      user: new mongoose.Types.ObjectId(note.user),
      date: new Date(),
    })

    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  if (!note?.content) {
    response.status(400).json({
      error: 'content missing',
    })

    return
  }

  const newNoteInfo = {
    content: note.content,
    important: note.important || false,
  }

  // with {new: true} we get the updated note
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((note) => {
      response.status(200).json(note)
    })
    .catch((error) => next(error))
})

module.exports = notesRouter
