const typeDefs = `

  scalar GeoJSON
  scalar Date

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
    image: String
    markers: [Marker]
  }

  type Marker {
    _id: ID
    markerName: String
    markerDescription: String
    createdAt: Date
    createdBy: User
    coordinates: [Float]
    image: String
    geometry: GeoJSON
  }

  type Auth {
    token: ID!
    user: User
  }


  input MarkerData {
    markerName: String!
    markerDescription: String
    createdAt: Date
    coordinates: [Float]
    image: String
    geometry: GeoJSON
    petId: ID!
  }

  input PetData {
    id: Int!
    petName: String
    markers: [MarkerData]
  }

  type markerResponse {
    success: Boolean
    marker: Marker
  }

  type petResponse {
    success: Boolean
    pet: Pet
  }

  enum AnimalType {
    DOG
    CAT
    BIRD
    FERRET
    FISH
    FROG
    GP
    HAMSTER
    HEDGEHOG
    RABBIT
    SNAKE
    OTHER
  }

  type Query {
    users: [User]
    me: User
    user(userId: ID!): User
    pets: [Pet]
    petsByMissing(isMissing: Boolean!): [Pet]
    pet(petId: ID!): Pet
    markers: [Marker]
    marker(markerId: ID!): Marker
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    createMarker(marker: MarkerData): markerResponse
    createPet(pet: PetData): petResponse
  }
`;

module.exports = typeDefs;
