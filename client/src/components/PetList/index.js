// Component for listing logged in user's pets
import React from 'react';

const PetList = ({ pets, title }) => {
  if (!pets.length) {
    return <h3>No Pets Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {pets &&
        pets.map((pet) => (
          <div key={pet._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {pet.user} <br />
            </h4>
            <div className="card-body bg-light p-2">
              <p>{pet.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PetList;