const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// connect to Atlas
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('error in connect', { err })
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
