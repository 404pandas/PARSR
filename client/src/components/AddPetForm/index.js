import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_PET } from "../../utils/mutations";
import { QUERY_PETS, QUERY_ME, QUERY_PET } from "../../utils/queries";
// TODO- build out QUERY_PETS

import Auth from "../../utils/auth";

const AddPetForm = () => {
  const [formState, setFormState] = useState({
    petName: "",
    animalType: "",
    description: "",
    microchipRegistry: "",
    microchipNumber: "",
  });

  const [petName, setPetName] = useState("");

  const [characterCount, setCharacterCount] = useState(0);

  // export const ADD_PET = gql`
  // mutation addPet($petId: String!) {
  //   addPet(petId: $petId)
  //   _id
  //   petName
  //   animalType
  //   description
  //   microchipRegistry
  //   microchipNumber
  //   }
  // }

  // Sets up mutation with option to handle errors
  const [addPet, { error }] = useMutation(ADD_PET);

  // Future development
  //  {
  //   update(cache, { data: { addPet } }) {
  //     try {
  //       const { pets } = cache.readQuery({ query: QUERY_petS });

  //       cache.writeQuery({
  //         query: QUERY_petS,
  //         data: { pets: [addpet, ...pets] },
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }

  //     // update me object's cache
  //     const { me } = cache.readQuery({ query: QUERY_ME });
  //     cache.writeQuery({
  //       query: QUERY_ME,
  //       data: { me: { ...me, pets: [...me.pets, addpet] } },
  //     });
  //   }
  // };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addPet({
        variables: { ...formState },
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "petName" && value.length <= 280) {
      setFormState({ ...formState, [name]: value });
      setCharacterCount(value.length);
    } else if (name !== "petName") {
      setFormState({ ...formState, [name]: value });
    }
  };

  return (
    <div>
      <h3>Add Pet:</h3>
      <p>Pet Name</p>
      <p>{petName}</p>
      <label htmlFor="pet" className="blahhhhhhh">
        Name (4 to 8 characters):
      </label>

      <input
        value={petName}
        onChange={(e) => {
          e.preventDefault();
          setPetName(e.target.value);
        }}
        type="text"
        id="pet"
        name="pet"
        required
        minLength="4"
        maxLength="8"
        size="10"
      ></input>

      {/* button */}
      <button
        onClick={async (e) => {
          useQuery(QUERY_PET, {
            variables: { petName },
          });
        }}
      >
        Yo this is a button
      </button>

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? "text-danger" : ""
            }`}
          >
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            {/*
  //   _id
  //   petName
  //   animalType
  //   description
  //   microchipRegistry
  //   microchipNumber */}
            <div className="col-12 col-lg-9">
              <textarea
                name="petName"
                placeholder="Insert pet name"
                value={formState.petName}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <textarea
                name="animalType"
                placeholder="Insert pet type"
                value={formState.animalType}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <textarea
                name="description"
                placeholder="Insert pet description"
                value={formState.description}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <textarea
                name="microchipRegistry"
                placeholder="Insert pet microchip registry"
                value={formState.microchipRegistry}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <textarea
                name="microchipNumber"
                placeholder="Insert pet microchip number"
                value={formState.microchipNumber}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add pet
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to add your pet{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default AddPetForm;
