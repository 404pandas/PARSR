const { AuthenticationError } = require("apollo-server-express");
const Pet = require("../models/Pet");
const User = require("../models/User");
const { signToken } = require("../utils/auth");
const { GraphQLScalarType, Kind } = require("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");

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
    // single pet
    pet: async (parent, { petId }) => {
      return Pet.findOne({ _id: petId });
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
    // add pet
    addPet: async (
      parent,
      {
        petName,
        animalType,
        description,
        microchipRegistry,
        microchipNumber,
        isMissing,
        geometry,
        geometryCollection,
      },
      { user }
    ) => {
      console.log("user object" + JSON.stringify(user));
      if (user) {
        const addedPet = new Pet({
          petName,
          animalType,
          description,
          microchipRegistry,
          microchipNumber,
          isMissing,
          petOwner: user._id,
          petOwnerUsername: user.username,
          geometry,
          geometryCollection,
        });
        await addedPet.save();
        await User.findOneAndUpdate(
          { _id: user._id },
          { $push: { pets: addedPet._id } }
        );
        return addedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
    // update pet
    updatePet: async (
      parent,
      {
        _id,
        petName,
        animalType,
        description,
        microchipRegistry,
        microchipNumber,
        isMissing,
      },
      context
    ) => {
      if (context.user) {
        const updateFields = {
          petName,
          animalType,
          description,
          microchipRegistry,
          microchipNumber,
          isMissing,
        };

        const updatedPet = await Pet.findOneAndUpdate(
          {
            _id,
            petOwner: context.user._id,
          },
          updateFields,
          { new: true }
        );

        if (!updatedPet) {
          throw new AuthenticationError(
            "You can't update this pet as you are not its owner!"
          );
        }

        return updatedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
    // remove pet
    removePet: async (parent, { petId }, context) => {
      if (context.user) {
        const removedPet = await Pet.findOne({
          _id: petId,
          petOwner: context.user._id,
        });

        if (!removedPet) {
          throw new AuthenticationError(
            "You can't remove this pet as you are not its owner!"
          );
        }

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { pets: removedPet._id } }
        );
        await Pet.deleteOne({ _id: removedPet._id });

        return removedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  GeoJSON: GeoJSONType,
};

module.exports = resolvers;
