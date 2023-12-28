import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { ADD_PET } from "../../utils/mutations";
import { QUERY_PETS, QUERY_ME } from "../../utils/queries";

import Auth from "../../utils/auth";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const PetForm = () => {
  const [petName, setPetName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [description, setDescription] = useState("");
  const [microchipRegistry, setMicrochipRegistry] = useState("");
  const [microchipNumber, setMicrochipNumber] = useState("");
  const [isMissing, setIsMissing] = useState(false);

  const [addPet, { error }] = useMutation(ADD_PET, {
    refetchQueries: [QUERY_PETS, "getPets", QUERY_ME, "me"],
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addPet({
        variables: {
          petName,
          animalType,
          description,
          microchipRegistry,
          microchipNumber,
          isMissing,
          // Run the getProfile() method to get access to the unencrypted token value in order to retrieve the user's username
          petOwner: Auth.getProfile().authenticatedPerson.username,
        },
      });

      setPetName("");
      setAnimalType("");
      setDescription("");
      setMicrochipRegistry("");
      setMicrochipNumber("");
      setIsMissing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "petName") {
      setPetName(value);
    }
    if (name === "animalType") {
      setAnimalType(value);
    }
    if (name === "description") {
      setDescription(value);
    }
    if (name === "microchipRegistry") {
      setMicrochipRegistry(value);
    }
    if (name === "microchipNumber") {
      setMicrochipNumber(value);
    }
    if (name === "isMissing") {
      setIsMissing(event.target.checked);
    }
  };

  return (
    <div>
      <h3>Add a Pet</h3>

      {Auth.loggedIn() ? (
        <>
          <form onSubmit={handleFormSubmit}>
            <div>
              <TextField
                name='petName'
                placeholder="Pet's Name"
                value={petName}
                onChange={handleChange}
              />
              {/* description */}
              <TextField
                name='description'
                placeholder='Description'
                value={description}
                onChange={handleChange}
              />
              {/* microchipRegistry */}
              <TextField
                name='microchipRegistry'
                placeholder='Microchip Registry'
                value={microchipRegistry}
                onChange={handleChange}
              />
              {/* microchipNumber */}
              <TextField
                name='microchipNumber'
                placeholder='Microchip Number'
                value={microchipNumber}
                onChange={handleChange}
              />
              {/* animalType */}
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>
                  Animal Type
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={animalType}
                  label='Type'
                  onChange={handleChange}
                >
                  <MenuItem value={"DOG"}>Dog</MenuItem>
                  <MenuItem value={"CAT"}>Cat</MenuItem>
                  <MenuItem value={"OTHER"}>Other</MenuItem>
                </Select>
              </FormControl>
              {/* isMissing */}
              <FormControlLabel
                control={
                  <Switch
                    name='isMissing'
                    checked={isMissing}
                    onChange={handleChange}
                  />
                }
                label='Missing'
              />
            </div>

            <div className='col-12 col-lg-3'>
              <Button
                type='submit'
                disabled={
                  !petName ||
                  !animalType ||
                  !description ||
                  !microchipRegistry ||
                  !microchipNumber ||
                  !isMissing
                }
              >
                Add Pet
              </Button>
            </div>
            {error && (
              <div className='col-12 my-3 bg-danger text-white p-3'>
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your pets. Please{" "}
          <Link to='/login'>login</Link> or <Link to='/signup'>signup.</Link>
        </p>
      )}
    </div>
  );
};

export default PetForm;
