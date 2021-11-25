const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const userExtractor = (request, response, next) => {
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    response
      .status(400)
      .json({
        error: 'token missing or invalid',
      })
      .end()
    return
  }

  const { id } = decodedToken
  request.userId = id
  next()
}

module.exports = userExtractor
