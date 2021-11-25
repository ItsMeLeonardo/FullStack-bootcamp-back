const mongoose = require('mongoose')
const { server } = require('../../index')
const api = require('../generic-helper')

const { userToTestLogin } = require('./helper')

describe('should validate the login', () => {
  test('should return the jwt', async () => {
    await api
      .post('/api/login')
      .send(userToTestLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
