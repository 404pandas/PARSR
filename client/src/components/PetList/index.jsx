import "./style.css";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react"; // Import useState and useEffect

const PetList = ({ pets }) => {
  const [petData, setPetData] = useState([]);

  useEffect(() => {
    if (pets) {
      setPetData(pets);
    }
  }, [pets]);

  if (!petData || !petData.length) {
    return <h3>You haven&apos;t added any pets yet!</h3>;
  }
  console.log("Pets:" + JSON.stringify(petData));

  return (
    <div>
      <h3>Pets</h3>
      {petData.map((pet) => (
        <>
          <div key={pet._id}>
            <Link to={`/pet/${pet._id}`}>
              <h3>Name: {pet.petName}</h3>
            </Link>
            {/* {console.log("pet.petOwner: " + pet.petOwner)} */}
            {/* Access the petOwner properties */}
            <h4>
              Owner:{" "}
              {pet.petOwner && pet.petOwner.username
                ? pet.petOwner.username
                : "Unknown"}
            </h4>
            <Link to={`/profile/${pet.petOwner ? pet.petOwner._id : ""}`}>
              {/* Access the petOwner properties */}
              <h4>Owner Profile</h4>
            </Link>
            <div>
              <p>{pet.description}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default PetList;
