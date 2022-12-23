import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./utils/auth";

/// IMPORT PAGES ///
import Landing from "./pages/Landing/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";
import ViewPets from "./pages/ViewPets";

/// IMPORT COMPONENTS ///
import ProtectRoute from "./components/ProtectRoute";
import CssBaseline from "@mui/material/CssBaseline";
import useStyles from "./styles";

// Creates a hook called useStyles.
// It's equal to a function call called makeStyles
// Inside that function call, I pass in a call back function
// that returns an object that contains all the styles.
// Theme allows additional styling

// Network interface to access a graphQL server. Points to server
// Can use public API uri
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Sets auth link and returns headers
// according to id_token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initializes client for Apollo Playground
// Caches results in apollo's InMemoryCache
const client = new ApolloClient({
  // Adds authlink and httplink together
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {
  const classes = useStyles();

  return (
    <>
      <ApolloProvider client={client}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/view-pets" element={<ViewPets />} />
            <Route
              path="dashboard/:userId"
              element={Auth.loggedIn() ? <Dashboard /> : <ProtectRoute />}
            />
          </Routes>
        </Router>
      </ApolloProvider>
    </>
  );
};

export default App;
