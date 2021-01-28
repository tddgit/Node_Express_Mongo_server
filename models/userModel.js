const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name , email, photo , password

const userSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
    minlength: 1,
    maxlength: 30,
    required: [true, 'User needs to have a username'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User needs to have a email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    minlength: 7,
    required: [true, 'User needs to have a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm a password'],
    validate: {
      //This only works on CREATE and  SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same ',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// userSchema.methods.correctPassword = function (
//   candidatePassword,
//   userPassword
// ) {
//   return bcrypt.compare(candidatePassword, userPassword);
// };

const User = mongoose.model('User', userSchema);
module.exports = User;
