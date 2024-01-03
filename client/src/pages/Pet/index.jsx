import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PET } from "../../utils/queries";
import { Link } from "react-router-dom";
import "./style.css";
import Typography from "@mui/material/Typography";
import Map from "../../components/Map";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CopyToClipboard from "react-copy-to-clipboard";
import ContentPaste from "@mui/icons-material/ContentPaste";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useState } from "react";

const Pet = () => {
  const [copySuccess, setCopySuccess] = useState([]); // Track whether copy was successful for each pet

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
  console.log("pet: " + JSON.stringify(pet));
  // const petOwner = pet;
  // console.log(petOwner);
  if (!pet) {
    return <div>Pet not found.</div>;
  }
  const cardStyle = {
    color: "white",
    marginBottom: "16px",
    borderRadius: "50px",
    boxShadow: "unset",
  };

  const cardContentStyle = {
    backgroundColor: "rgb(240 244 248 / 70%)",
    padding: "16px",
    bottom: "39px",
    margin: "auto",
    position: "relative",
    borderRadius: "65px",
    width: "80%",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(0, 0, 0, 0.54)",
    color: "black",
  };

  const handleCopy = () => {
    // Create a copy of the current `copiedArray` and set the specific index to `true`
    setCopySuccess(true);
    // Schedule the change back to ContentPaste after 10 seconds
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  console.log(pet.map);

  return (
    <div>
      <div className='flexbox-turn-on'>
        <div>
          {" "}
          {pet.image ? (
            <img
              src={`../../src/assets/images/SVG/${pet.image}`}
              className='petImage'
              alt='Missing Pet'
            ></img>
          ) : (
            <img
              src='../../src/assets/images/SVG/hedgehog-01-front.svg'
              alt='Missing Pet'
            ></img>
          )}{" "}
          <Card style={cardStyle}>
            <Typography variant='h5' gutterBottom align='center'>
              {pet.petName}
            </Typography>
            <CardContent style={cardContentStyle}>
              <p>Description: {pet.description}</p>
              <p>Animal Type: {pet.animalType}</p>
              <p>Is Missing: {pet.isMissing ? "Yes" : "No"}</p>
              <Typography variant='subtitle1'>
                Owner:{" "}
                <Link
                  to={`/profile/${pet.petOwner ? pet.petOwner._id : ""}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {pet.petOwnerUsername}
                </Link>
                <>
                  <>
                    <Typography variant='body1'>
                      <a
                        href='https://www.petmicrochiplookup.org/'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Lookup Chip
                      </a>
                      : {pet.microchipNumber}
                      <CopyToClipboard
                        text={pet.microchipNumber}
                        onCopy={() => handleCopy()} // Set copied state to true on copy
                      >
                        <IconButton aria-label='delete'>
                          {copySuccess ? (
                            <AssignmentTurnedInIcon />
                          ) : (
                            <ContentPaste />
                          )}
                        </IconButton>
                      </CopyToClipboard>
                    </Typography>
                  </>
                </>
              </Typography>
            </CardContent>{" "}
          </Card>{" "}
        </div>
        <div>
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <List dense>
              <ListItem
                secondaryAction={
                  <IconButton edge='end' aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary='Username here'
                  secondary='This is a chat message'
                />
              </ListItem>{" "}
              <Divider />
              <ListItem
                secondaryAction={
                  <IconButton edge='end' aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary='Username'
                  secondary='This is a very long chat message that will wrap to the next line. Insert some info about searching for a pet and talk to other users searching for the same pet.'
                />
              </ListItem>
            </List>
          </Box>
        </div>
      </div>
      <Map />
    </div>
  );
};

export default Pet;
