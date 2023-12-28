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
    microchipNumber: String
    petOwner: User
    petOwnerUsername: String
    animalType: AnimalType
    isMissing: Boolean
    geometry: GeoJSON
    
  }

  type Auth {
    token: ID!
    user: User
  }

  scalar GeoJSON
  scalar GeometryCollection


  input AddPetInput {
    petName: String
    animalType: AnimalType
    description: String
    microchipRegistry: String
    microchipNumber: String
    petOwner: String
    petOwnerUsername: String
    isMissing: Boolean
  }

  input UpdatePetInput {
    petName: String
    animalType: AnimalType
    description: String
    microchipRegistry: String
    microchipNumber: String
    isMissing: Boolean
  }

  input GeoJSONInput {
    type: String!
    coordinates: [Float]!
  }

  type GeometryCollectionFeature {
    type: String!
    geometries: [GeoJSON]
  }

  input GeometryCollectionInput {
    type: String!
    geometries: [GeoJSONInput]
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
    addPet(petName: String, animalType: AnimalType, description: String, microchipRegistry: String, microchipNumber: String, isMissing: Boolean, geometry: GeoJSONInput, geometryCollection: GeometryCollectionInput
  ): Pet
    updatePet(_id: ID, petName: String, animalType: String, description: String, microchipRegistry: String, microchipNumber: String, isMissing: Boolean): Pet
    removePet(petId: ID!): Pet
  }
`;

module.exports = typeDefs;
