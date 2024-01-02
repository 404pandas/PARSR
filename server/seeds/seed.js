const db = require("../config/connection");
const { User, Pet, Marker, Post } = require("../models");
const petSeeds = require("./petSeeds.json");
const userSeeds = require("./userSeeds.json");
const markerSeeds = require("./markerSeeds.json");
const postSeeds = require("./postSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Marker.deleteMany({});
    await Post.deleteMany({});
    // console.log(Post);
    // Create Users
    await User.create(userSeeds);

    // Create pets and add them to users
    const petIds = []; // Array to store pet _id values

    const userIds = [];

    const getRandomUserId = () => {
      let randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      return randomUserId;
    };
    const getRandomPetId = () => {
      let randomPetId = petIds[Math.floor(Math.random() * petIds.length)];
      return randomPetId;
    };

    // Create pets and add them to users
    for (const petData of petSeeds) {
      // Find the user by username or another unique identifier
      const user = await User.findOne({ username: petData.petOwnerUsername });

      if (!user) {
        console.log(
          `User with username ${petData.petOwnerUsername} not found.`
        );
        continue; // Skip creating this pet
      }

      const pet = new Pet({
        petName: petData.petName,
        animalType: petData.animalType,
        description: petData.description,
        microchipRegistry: petData.microchipRegistry,
        microchipNumber: petData.microchipNumber,
        petOwner: user._id, // Use the user's _id
        petOwnerUsername: user.username, // Use the user's username
        isMissing: petData.isMissing || false,
        geometry: petData.geometry || null,
        image: petData.image,
        markers: [],
        posts: [],
      });

      await pet.save();

      petIds.push(pet._id.toString()); // Store the pet _id in the array

      // Add the pet to the user's pets array
      user.pets.push(pet);
      await user.save();
      // console.log(user._id);
      userIds.push(user._id.toString()); // Store the user _id in the array
    }
    // console.log(userIds);

    for (let i = 0; i < petSeeds.length; i++) {
      // console.log(getRandomUserId());
      const { _id } = await Marker.create(markerSeeds[i]);
      // console.log(_id);
      await Pet.findOneAndUpdate(
        { _id: getRandomPetId() },
        {
          $addToSet: {
            markers: _id,
          },
        }
      );
    }

    for (let i = 0; i < petSeeds.length; i++) {
      // console.log(getRandomUserId());
      const { _id } = await Post.create(postSeeds[i]);
      // console.log(_id);
      await Pet.findOneAndUpdate(
        { _id: getRandomPetId() },
        {
          $addToSet: {
            posts: _id,
          },
        }
      );
    }
  } catch (err) {
    console.log("An error occurred:");
    console.error(err);
    process.exit(1);
  }

  console.log("Finished seeding");
  process.exit(0);
});
