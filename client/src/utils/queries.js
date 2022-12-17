import { gql } from "@apollo/client";

//   type Query {
//   users: [User]
//   user(userId: ID!): User
//   pets: [Pet] 
//   pet(petId: ID!): Pet
//   me: User
// }

export const QUERY_PET = gql`
query pet($petName: String!) {
  pet(petName: $petName) {
    petName
  }
}`

export const QUERY_USER = gql`
query user($userId: ID!) {
  user(userId: $userId) {
    _id
    username
    email
    courseCount
    courses {
      _id
      courseName
      startDate
      endDate
      description
      instructor
    }
  }
}
`;

export const QUERY_COURSE = gql`
  query course($courseId: ID!) {
  course(courseId: $courseId) {
    _id
    courseName
    startDate
    endDate
    description
    instructor
    students {
      _id
      firstName
      lastName
      course
      grades {
        _id
        assignmentName
        grade
      }
    }
    studentCount
  }
}
`;
