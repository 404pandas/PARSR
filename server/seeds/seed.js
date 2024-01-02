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
    // await Post.deleteMany({});

    // Create Users
    await User.create(userSeeds);

    // Create pets and add them to users
    const petIds = []; // Array to store pet _id values

    const userIds = []; // Array to store user _id values

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

      petIds.push(pet._id); // Store the pet _id in the array

      // Add the pet to the user's pets array
      user.pets.push(pet);
      await user.save();

      userIds.push(user._id); // Store the user _id in the array
    }

    // example for new seeder
    // for (let i = 0; i < thoughtSeeds.length; i++) {
    //   const { _id, thoughtAuthor } = await Thought.create(thoughtSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: thoughtAuthor },
    //     {
    //       $addToSet: {
    //         thoughts: _id,
    //       },
    //     }
    //   );
    // Create markers and assign random pet _id

    for (let i = 0; i < userSeeds.length; i++) {
      const { _id, randomPetId, randomUserId } = await Marker.create(
        markerSeeds[i]
      );
      const pet = await Pet.findOneAndUpdate(
        { petId: randomPetId, createdBy: randomUserId },
        {
          $addToSet: {
            markers: _id,
          },
        }
      );
    }

    // for (let i = 0; i < userSeeds.length; i++) {
    //   const { _id, randomPetId, randomUserId } = await Post.create(
    //     postSeeds[i]
    //   );
    //   const pet = await Pet.findOneAndUpdate(
    //     { petId: randomPetId, createdBy: randomUserId },
    //     {
    //       $addToSet: {
    //         markers: _id,
    //       },
    //     }
    //   );
    // }
  } catch (err) {
    console.log("An error occurred:");
    console.error(err);
    process.exit(1);
  }

  console.log("Finished seeding");
  process.exit(0);
});
