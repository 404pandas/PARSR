const db = require("../config/connection");
const { User, Pet } = require("../models");
const petSeeds = require("./petSeeds.json");
const userSeeds = require("./userSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Pet.deleteMany({});

    // Create Users
    await User.create(userSeeds);

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
      });

      await pet.save();

      // Add the pet to the user's pets array
      user.pets.push(pet);
      await user.save();
    }
  } catch (err) {
    console.log("An error occurred:");
    console.error(err);
    process.exit(1);
  }

  console.log("Finished seeding");
  process.exit(0);
});
