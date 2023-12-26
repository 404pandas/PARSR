const { AuthenticationError } = require("apollo-server-express");
const { User, Pet } = require("../models");
const { signToken } = require("../utils/auth");

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
          .populate("pets");

        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //  Single user
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
          .select("-__v -password")
          .populate("pets");

        user.pets.sort((a, b) => b.petName - a.petName);

        return user;
      }

      throw new AuthenticationError("Not logged in");
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
    // animal type
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
      },
      context
    ) => {
      if (context.user) {
        const addedPet = await Pet.create({
          petName,
          animalType,
          description,
          microchipRegistry,
          microchipNumber,
          isMissing,
          petOwner: context.user.username,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { pets: addedPet._id } }
        );
        return addedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
    // update pet
    updatePet: async (
      parent,
      {
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
        const updatedPet = await Pet.findOneAndUpdate({
          petName,
          animalType,
          description,
          microchipRegistry,
          microchipNumber,
          isMissing,
          petOwner: context.user.username,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { pets: updatedPet._id } },
          { new: true }
        );

        return updatedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
    // remove pet
    removePet: async (parent, { petId }, context) => {
      if (context.user) {
        const removedPet = await Pet.findOneAndUpdate({
          _id: petId,
          petOwner: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { pets: removedPet._id } }
        );

        return removedPet;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};

module.exports = resolvers;
