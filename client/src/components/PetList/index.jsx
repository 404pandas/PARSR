import "./style.css";
import { Link } from "react-router-dom";
const PetList = ({ pets }) => {
  if (!pets.length) {
    return <h3>No Pets Have Been Added Yet!</h3>;
  }
  console.log("Pets:" + JSON.stringify(pets));
  return (
    <div>
      <h3>Pets</h3>
      {pets.map((pet) => (
        <>
          <div key={pet._id}>
            {" "}
            <h3>Name: {pet.petName}</h3>
            <Link to={`/profiles/${pet.petOwner}`}>
              <h4>Owner: {pet.petOwnerUsername}</h4>
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
