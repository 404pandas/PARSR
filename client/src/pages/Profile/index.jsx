import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

import PetList from "../../components/PetList";
import { QUERY_USER } from "../../utils/queries";
import AuthService from "../../utils/auth";

const Profile = () => {
  const { user_id } = AuthService.getProfile();
  console.log("Profile ID:");
  console.log(user_id);
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { user_id: user_id },
  });

  const [userUsername, setUserUsername] = useState("");
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (data && data.user) {
      setUserUsername(data.user.username || "");
      setUserData(data.user);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;
  if (!userData) return <div>User not found!</div>;

  const pets = userData.pets;

  return (
    <div>
      <h2>
        {userUsername
          ? `Viewing ${userUsername}'s profile.`
          : "User not found. Refresh for user’s Username."}
      </h2>
      {pets && pets.length > 0 ? (
        <PetList
          petData={pets}
          ownerData={userData}
          title={`${userUsername}&rsquo;s pets...`}
        />
      ) : (
        <div>No pets found.</div>
      )}
    </div>
  );
};

export default Profile;
