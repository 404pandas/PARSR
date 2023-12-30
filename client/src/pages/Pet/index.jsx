import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PET } from "../../utils/queries";
import { Link } from "react-router-dom";
const Pet = () => {
  const { petId } = useParams();
  const { loading, error, data } = useQuery(QUERY_SINGLE_PET, {
    variables: { petId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const pet = data?.pet;
  // console.log("pet: " + JSON.stringify(pet._id));
  // const petOwner = pet;
  // console.log(petOwner);
  if (!pet) {
    return <div>Pet not found.</div>;
  }

  return (
    <div>
      <h2>{pet.petName}</h2>
      <p>Description: {pet.description}</p>
      <p>Microchip Registry: {pet.microchipRegistry}</p>
      <p>Microchip Number: {pet.microchipNumber}</p>
      <p>Animal Type: {pet.animalType}</p>
      <p>Is Missing: {pet.isMissing ? "Yes" : "No"}</p>
      <p>
        Owner:{" "}
        <Link to={`/profile/${pet.petOwner._id}`}>{pet.petOwner._id}</Link>
      </p>
    </div>
  );
};

export default Pet;
