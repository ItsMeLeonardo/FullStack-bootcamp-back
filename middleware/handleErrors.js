const handleErrors = (error, request, response, next) => {
  console.error(error)

  const errorName = error.name

  switch (errorName) {
    case 'CastError':
      return response.status(400).send({ error: 'incorrect mongo id' })

    case 'ValidationError':
      return response.status(400).send({ error: error.message })
    default:
      return response.status(500).send({ error: 'internal Error' })
  }
}

module.exports = handleErrors
