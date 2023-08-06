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
      required: "You need to enter a pet name!",
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
    animalType: {
      type: String,
      required: "You need to select an animal type!",
      trim: true,
    },
    description: {
      type: String,
      required: "You need to add a physical description!",
    },
    microchipRegistry: {
      type: String,
    },
    microchipNumber: {
      type: Number,
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
