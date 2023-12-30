import { useQuery } from "@apollo/client";
import { QUERY_MISSING_PETS } from "../../utils/queries";
import { Link } from "react-router-dom";

const MissingPetsList = () => {
  // Use the useQuery hook to fetch the missing pets data
  const { loading, error, data } = useQuery(QUERY_MISSING_PETS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const missingPets = data.petsByMissing;

  if (!missingPets || !missingPets.length) {
    return <h3>No missing pets in your area! Awesome!</h3>;
  }

  return (
    <div>
      <h2>Missing Pets</h2>
      <ul>
        {missingPets.map((pet) => (
          <li key={pet._id}>
            <h3>{pet.petName}</h3>
            <p>
              Owner:{" "}
              <Link to={`/profile/${pet.petOwner ? pet.petOwner._id : ""}`}>
                {pet.petOwner._id}
              </Link>
            </p>
            <p>Description: {pet.description}</p>
            <p>Animal Type: {pet.animalType}</p>
            <p>
              {pet.microchipRegistry}: {pet.microchipNumber}
            </p>
            <p>
              <Link to={`/pet/${pet._id}`}>Help Locate!</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissingPetsList;
