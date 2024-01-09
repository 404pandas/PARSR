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
    // markers by pet
    markersByPet: async (parent, { petId }) => {
      const params = petId ? { petId } : {};
      try {
        const markers = await Pet.find(params).populate("markers");
        console.log(markers);

        return markers;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // all posts
    posts: async () => {
      return Post.find().sort({ createdAt: -1 });
    },
    // single marker
    post: async (parent, { postId }) => {
      return Post.findOne({ _id: postId });
    },
    // posts by pet
    postsByPet: async (parent, args) => {
      try {
        const posts = await Post.find({ petId: args.petId })
          .populate("petId")
          .populate("createdBy");

        return posts;
      } catch (error) {
        throw new Error(error.message);
      }
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
        petId,
        markerName,
        markerDescription,
        createdAt,
        coordinates,
        image,
        geometry,
      },
      context
    ) => {
      if (context.user) {
        // Check if the petId exists and retrieve the corresponding pet
        const pet = Pet.findOne({ _id: petId });

        if (!pet) {
          throw new Error("Pet not found");
        }

        console.log(pet);

        const marker = await Marker.create({
          markerName,
          markerDescription,
          createdAt,
          coordinates,
          image,
          geometry,
          petId: pet.id,
          createdBy: context.user._id,
        });
        // Populate the createdBy field with the user data
        const populatedMarker = await Marker.findById(marker._id).populate(
          "createdBy",
          "petId"
        );

        // Return the created marker
        return populatedMarker;
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
    // create Pet
    createPet: async (
      parent,
      {
        petId,
        petName,
        description,
        microchipRegistry,
        microchipNumber,
        petOwner,
        petOwnerUsername,
        animalType,
        isMissing,
        geometry,
        image,
        markers,
        posts,
      },
      context
    ) => {
      if (context.user) {
        const pet = await Pet.create({
          petName,
          description,
          microchipRegistry,
          microchipNumber,
          petOwner: context.user._id,
          petOwnerUsername,
          animalType,
          isMissing,
          geometry,
          image,
          markers,
          posts,
        });

        // Return the created marker
        return petId;
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
    // Add a post to a pet
    addPost: async (_, { postContent, petId }, context) => {
      if (context.user) {
        const params = petId ? { petId } : {};
        const pet = Pet.findById(params);
        // Find the pet by ID
        console.log("petID" + pet);
        console.log("pet id: " + pet._id);
        const post = await Post.create({
          postContent,
          petId: pet._id,
          createdBy: context.user._id,
        });
        await Pet.findOneAndUpdate(
          { _id: pet._id },
          { $addToSet: { posts: post._id } }
        ).populate("petId");
        return post;
      }
      throw new AuthenticationError("Not logged in");
    },

    // Update a post on a pet
    updatePost: async (_, { postId, postContent }, context) => {
      if (context.user) {
        // Find the pet by ID
        const pet = await Pet.findById(postId);

        if (!pet) {
          throw new Error("Pet not found");
        }

        // Find the post within the pet's posts array
        const postToUpdate = pet.posts.find(
          (post) => post._id.toString() === postId
        );

        if (!postToUpdate) {
          throw new Error("Post not found");
        }

        // Update the post's content
        postToUpdate.content = postContent;

        await pet.save();

        return pet;
      }
      throw new AuthenticationError("Not logged in");
    },

    // Delete a post from a pet
    removePost: async (_, { postId, petId }, context) => {
      if (context.user) {
        return Pet.findOneAndUpdate(
          { _id: petId },
          {
            $pull: {
              posts: {
                _id: postId,
                createdBy: context.user._id,
              },
            },
          },
          { new: true }
        );
      } else {
        throw new AuthenticationError("Not logged in");
      }
    },
  },
};

module.exports = resolvers;
