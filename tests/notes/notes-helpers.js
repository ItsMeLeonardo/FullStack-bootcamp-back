const api = require('../generic-helper')

const rootId = '619ed3fb66d61bb541baa701'
const tokenOfDefaultUser =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWZmZDdkNTExZjVmMWE0OTJkMzNjOCIsInVzZXJuYW1lIjoicm9vdCIsImlhdCI6MTYzNzg3NjgwNSwiZXhwIjoxNjM4NTU3MjA1fQ.yfep5Yf1MD0ZpH5jvk9ZDzW4-XaBAmUVpRLD1NQM-Lo'

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

module.exports = { initialNotes, getAllNotes, tokenOfDefaultUser }
