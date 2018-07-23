const app = require('../app')
const db = require('../models')

const PORT = process.env.PORT || 3001

db.sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`server listening on localhost:${PORT}`)
  })
})
