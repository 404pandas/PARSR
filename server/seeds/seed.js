const db = require("../config/connection");
const { User, Pet, Marker } = require("../models");
const petSeeds = require("./petSeeds.json");
const userSeeds = require("./userSeeds.json");
const markerSeeds = require("./markerSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Marker.deleteMany({});

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
      });

      await pet.save();

      petIds.push(pet._id); // Store the pet _id in the array

      // Add the pet to the user's pets array
      user.pets.push(pet);
      await user.save();

      userIds.push(user._id); // Store the user _id in the array
    }

    // Create markers and assign random pet _id
    for (const markersData of markerSeeds) {
      // Check if markersData.id is defined and valid
      // if (!markersData.petId) {
      //   console.log(`Invalid petId in markersData: ${markersData.petId}`);
      //   continue;
      // }

      // Select a random pet _id from the petIds array
      const randomPetId = petIds[Math.floor(Math.random() * petIds.length)];
      console.log("randomPetId:", randomPetId);

      // Select a random user _id from the userIds array
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      console.log("randomUserId:", randomUserId);

      const pet = await Pet.findOne({ _id: randomPetId });

      const user = await User.findOne({ _id: randomUserId });

      if (!pet) {
        console.log(`Pet with petId ${randomPetId} not found.`);
        continue;
      }

      if (!user) {
        console.log(`User with userId ${randomUserId} not found.`);
        continue;
      }

      const marker = new Marker({
        petId: randomPetId,
        markerName: markersData.markerName,
        markerDescription: markersData.markerDescription,
        createdAt: markersData.createdAt || null,
        createdBy: randomUserId,
        coordinates: markersData.coordinates,
        geometry: markersData.geometry || null,
        image: markersData.image,
      });

      await marker.save();

      // Add the marker to the pet's marker array
      pet.markers.push(marker);

      await pet.save();
    }
  } catch (err) {
    console.log("An error occurred:");
    console.error(err);
    process.exit(1);
  }

  console.log("Finished seeding");
  process.exit(0);
});
