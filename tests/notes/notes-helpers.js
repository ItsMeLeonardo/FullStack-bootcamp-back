const api = require('../generic-helper')

const rootId = '619ed3fb66d61bb541baa701'

const initialNotes = [
  {
    content: 'HTML is easy test',
    important: false,
    date: new Date(),
    user: rootId,
  },
  {
    content: 'Mongo is difficult :c',
    important: true,
    date: new Date(),
    user: rootId,
  },
]

const getAllNotes = async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map((note) => note.content)
  return { response, contents }
}

module.exports = { initialNotes, api, getAllNotes }
