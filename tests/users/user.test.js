const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('../../models/User')
const { server } = require('../../index')
const { api, getAllUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })

    await user.save()
  })

  test('should create a new user ', async () => {
    const usersAtStart = await getAllUsers()
    const newUser = {
      username: 'other',
      name: 'other',
      password: 'other',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)

    expect(usernames).toContain(newUser.username)
  })

  test('When it is create an user with username that already exist in DB ', async () => {
    const usersAtStart = await getAllUsers()
    const newUser = {
      username: usersAtStart[0].username,
      name: 'already exist',
      password: 'already exist',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(`'${newUser.username}' already taken`)

    const usersAtEnd = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
