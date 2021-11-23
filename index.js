const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
  {
    id: 4,
    content: 'in react when the state change the entire components is rendered',
    date: '2019-05-30T19:20:14.298Z',
    important: false,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Full stack open - Bootcamp</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// url with dynamic path => /:dynamicValue
app.get('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const note = notes.find((note) => note.id === Number(id))

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  notes = notes.filter((note) => note.id !== Number(id))

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note?.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const newNote = {
    content: note.content,
    important: note.important || false,
    date: new Date(),
    id: notes.length + 1,
  }

  notes = notes.concat(newNote)

  return response.status(201).json(newNote)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
