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
    microchipNumber: Int
    petOwner: User
    petOwnerUsername: String
    animalType: AnimalType
    isMissing: Boolean
    geometry: GeoJSON
    image: String
    markers: [Marker]
    posts: [Post]
  }

  type Post {
    _id: ID
    postContent: String
    createdBy: User
    createdAt: Date
    petId: Pet
  }

  type Marker {
    _id: ID
    petId: Pet
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
    _id: ID!
    petName: String
    description: String
    microchipRegistry: String
    microchipNumber: Int  # Updated to Int
    animalType: AnimalType
    isMissing: Boolean
    geometry: GeoJSON
    image: String
  }

   input UpdatePetData {
    petName: String
    description: String
    microchipRegistry: String
    microchipNumber: Int
    animalType: AnimalType
    isMissing: Boolean
    geometry: GeoJSON
    image: String
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
    markersByPet(petId: ID!): [Marker]
    posts: [Post]
    post(postId: ID!): Post
    postsByPet(petId: ID!): [Post]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    createMarker(marker: MarkerData): Marker
    addPet(pet: PetData): Pet  
    updatePet(petId: ID!, petData: UpdatePetData!): Pet  
    removePet(petId: ID!): Pet  
    addPost(petId: ID!, postContent: String!): Post
    updatePost(postContent: String!): Post
    removePost(postId: ID!): Post
  }
`;

module.exports = typeDefs;
