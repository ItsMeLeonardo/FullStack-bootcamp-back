const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const User = require('../models/User')

// TODO: add more validations
usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { password, username, name } = body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    passwordHash,
    username,
    name,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).send({ error: error.errors.username.message })
  }
})

module.exports = usersRouter
