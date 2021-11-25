const mongoose = require('mongoose')
const { server } = require('../../index')
const Note = require('../../models/Note')
const { initialNotes, api, getAllNotes } = require('./notes-helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map((note) => new Note(note))
  const promiseArray = noteObjects.map((note) => note.save())
  await Promise.all(promiseArray)
})

describe('GET method', () => {
  test('should return notes in type json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('When call an incorrect url', async () => {
    await api.get('/api/notessssss').expect(404)
  })

  test('should return notes contains a note about html ', async () => {
    const { contents } = await getAllNotes()

    expect(contents).toContain('HTML is easy test')
  })
})

describe('POST method', () => {
  test('should add a new note', async () => {
    const newNote = {
      content: 'Test new note :D',
      important: false,
      user: '619fd2a7c11458512b3e8c59',
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllNotes()

    expect(contents).toContain(newNote.content)

    expect(response.body).toHaveLength(initialNotes.length + 1)
  })

  test('ADD note without content', async () => {
    const newNote = {
      important: false,
    }

    const response = await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('content missing')

    const { response: notes } = await getAllNotes()
    expect(notes.body).toHaveLength(initialNotes.length)
  })

  test('ADD note with invalid user', async () => {
    const newNote = {
      content: '123456',
    }

    const responseError = await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(responseError.body.error).toContain('UserId is invalid')

    const { response } = await getAllNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE method', () => {
  test('should delete the first note', async () => {
    const { response: firstResponse } = await getAllNotes()
    const [noteToDelete] = firstResponse.body
    const { id } = noteToDelete
    await api.delete(`/api/notes/${id}`).expect(204)

    const { response: newResponse, contents } = await getAllNotes()
    expect(contents).not.toContain(noteToDelete.content)

    expect(newResponse.body).toHaveLength(initialNotes.length - 1)
  })

  test('Delete with invalid ID ', async () => {
    await api
      .delete(`/api/notes/invalidID`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response } = await getAllNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('PUT method', () => {
  test('should return a note with new info', async () => {
    const noteWithNewContent = {
      content: 'This is a new content',
    }
    const { response: firstResponse } = await getAllNotes()
    const [noteToUpdate] = firstResponse.body
    const { id } = noteToUpdate

    await api
      .put(`/api/notes/${id}`)
      .send(noteWithNewContent)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: newResponse, contents } = await getAllNotes()

    expect(contents).toContain(noteWithNewContent.content)

    expect(newResponse.body).toHaveLength(initialNotes.length)
  })

  test('Edit with invalid ID', async () => {
    const noteWithNewContent = {
      content: 'this note has a wrong id',
    }

    await api
      .put(`/api/notes/wrongId`)
      .send(noteWithNewContent)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response } = await getAllNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('Edit the second note without content', async () => {
    const { response: firstResponse } = await getAllNotes()
    const [noteToUpdate] = firstResponse.body
    const { id } = noteToUpdate

    await api
      .put(`/api/notes/${id}`)
      .send()
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { response } = await getAllNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
