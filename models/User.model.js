const { Schema, model } = require("mongoose");




const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true
  },
  password: {
  type: String,
  required: [true, 'Password is required.']
},
});


module.exports = model('User', userSchema);
