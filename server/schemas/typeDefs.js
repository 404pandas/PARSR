const { gql } = require("apollo-server-express");

// Future development //
//
// Change animalType from string to enum AllowedType //
// enum AllowedType {
//   DOG
//   CAT
//   PENGUIN
//   HORSE
// }
// Query for AllowedType //
//
// type Query {
// animalType: AllowedType
// }
//
// Add "isMissing" boolean option //
// Query defines entry points for read operations
// Mutation defines entry points for write operations

// savedPets is a virtual

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    pets: [Pet]
    savedPets: [Pet]
  }

  type Pet {
    _id: ID!
    petName: String!
    animalType: String!
    description: String!
    microchipRegistry: String
    microchipNumber: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    pets: [Pet]
    pet(petId: ID!): Pet
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String!, email: String!, password: String!): User
    addPet(
      petId: ID!
      petName: String!
      animalType: String!
      description: String!
      microchipRegistry: String
      microchipNumber: Int
    ): Pet
    updatePet(
      petId: ID!
      petname: String!
      animalType: String!
      description: String!
      microchipRegistry: String
      microchipNumber: Int
    ): Pet
    removePet(petId: ID!): Pet
  }
`;

module.exports = typeDefs;
