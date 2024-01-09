const express = require("express");

const sequelize = require('./config/connection');
const app = express();
const port = process.env.PORT || 3001;

const routes = require('./controllers');
app.use(express.json());
app.use(routes);

sequelize.sync({force : false}).then(() => {
    app.listen(port, () => console.log(`Now Listening on Port : ${port}`));
})