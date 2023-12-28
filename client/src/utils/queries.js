import { gql } from "@apollo/client";

// Query for multiple users
export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
      pets {
        _id
        petName
        description
        microchipRegistry
        microchipNumber
        animalType
        isMissing
      }
    }
  }
`;

// Query for personal profile
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      pets {
        _id
        petName
        description
        microchipRegistry
        microchipNumber
        petOwner {
          _id
          username
        }
        petOwnerUsername
        animalType
        isMissing
      }
    }
  }
`;

// Query for single user
export const QUERY_USER = gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
      pets {
        _id
        petName
        description
        microchipRegistry
        microchipNumber
        animalType
        isMissing
      }
    }
  }
`;
// Query for all pets
export const QUERY_PETS = gql`
  query getPets {
    pets {
      _id
      petName
      description
      microchipRegistry
      microchipNumber
      petOwner {
        _id
        username
        email
      }
      animalType
      isMissing
    }
  }
`;
// Query for single pet
export const QUERY_SINGLE_PET = gql`
  query getSinglePet($petId: ID!) {
    pet(petId: $petId) {
      _id
      petName
      description
      microchipRegistry
      microchipNumber
      petOwner {
        _id
        username
        email
      }
      animalType
      isMissing
    }
  }
`;
