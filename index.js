require('dotenv').config()

require('./mongo')

const express = require('express')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const app = express()

const cors = require('cors')

const Note = require('./models/Note')

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

Sentry.init({
  dsn: 'https://331ddb4d624541159f301c5e2ead419b@o1076483.ingest.sentry.io/6078345',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Full stack open - Bootcamp</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

// url with dynamic path => /:dynamicValue
app.get('/api/notes/:id', (request, response, next) => {
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

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note?.content) {
    response.status(400).json({
      error: 'content missing',
    })

    return
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date(),
  })

  newNote.save().then((savedNote) => {
    response.status(201).json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  if (!note) {
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

app.use(notFound)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
