const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// // // Defines pet as a type
//   type Pet {
//     // Defines Pet fields and data type for each field
//     _id: ID!
//     name: String!
//     animalType: enum!
//     description: String!
//     microchipRegistry: String
//     microchipNumber: Int
//     isMissing: Boolean!
//     // Relationship between pet and user
//     user: User!
//   }

const petSchema = new Schema(
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

const Pet = model('Pet', petSchema);

module.exports = Pet;