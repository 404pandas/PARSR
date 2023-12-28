import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import PetList from "../../components/PetList";
import { QUERY_USER } from "../../utils/queries";

const Profile = () => {
  const { userId } = useParams();
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { userId: userId }, // Pass userId as userId variable
  });

  const user = data?.user;
  console.log("userdata: " + JSON.stringify(user));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <div>
        <h2>Viewing {userId ? `${user.username}'s` : "your"} profile.</h2>

        <div>
          <PetList pets={user.pets} title={`${user.username}'s pets...`} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
