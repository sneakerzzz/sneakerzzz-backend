import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  lang: String,
  role: String,
  img: String
})

const User = mongoose.model('user', userSchema)

export default User