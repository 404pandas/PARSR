const { Schema } = require("mongoose");

// Typedefs for pet
// type Pet {
//   _id: ID!
//   petName: String!
//   animalType: String!
//   description: String!
//   microchipRegistry: String
//   microchipNumber: Int
// }

// This is a subdocument schema, it won't become its own model but it
// is used as the schema for the User's `savedPets` array in User.js
const savedPetSchema = new Schema(
  {
    users: [
      {
        type: String,
      },
    ],
    petName: {
      type: String,
      required: true,
    },
    animalType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    microchipRegistry: {
      type: String,
    },
    microchipNumber: {
      type: Number,
    }
  });

module.exports = savedPetSchema;
