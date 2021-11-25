const api = require('../generic-helper')
const User = require('../../models/User')

const getAllUsers = async () => {
  const usersFromDB = await User.find({})
  const users = usersFromDB.map((user) => user.toJSON())
  return users
}

module.exports = { api, getAllUsers }
