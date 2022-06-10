import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  lang: String,
  role: String,
  img: String,
  email: String
})

const User = mongoose.model('user', userSchema)

export default User