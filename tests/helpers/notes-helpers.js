const supertest = require('supertest')
const { app } = require('../../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy test',
    important: false,
    date: new Date(),
  },
  {
    content: 'Mongo is difficult :c',
    important: true,
    date: new Date(),
  },
]

const getAllNotes = async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map((note) => note.content)
  return { response, contents }
}

module.exports = { initialNotes, api, getAllNotes }
