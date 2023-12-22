const db = require("../config/connection");

// models
const { User, Pet } = require("../models");

// seeds
const petSeeds = require("./petSeeds.json");
const userSeeds = require("./userSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Pet.deleteMany({});

    // Create Users
    await User.create(userSeeds);
    // Create pets and adds to users
    for (let i = 0; i < petSeeds.length; i++) {
      const { _id, petOwner } = await Pet.create(petSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: petOwner },
        {
          $addToSet: {
            pets: _id,
          },
        }
      );
    }
  } catch (err) {
    console.log("An error occured:");
    console.error(err);
    process.exit(1);
  }

  console.log("Finished seeding");
  process.exit(0);
});
