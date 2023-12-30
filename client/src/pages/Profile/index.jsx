import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

import PetList from "../../components/PetList";
import { QUERY_USER } from "../../utils/queries";

const Profile = () => {
  const { profileId } = useParams();

  const [userUsername, setUserUsername] = useState("");
  const [userData, setUserData] = useState(null); // State to track user data

  // Conditionally define the query based on the presence of profileId
  const query = profileId ? QUERY_USER : QUERY_USER;

  const variables = profileId ? { userId: profileId } : {};

  const { loading, error, data } = useQuery(query, {
    variables,
  });

  useEffect(() => {
    if (data && data.user) {
      setUserUsername(data.user.username);
      setUserData(data.user); // Set user data in state
    }
  }, [data]);

  const pets = userData?.pets;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  if (!userData) {
    return <div>User not found!</div>;
  }

  if (!pets) {
    return <div>No pets found!</div>;
  }

  return (
    <React.Fragment>
      <div>
        {userData && userData.username ? (
          <h2>Viewing {userUsername}'s profile.</h2>
        ) : (
          <h2>User not found. Known bug- Refresh for user's Username.</h2>
        )}

        {pets && pets.length > 0 ? (
          <div>
            <PetList petData={pets} title={`${userUsername}'s pets...`} />
          </div>
        ) : (
          <div>No pets found.</div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Profile;
