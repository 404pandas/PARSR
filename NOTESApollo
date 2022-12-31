Apollo Client encapsulates HTTP logic used ti interact with a GraphQL QP
Don't have to set up fetch, ajax, etc
Doubles as a client side state management alternative
(replaces Redux)
Stores state for data back from server and also stores state that's created locally on client
Offers a plug approach for extending GraphQL API capabilities
Framework independent, doesn't need React, GraphQL, etc

How to switch from Redux to GraphQL?
Use Apollo's cache for only data that came back from GraphQL API but used Redux for any local state

Storing data from API
All nodes are stored flat by unique ID
Unique IDs are defaulted as .id or ._id from nodes. Editable
Every node should send an .id or ._id, or none at all. (All or nothing logic) Othewise, have to customize the logic to generate a unique ID to store things
__typname is assigned by default

Apollo client API queries


Creating apollo client:

const link = new HttpLink({uri: ''})

Every graphql request comes back as data field

There are sibling fields like error and loading

pets "page"
// Hook that react applies
import React, {useState} from 'react'
import PetCard from '../components/PetCard'
import NewPet from '../components/NewPet'
// Hooks that Apollo created to interact with GraphQL
import { useQuery, useMutation } from '@apollo/react-hooks'
import Loader from '../components/Loader'

const ALL_PETS = gql`
  query AllPets {
    pets {
      id
      name
      type
      img
    }
  }
`

export default function Pets () {
  // UseState will always return an array
  // first argument will be the state trying to keep track of
  // second argument is always a function used to update the state
  // By default, sets modal to false
  // Now have a function called setModal that can take an 
  // argument that will set modal to whatever I want
  const [modal, setModal] = useState(false)
  // useQuery happens asynchronously in the background.
  // Once this promise is resolved and there is no error,
  // data gets set, which causes the data property to be
  // updated with correct data and causes a rerender the
  // entire component.
    const { data, loading, error } = useQuery(ALL_PETS
    )
    // Adding whatever: pets {
    // ...
    // }
    // }
    // allows use of data.whatever.pets.id


  const onSubmit = input => {
    setModal(false)
  }
  // Use case for if the component is loading
  if (loading) {
    // Returns Loader component if loading
    return <Loader />
  }

  // Use case for if there is an error
  if (error) {
    return <p>error</p>
  }
  
  if (modal) {
    return (
      <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)}/>
    )
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <div className="row">
          <PetsList pets={data.pets}/>
        </div>
      </section>
    </div>
  )
}

client side app.js:

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
// Templte tag that allows writing of graphQL queries inside a
// template string that gets interpolated into something that Apollo
// client can understand to issue the query
import gql from 'graphql-tag'

// Network interface to access a graphQL server. Points to server
// Can use public API uri or localhost
const link = new HttpLink({uri: 'http://localhost:4000'})
// Interface anyone can extend with setter, getter, delete
// Can turn it into local storage, Index.db cache
const cache = new InMemoryCache()
// Initializes client for Apollo Playground
// Caches results in apollo's InMemoryCache
const client = new ApolloClient({
    link,
    cache
})

// Query
// Brackets indicate shorthand method of a Query will be passed
// const query = gql`
// {

// }
// `

// Console logs the result of the Query
// app.query({query})
// .then(results => console.log(result))

export default app