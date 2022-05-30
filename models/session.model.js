import mongoose from 'mongoose'

const SessionSchema = mongoose.Schema({
  sessionID: String,
  userID: String,
  createdAt: Date,
})

const Session = mongoose.model('session', SessionSchema)

export default Session