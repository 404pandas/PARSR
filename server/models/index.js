const User = require("./User");
const Pet = require("./Pet");
const Marker = require("./Marker");
const Post = require("./Post");

Pet.belongsTo(User, {foreignKey: "ownerID"});
User.hasMany(Pet, {foreignKey: "ownerID"});

Marker.belongsTo(Pet, {foreignKey: "petID"});
Pet.hasMany(Marker, {foreignKey: "petID"});

Marker.belongsTo(User, {foreignKey: "createdBy"});
User.hasMany(Marker, {foreignKey: "createdBy"})

Post.belongsTo(User, {foreignKey: "createdBy"});
User.hasMany(Post, {foreignKey: "createdBy"});

module.exports = { User, Pet, Marker, Post };


