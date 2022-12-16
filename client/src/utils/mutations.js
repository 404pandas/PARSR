import { gql } from "@apollo/client";

//   type Mutation {
//   login(email: String!, password: String!): Auth
//   addUser(username: String!, email: String!, password: String!): Auth
//   addPet(petId: ID!, petName: String!, animalType: String!, description: String!, microchipRegistry: String, microchipNumber: Int): Pet
//   removePet(petId: ID!): Pet
// }

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_PET = gql`
  mutation addPet($petId: String!) {
    addPet(petId: $petId)
    _id
    petName
    animalType
    description
    microchipRegistry
    microchipNumber
    }
`;

// export const REMOVE_PET = gql`
//   mutation removePet($petId: ID!) {
//     updatePet(petId: #petId)
//     }
//   }
