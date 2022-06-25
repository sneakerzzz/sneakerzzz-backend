import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  sessionID: String,
  userID: String
},
  {
    timestamps: true
  }
)

const Session = mongoose.model('session', SessionSchema)

export default Session