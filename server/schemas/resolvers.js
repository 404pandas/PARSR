const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    /// GETS MULTIPLE USERS' PETS ///
    //     users: [User]
    users: async () => {
      return User.find().populate('pets');
    },
    /// GETS ONE USER ///
    //     user(userId: ID!): User
    user: async (parent, { userId }, context) => {
      if (context.user) {
        const userData = await (await User.findOne({ _id: userId }).select('-__v -password'));

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    // Field that will return an array of Pet instances
    // pets: [Pet]
    pets: async () => {
      return Pet.find({});
    },
    // GETS PETS FROM USER ID
    // pets(userId: ID!): [Pet]
    pet: async (parent, { petId }, context) => {
      if (context.user) {
        const PetData = await (await Pet.findOne({ _id: PetId }).select('-__v -password'));

        return PetData;
      }

      throw new AuthenticationError('Not logged in');
    },
 
    // query for AllowedType
    // animalType: AllowedType
    animalType: async () => {

    }
  },

  Mutation: {

    /// LOGIN ///
    //     login(email: String!, password: String!): Auth
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    /// ADD USER ///
    //    addUser(username: String!, email: String!, password: String!): Auth
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // addPet(petId: ID!, name: String!, type: String!, description: String!, microchipRegistry: String,
    //  microchipNumber: Int): Pet
    // addPet: async (parent, args) => {
    //   const 
    // },
    //     removePet(petId: ID!): Pet
    removePet: async (parent, args) => {

    },
  }
};

module.exports = resolvers;
