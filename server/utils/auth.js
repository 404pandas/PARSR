const jwt = require("jsonwebtoken");
require("dotenv").config();

// sets token secret and expiration date
const secret = process.env.JWT_SECRET || "thisissupersecret";
const expiration = "2h";

module.exports = {
  // Function for authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via req.body, req.query, or req.headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: "You have no token!" });
    }

    // verifies token and gets user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
      return res.status(400).json({ message: "invalid token!" });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
