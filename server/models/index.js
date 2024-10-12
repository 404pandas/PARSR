const User = require("./User");
const Pet = require("./Pet");
const Marker = require("./Marker");
const Post = require("./Post");

// Pet associations
User.hasMany(Pet, { foreignKey: "owner_id", as: "pets" });
Pet.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// Marker associations
User.hasMany(Marker, { foreignKey: "created_by" });
Pet.hasMany(Marker, { foreignKey: "pet_id" });
Marker.belongsTo(User, { foreignKey: "created_by" });
Marker.belongsTo(Pet, { foreignKey: "pet_id" });

// Post associations
User.hasMany(Post, { foreignKey: "created_by" });
Post.belongsTo(User, { foreignKey: "created_by" });

module.exports = { User, Pet, Marker, Post };
