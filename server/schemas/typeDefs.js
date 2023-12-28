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

const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    pets: [Pet]
  }

  type Pet {
    _id: ID
    petName: String
    description: String
    microchipRegistry: String
    microchipNumber: Int
    petOwner: User
    petOwnerUsername: String
    animalType: AnimalType
    isMissing: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  input AddPetInput {
    petName: String
    animalType: String
    description: String
    microchipRegistry: String
    microchipNumber: Int
    petOwner: String
    petOwnerUsername: String
    isMissing: Boolean
  }

  input UpdatePetInput {
    petName: String
    animalType: AnimalType
    description: String
    microchipRegistry: String
    microchipNumber: Int
    isMissing: Boolean
  }

  enum AnimalType {
    DOG
    CAT
    OTHER
  }

  type Query {
    users: [User]
    me: User
    user(userId: ID!): User
    pets: [Pet]
    pet(petId: ID!): Pet
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addPet(petName: String, animalType: String, description: String, microchipRegistry: String, microchipNumber: Int, isMissing: Boolean): Pet
    updatePet(_id: ID, petName: String, animalType: String, description: String, microchipRegistry: String, microchipNumber: Int, isMissing: Boolean): Pet
    removePet(petId: ID!): Pet
  }
`;

module.exports = typeDefs;
