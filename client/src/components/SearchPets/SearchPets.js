import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { savePet, searchMissingPets } from '../utils/API';
import { savePetIds, getSavedPetIds } from '../utils/localStorage';

const SearchPets = () => {
  // create state for holding returned google api data
  const [searchedPets, setSearchedPets] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved PetId values
  const [savedPetIds, setSavedPetIds] = useState(getSavedPetIds());

  // set up useEffect hook to save `savedPetIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => savePetIds(savedPetIds);
  });

  // create method to search for Pets and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGooglePets(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const PetData = items.map((Pet) => ({
        PetId: Pet.id,
        users: Pet.volumeInfo.users || ['No owner to display'],
        title: Pet.volumeInfo.title,
        description: Pet.volumeInfo.description,
        image: Pet.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedPets(PetData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a Pet to our database
  const handleSavePet = async (PetId) => {
    // find the Pet in `searchedPets` state by the matching id
    const PetToSave = searchedPets.find((Pet) => Pet.PetId === PetId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await savePet(PetToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if Pet successfully saves to user's account, save Pet id to state
      setSavedPetIds([...savedPetIds, PetToSave.PetId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Pets!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a Pet'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedPets.length
            ? `Viewing ${searchedPets.length} results:`
            : 'Search for a Pet to begin'}
        </h2>
        <CardColumns>
          {searchedPets.map((Pet) => {
            return (
              <Card key={Pet.PetId} border='dark'>
                {Pet.image ? (
                  <Card.Img src={Pet.image} alt={`The cover for ${Pet.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{Pet.title}</Card.Title>
                  <p className='small'>Owner: {Pet.users}</p>
                  <Card.Text>{Pet.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedPetIds?.some((savedPetId) => savedPetId === Pet.PetId)}
                      className='btn-block btn-info'
                      onClick={() => handleSavePet(Pet.PetId)}>
                      {savedPetIds?.some((savedPetId) => savedPetId === Pet.PetId)
                        ? 'This Pet has already been saved!'
                        : 'Save this Pet!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchPets;