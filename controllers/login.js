const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordIsCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordIsCorrect)) {
    response.status(401).send({ error: 'invalid username or password' })
    return
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).json({
    username: user.username,
    name: user.name,
    token,
  })
})

module.exports = loginRouter
