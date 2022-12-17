Using a Schema Definition Language (SDL)-
You can programmatically create a schema using language constructs
SDL = more declarative
Use SDL to create schemas
parts of a schema-
types = construct defining a shape with fields
fields = keys on a type that have a name and a value type
scalars = primitive value type built into GraphQL
-String
-Int
-Float (decimal based numbers)
-Boolean (true or false)
-ID (String but used as a unique identifier)
query = type that defines how clients can access data
mutation = type that defines how clients can modify or create data
Schemas at a minimum require a query

typeDefs
const typeDefs = gql`
type <type> {
    <field>: <scalar>!
    <field>: <scalar>
    <field>: [<type>]

}
`
example:
const typeDefs = gql`
type User {
    email: String!
    friends: [User!]!
    pets: [Pet]!
    
}

! at the end indicates required values (graphQL will break if these values become null)
[ ] indicates the field is an array of a type
Example: pets: [Pet]! indicates that pets is an array of pet
! outside an array [<type>]! indicates that the field will always be an array of a type
Example: friends: [User!]! 
! within a required array [<type>!]! indicates the array will always be an array and always be an array of a type
queries

const typeDefs = gql`
type <type> {
    <field>: <scalar>!
    <field>: <scalar>
    <field>: [<type>]

}