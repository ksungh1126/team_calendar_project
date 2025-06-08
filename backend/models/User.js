// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // ✅ 친구 목록 (이메일 리스트)
  friends: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);