const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "default_secret"; // Use environment variable for secret
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    // Token sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If there's an authorization header, extract the token
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim(); // Get token part after 'Bearer '
    }

    console.log("token: ", token);

    if (!token) {
      return req; // No token provided, return request as is
    }

    // Verify token and add user data to req object
    try {
      const { data } = jwt.verify(token, secret); // Verify the token
      req.user = data; // Attach user data to request
    } catch (err) {
      console.log("Invalid token!", err); // Log error for debugging
    }

    return req; // Return the modified request object
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration }); // Sign the token
  },
};
