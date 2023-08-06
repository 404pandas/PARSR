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
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/UserDashboard";
import ViewPets from "./pages/ViewPets";
import About from "./pages/About";

/// IMPORT COMPONENTS ///
import ProtectRoute from "./components/ProtectRoute";
import { PasswordReset } from "./pages/PasswordReset";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/view-pets' element={<ViewPets />} />
            <Route path='/about' element={<About />} />
            <Route path='/reset-password' element={<PasswordReset />} />
            <Route
              path='dashboard/:userId'
              element={Auth.loggedIn() ? <Dashboard /> : <ProtectRoute />}
            />
          </Routes>
          <Footer />
        </Router>
      </ApolloProvider>
    </>
  );
};

export default App;
