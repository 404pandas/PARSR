import React, { useState, useEffect } from "react";
import { getMe, deletePet } from "../utils/API";
import Auth from "../utils/auth";
import { removePetId } from "../utils/localStorage";

import Jumbotron from "@mui/material/Jumbotron";
import Container from "@mui/material/Container";
import CardColumns from "@mui/material/CardColumns";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

const SavedPets = (props) => {
  const [petData, setPetData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const petDataLength = Object.keys(petData).length;

  useEffect(() => {
    const getPetData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error("something went wrong!");
        }

        const pet = await response.json();
        setPetData(pet);
      } catch (err) {
        console.error(err);
      }
    };

    getPetData();
  }, [petDataLength]);

  // create function that accepts the pet's mongo _id value as param and deletes the Pet from the database
  const handleDeletePet = async (PetId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deletePet(PetId, token);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const updatedPet = await response.json();
      setPetData(updatedPet);
      // upon success, remove pet's id from localStorage
      removePetId(PetId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!petDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved pets! Thanks for your efforts!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {petData.savedPets.length
            ? `Viewing ${petData.savedPets.length} saved ${
                petData.savedPets.length === 1 ? "pet" : "pets"
              }:`
            : "You have no saved pets! Please use the search bar to find missing pets in your area!"}
        </h2>
        <CardColumns>
          {petData.savedPets.map((pet) => {
            return (
              <Card key={pet.petId} border='dark'>
                {pet.image ? (
                  <Card.Img
                    src={pet.image}
                    alt={`The cover for ${pet.title}`}
                    variant='top'
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{pet.title}</Card.Title>
                  <p className='small'>Owners: {pet.users}</p>
                  <Card.Text>{pet.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeletePet(pet.petId)}
                  >
                    Remove this pet. Please only consider this option if the pet
                    has been located!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedPets;
