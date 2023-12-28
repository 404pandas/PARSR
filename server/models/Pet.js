const { Schema, model } = require("mongoose");

// Typedefs for pet
// type Pet {
//   _id: ID!
//   petName: String!
//   animalType: String!
//   description: String!
//   microchipRegistry: String
//   microchipNumber: Int
// }

const petSchema = new Schema(
  {
    petName: {
      type: String,
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
    animalType: {
      type: String,
      enum: ["DOG", "CAT", "OTHER"],
    },
    description: {
      type: String,
    },
    microchipRegistry: {
      type: String,
    },
    microchipNumber: {
      type: Number,
    },
    petOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isMissing: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Pet = model("Pet", petSchema);

module.exports = Pet;
