const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

module.exports = api
