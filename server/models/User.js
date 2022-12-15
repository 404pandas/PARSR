const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// // // Defines user as a type
//   type User {
//     // Defines User fields and data type for each field
//     // Acceptable data types - String, Int, Float, Boolean, and ID
//     // Adding ! at the end of a datatype means the field is required
//     _id: ID!
//     username: String!
//     email: String!
//     // Relationship between user and pet. ! in square bracket means returned
//     // pet list can't include items that are null
//     pets: [Pet!]

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    pets: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
