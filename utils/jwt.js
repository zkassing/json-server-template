const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config.js')

const { secret, expiresIn } = jwtConfig

exports.sign = (data) => jwt.sign(data, secret, { expiresIn })

exports.verify = token => {
  return new Promise((resolve, reject) => {
    try {
      const data = jwt.verify(token, secret)
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}