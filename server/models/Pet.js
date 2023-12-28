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
    geometry: {
      type: {
        type: String,
        enum: ["Point", "Polygon", "LineString", "GeometryCollection"], // Define supported geometry types
      },
      coordinates: {
        type: [[Number]], // Array of coordinates for the geometry
      },
    },
    geometryCollection: {
      type: {
        type: String,
        enum: ["GeometryCollection"], // Define supported geometry types (only GeometryCollection in this case)
      },
      geometries: [
        {
          type: {
            type: String,
            enum: ["Point", "Polygon", "LineString"], // Define supported geometry types within the collection
          },
          coordinates: {
            type: [[Number]], // Array of coordinates for the geometry
          },
        },
      ],
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
