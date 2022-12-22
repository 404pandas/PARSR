const express = require('express');

// Imports the ApolloServer class
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const dotenv = require("dotenv");

const path = require('path');
// const { authMiddleware } = require('./utils/auth');
const dotenv = require('dotenv')

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  context,
  context: authMiddleware,
  cache: "bounded",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

// Prints in the browser
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Creates a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API Server is running on port ${PORT}!`);
      console.log(`Navigate to GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Calls the async function to start the server
startApolloServer(typeDefs, resolvers);
