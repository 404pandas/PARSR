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
        geometry
        image
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
        animalType
        isMissing
        geometry
        image
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
        geometry
        image
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
      geometry
      image
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
      petOwnerUsername
      isMissing
      geometry
      image
      markers {
        _id
      }
      posts {
        _id
        createdBy {
          _id
          username
        }
        postContent
        createdAt
      }
    }
  }
`;

// Query for all missing pets
export const QUERY_MISSING_PETS = gql`
  query getMissingPets($isMissing: Boolean!) {
    petsByMissing(isMissing: $isMissing) {
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
      petOwnerUsername
      animalType
      isMissing
      geometry
      image
      posts {
        _id
        postContent
        createdBy {
          username
        }
        createdAt
        petId {
          _id
        }
      }
    }
  }
`;

// Query for all markers
export const QUERY_MARKERS = gql`
  query getMarkers {
    markers {
      _id
      markerName
      markerDescription
      createdAt
      createdBy {
        _id
        username
      }
      coordinates
      image
      geometry
      petId {
        _id
        petName
        microchipNumber
        petOwner {
          username
        }
      }
    }
  }
`;

// Query for single marker by ID
export const QUERY_MARKER_BY_ID = gql`
  query getMarker($markerId: ID!) {
    marker(markerId: $markerId) {
      _id
      petId {
        petName
      }
      markerName
      markerDescription
      createdAt
      createdBy {
        _id
        username
      }
      coordinates
      image
      geometry
    }
  }
`;

// Query for single marker by Pet ID
export const QUERY_MARKER_BY_PETID = gql`
  query getMarker($petId: ID!) {
    markersByPet(petId: $petId) {
      _id
      petId {
        petName
      }
      markerName
      markerDescription
      createdAt
      createdBy {
        _id
        username
      }
      coordinates
      image
      geometry
    }
  }
`;
