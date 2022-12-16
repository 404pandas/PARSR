const { AuthenticationError } = require('apollo-server-express');
const { User, Pet } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    /// GETS MULTIPLE USERS ///
    //     users: [User]
    users: async () => {
      return User.find().populate('pets');
    },
    /// GETS ONE USER ///
    //     user(userId: ID!): User
    user: async (parent, { userId }, context) => {
      if (context.user) {
        const user = await (await User.findOne({ _id: userId }).select('-__v -password'));

        return user;
      }

      // throw new AuthenticationError('Not logged in');
    },
    // Field that will return an array of Pet instances
    // pets: [Pet]
    pets: async (parent, { userId }, context) => {
      const params = userId ? { userId } : {};
      return Pet.find(params).sort({ createdAt: -1 });
    },
    // GETS PETS FROM USER ID
    // pet(petId: ID!): Pet
    pet: async (parent, { petId }, context) => {
      if (context.user) {
        const PetData = await (await Pet.findOne({ _id: petId }));

        return PetData;
      }

      throw new AuthenticationError('Not logged in');
    },
    // GETS PERSONAL PETS
    // me: User
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('pets');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }, 
    // query for AllowedType
    // animalType: AllowedType
    // animalType: async () => { }

  Mutation: {

    /// LOGIN ///
    //     login(email: String!, password: String!): Auth
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
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
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
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
