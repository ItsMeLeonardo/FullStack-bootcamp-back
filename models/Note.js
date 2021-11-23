const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Note = model('Note', noteSchema)

module.exports = Note
