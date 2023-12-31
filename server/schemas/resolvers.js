const { AuthenticationError } = require("apollo-server-express");
const Pet = require("../models/Pet");
const User = require("../models/User");
const Marker = require("../models/Marker");
const { signToken } = require("../utils/auth");
const { GraphQLScalarType, Kind } = require("graphql");

// custom scalar for GeoJSON
const GeoJSONType = new GraphQLScalarType({
  name: "GeoJSON",
  description: "A GeoJSON object",
  parseValue(value) {
    return JSON.parse(value);
  },
  serialize(value) {
    return JSON.stringify(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      const value = {};
      ast.fields.forEach((field) => {
        value[field.name.value] = parseLiteral(field.value);
      });
      return value;
    }
    return null;
  },
});

// Cusotm Scalar for date
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    // Convert the input value (e.g., from a JSON payload) to a Date object
    return new Date(value);
  },
  serialize(value) {
    // Convert the Date object to a string for JSON serialization
    return value.toISOString();
  },
  parseLiteral(ast) {
    // Parse the date string from the GraphQL query into a Date object
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Creates the functions that fulfill the queries defined in typeDefs
const resolvers = {
  Query: {
    // Multiple users
    users: async () => {
      return User.find().populate("pets");
    },
    // user profile
    me: async (parent, args, context) => {
      if (context.user) {
        // Populate the pets subdocument on every instance of User
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate({
            path: "pets",
            populate: { path: "petOwner" }, // Populate petOwner
          });
        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //  Single user
    user: async (parent, { userId }) => {
      const user = await User.findOne({ _id: userId }).populate("pets");

      user.pets.sort((a, b) => b.petName - a.petName);

      return user;
    },
    // all pets
    pets: async (parent, { userId }) => {
      const params = userId ? { userId } : {};
      return Pet.find(params).sort({ petName: -1 });
    },
    // pets by missing === true
    petsByMissing: async (_, { isMissing }) => {
      try {
        // Query the database to find pets based on the isMissing parameter
        const pets = await Pet.find({ isMissing: true });
        return pets;
      } catch (error) {
        throw new Error("Failed to fetch pets by missing status");
      }
    },
    // single pet
    pet: async (parent, { petId }) => {
      return Pet.findOne({ _id: petId });
    },
    // all markers
    markers: async () => {
      return Marker.find().sort({ createdAt: -1 });
    },
    // single marker
    marker: async (parent, { markerId }) => {
      return Marker.findOne({ _id: markerId });
    },
  },
  // Defines the functions that will fulfill the mutations
  Mutation: {
    // login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    // add user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // create marker
    createMarker: async (
      parent,
      {
        markerName,
        markerDescription,
        createdAt,
        coordinates,
        image,
        geometry,
        petId,
      },
      context
    ) => {
      if (context.user) {
        const marker = await Marker.create({
          markerName,
          markerDescription,
          createdAt,
          coordinates,
          image,
          geometry,
          petId,
          createdBy: context.user._id,
        });

        // Add the marker to the pet's markers array
        const updatedPet = await Pet.findOneAndUpdate(
          { _id: petId },
          {
            $addToSet: { markers: marker._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        // Populate the createdBy field with the user data
        const populatedMarker = await Marker.findById(marker._id).populate(
          "createdBy"
        );
        console.log("after-" + marker);
        // Return the created marker
        return {
          success: true,
          marker: populatedMarker,
        };
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
  },
};

module.exports = resolvers;
