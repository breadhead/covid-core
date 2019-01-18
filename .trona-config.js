const { createConnection } = require('mysql')

try {
  require('dotenv').config()
} catch (e) {
  console.log('PRODUCTION!')
}

const con = createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

con.connect(err => {
  if (err) {
    console.log('Failed!')
    throw err
  }

  console.log('Connected!')
})

module.exports = {
  evolutionsFolderPath: ['evolutions'],
  runQuery: query =>
    new Promise((resolve, reject) => {
      con.query(query, (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    }),
}
