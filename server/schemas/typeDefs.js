const { gql } = require('apollo-server-express');

    // Defines User fields and data type for each field
    // Acceptable data types - String, Int, Float, Boolean, and ID
    // Adding ! at the end of a datatype means the field is required
    // Relationship between user and pet. ! in square bracket means returned
    // pet list can't include items that are null
    // Defines pet as a type
    // Defines Pet fields and data type for each field
    // Relationship between pet and user
  // 
  // enum AllowedType {
  //   DOG
  //   CAT
  //   PENGUIN
  //   HORSE
  // }
// Defines user as a type
  // Defines entry points for read operations
      // Field that will return an array of User instances
      // Gets user info from userId
    // Gets pets from userId
     // Field that will return an array of Pet instances
      // query for AllowedType
    // animalType: AllowedType
    // Defines entry points for write operations
    // Accepts arguments defined by schema and returns newly created pet
    // Accepts arguments defined by schema and returns deleted pet

      const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String!
    pets: [Pet!]
  }

  type Pet {
    _id: ID!
    petName: String!
    animalType: String!
    description: String!
    microchipRegistry: String
    microchipNumber: Int
    isMissing: Boolean!
    user: User!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    pets: [Pet!] 
    pet(petId: ID!): Pet
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addPet(petId: ID!, name: String!, type: String!, description: String!, microchipRegistry: String, microchipNumber: Int): Pet
    removePet(petId: ID!): Pet
  }
`;

module.exports = typeDefs;
