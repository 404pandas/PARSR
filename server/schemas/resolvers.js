const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const Pet = require("../models/Pet");
const User = require("../models/User");
const Marker = require("../models/Marker");
const Post = require("../models/Post");
const { signToken } = require("../utils/auth");
const { GraphQLScalarType, Kind } = require("graphql");

// Custom scalar for GeoJSON
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

// Custom Scalar for Date
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert from integer timestamp
    }
    return null;
  },
});

const resolvers = {
  Query: {
    users: async () => {
      return User.findAll().populate("pets");
    },
    user: async (parent, args, context) => {
      const user = await User.findOne({
        where: {
          user_id: context.user.user_id,
        },
        include: [
          {
            model: Pet,
            as: "pets",
          },
        ],
      });
      user.pets.sort((a, b) => a.petName.localeCompare(b.petName));
      return user;
    },
    me: async (parent, args, context) => {
      console.log("Context User: ", context.user._id);
      if (context.user) {
        try {
          const user = await User.findByPk(context.user._id);
          console.log("User with pets: ", user);
          return user;
        } catch (error) {
          console.error("Error retrieving user data: ", error);
          throw new Error("Failed to retrieve user data");
        }
      }
      throw new AuthenticationError("Not logged in");
    },
    pets: async () => {
      const pet = await Pet.findAll();
      return pet;
    },
    pet: async (parent, { petId }) => {
      return Pet.findById(petId)
        .populate("petOwner")
        .populate("markers")
        .populate("posts");
    },
    petsByMissing: async (parent, { isMissing }, context) => {
      return await Pet.findAll({ where: { is_missing: isMissing } });
    },
    markers: async () => {
      return Marker.find().populate("petId").populate("createdBy");
    },
    marker: async (parent, { markerId }) => {
      return Marker.findById(markerId).populate("petId").populate("createdBy");
    },
    markersByPet: async (parent, { petId }) => {
      return Marker.findOne({ where: petId })
        .populate("petId")
        .populate("createdBy");
    },
    postsByPet: async (parent, { petId }) => {
      try {
        return await Post.findOne({ where: petId })
          .populate("petId")
          .populate("createdBy");
      } catch (error) {
        throw new Error(
          `Failed to fetch posts for pet ID ${petId}: ${error.message}`
        );
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AuthenticationError("No user found with this email address.");
      }

      // Call the correct method to check the password
      const correctPw = await User.beforeUpdate(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect password.");
      }

      // Sign the token with the user's _id
      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user.user_id,
      });
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      // Sign the token with the user's user
      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user.user_id,
      });
      return { token, user };
    },
    addPet: async (
      parent,
      {
        petName,
        description,
        microchipRegistry,
        microchipNumber,
        animalType,
        isMissing,
        geometry,
        image,
      },
      context
    ) => {
      if (context.user) {
        const pet = await Pet.create({
          petName,
          description,
          microchipRegistry,
          microchipNumber,
          petOwner: context.user.user_id,
          animalType,
          isMissing,
          geometry,
          image,
        });
        return pet;
      }
      throw new AuthenticationError("Not logged in");
    },
    updatePet: async (
      parent,
      {
        id,
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
        const pet = await Pet.findOneAndUpdate(
          { _id: id },
          {
            petName,
            animalType,
            description,
            microchipRegistry,
            microchipNumber,
            isMissing,
          },
          { new: true }
        );
        return pet;
      }
      throw new AuthenticationError("Not logged in");
    },
    removePet: async (parent, { petId }, context) => {
      if (context.user) {
        const pet = await Pet.findOneAndDelete({ _id: petId });
        return pet;
      }
      throw new AuthenticationError("Not logged in");
    },
    createMarker: async (parent, { marker }, context) => {
      if (context.user) {
        const newMarker = await Marker.create({
          ...marker,
          createdBy: context.user.user_id,
        });
        return newMarker;
      }
      throw new AuthenticationError("Not logged in");
    },
    addPost: async (parent, { petId, postContent }, context) => {
      if (context.user) {
        const post = await Post.create({
          petId,
          postContent,
          createdBy: context.user.user_id,
        });
        return post;
      }
      throw new AuthenticationError("Not logged in");
    },
    removePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findOneAndDelete({ _id: postId });
        return post;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  // Scalars
  GeoJSON: GeoJSONType,
  Date: DateScalar,
};

module.exports = resolvers;
