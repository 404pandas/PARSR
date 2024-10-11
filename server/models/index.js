const User = require("./User");
const Pet = require("./Pet");
const Marker = require("./Marker");
const Post = require("./Post");

// Marker associations
Marker.belongsTo(Pet, { foreignKey: "pet_id" });
Pet.hasMany(Marker, { foreignKey: "pet_id" });

Marker.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Marker, { foreignKey: "created_by" });

// Post associations
Post.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Post, { foreignKey: "created_by" });

// Pet associations
Pet.belongsTo(User, { foreignKey: "owner_id" });
User.hasMany(Pet, { foreignKey: "owner_id" });

module.exports = { User, Pet, Marker, Post };
