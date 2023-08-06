const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Typedefs for user
// type User {
//   _id: ID!
//   username: String!
//   email: String!
//   pets: [Pet]
// }

// Import schema from Pet.js
const petSchema = require("./Pet");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    pets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    // FUTURE DEVELOPMENT
    // Sets savedPets as an array of data that adheres to the savedPetSchema
    // savedPets: [savedPetSchema],
  },
  // Sets this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hashes user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// When we query a user, we'll also get another field called `savedPetCount` with the number of saved pets they have
userSchema.virtual("savedPetCount").get(function () {
  return this.savedPets.length;
});

const User = model("User", userSchema);

module.exports = User;
