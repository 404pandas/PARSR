const sequelize = require("../config/connection");
const { User, Pet, Marker, Post } = require("../models");

const petSeeds = require("./petSeeds.json");
const userSeeds = require("./userSeeds.json");
const markerSeeds = require("./markerSeeds.json");
const postSeeds = require("./postSeeds.json");

const seedDatabase = async () => {
    // Initialize Database
    await sequelize.sync({ force: true });

    // Seed Users
    const users = await User.bulkCreate(userSeeds, {
        individualHooks: true,
        returning: true,
    });

    // Seed Pets
    const pets = await Pet.bulkCreate(
        petSeeds.map((pet) => ({
            ...pet,
            petOwner: users[Math.floor(Math.random() * users.length)].id,
        })),
        {
            returning: true,
        }
    );

    // Seed Markers
    const markers = await Marker.bulkCreate(
        markerSeeds.map((marker) => ({
            ...marker,
            petId: pets[Math.floor(Math.random() * pets.length)].id,
            createdBy: users[Math.floor(Math.random() * users.length)].id,
        })),
        {
            returning: true,
        }
    );

    // Seed Posts
    const posts = await Post.bulkCreate(
        postSeeds.map((post) => ({
            ...post,
            createdBy: users[Math.floor(Math.random() * users.length)].id,
        })),
        {
            returning: true,
        }
    );

    process.exit(0);
};

seedDatabase();
