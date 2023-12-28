const { Schema, model } = require("mongoose");

const petSchema = new Schema(
  {
    petName: {
      type: String,
      minlength: 1,
      maxlength: 280,
      trim: true,
      required: true,
    },
    animalType: {
      type: String,
      enum: ["DOG", "CAT", "OTHER"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    microchipRegistry: {
      type: String,
      required: true,
    },
    microchipNumber: {
      type: String,
      required: true,
    },
    petOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    petOwnerUsername: {
      type: String,
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
