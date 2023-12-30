import "./style.css";
import { Link } from "react-router-dom";

const PetList = ({ petData }) => {
  console.log("petData from PetList.jsx:" + JSON.stringify(petData));

  if (!petData || !petData.length) {
    console.log(
      "petData from after PetList.jsx logic:" + JSON.stringify(petData)
    );
    return <h3>You haven&apos;t added any pets yet!</h3>;
  }

  return (
    <div>
      <h3>Pets</h3>
      {petData.map((pet) => (
        <div key={pet._id}>
          <Link to={`/pet/${pet._id}`}>
            <h3>Name: {pet.petName}</h3>
          </Link>
          {/* {console.log("pet.petOwner: " + pet.petOwner)} */}
          {/* Access the petOwner properties */}
          <h4>
            Owner:{" "}
            <p>
              <Link to={`/profile/${pet.petOwner ? pet.petOwner._id : ""}`}>
                {pet.petOwner ? pet.petOwner._id : "Unknown Owner"}
              </Link>
            </p>
          </h4>
          <div>
            <p>{pet.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetList;
