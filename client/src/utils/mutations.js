import { gql } from "@apollo/client";

// Mutation for login
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation for adding a user
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation for adding a pet
export const ADD_PET = gql`
  mutation addPet(
    $petName: String
    $animalType: AnimalType
    $description: String
    $microchipRegistry: String
    $microchipNumber: Int
    $isMissing: Boolean
  ) {
    addPet(
      petName: $petName
      animalType: $animalType
      description: $description
      microchipRegistry: $microchipRegistry
      microchipNumber: $microchipNumber
      isMissing: $isMissing
    ) {
      _id
      petName
      description
      microchipRegistry
      microchipNumber
      petOwner {
        _id
        username
      }
      animalType
      isMissing
    }
  }
`;

// Mutation for updating a pet
export const UPDATE_PET = gql`
  mutation updatePet(
    $id: ID
    $petName: String
    $animalType: String
    $description: String
    $microchipRegistry: String
    $microchipNumber: Int
    $isMissing: Boolean
  ) {
    updatePet(
      _id: $id
      petName: $petName
      animalType: $animalType
      description: $description
      microchipRegistry: $microchipRegistry
      microchipNumber: $microchipNumber
      isMissing: $isMissing
    ) {
      animalType
      _id
      description
      isMissing
      microchipNumber
      microchipRegistry
      petName
      petOwner {
        email
        username
        _id
      }
    }
  }
`;

// Mutation for removing a pet
export const REMOVE_PET = gql`
  mutation removePet($petId: ID!) {
    removePet(petId: $petId) {
      _id
      petName
      description
      microchipRegistry
      microchipNumber
      petOwner {
        _id
        username
      }
      animalType
      isMissing
    }
  }
`;
