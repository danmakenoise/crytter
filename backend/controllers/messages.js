const db = require('../models')
const Message = require('../models').Message
const Share = require('../models').Share

module.exports = {
  create (req, res) {
    if (!req.session.userId || !req.session.username) {
      console.warn(`Session cookie missing or incomplete`)
      return res.status(401).send({ error: 'Unauthorized' })
    }

    db.sequelize.transaction(async (transaction) => {
      try {
        const message = await Message.create({
          encryptedBody: req.body.message
        }, { transaction })

        await Share.create({
          messageId: message.id,
          senderId: req.session.userId,
          recipientId: req.body.recipientId,
          encryptedKey: 'encryptedKey'
        }, { transaction })

        res.status(200).send()
      } catch (err) {
        console.warn(err)
        res.status(400).send()
      }
    })
  }
}
