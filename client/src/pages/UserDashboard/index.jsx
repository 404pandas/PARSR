import { useQuery } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";

import PetForm from "../../components/PetForm";
import PetList from "../../components/PetList";

import { QUERY_ME, QUERY_USER } from "../../utils/queries";

import Auth from "../../utils/auth";

const Profile = () => {
  const { profileId } = useParams();
  const { loading, error, data } = useQuery(profileId ? QUERY_USER : QUERY_ME, {
    variables: { profileId: profileId },
  });

  const user = data?.me || data?.user || {};
  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
    return <Navigate to='/me' />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  if (error) return `Error! ${error.message}`;

  console.log(user);
  return (
    <div>
      <div className='flex-row justify-center mb-3'>
        <h2 className='col-12 col-md-10 bg-dark text-light p-3 mb-5'>
          Viewing {profileId ? `${user.username}'s` : "your"} profile.
        </h2>

        <div className='col-12 col-md-10 mb-5'>
          <PetList pets={user.pets} title={`${user.username}'s pets...`} />
        </div>
        {!profileId && (
          <div
            className='col-12 col-md-10 mb-3 p-3'
            style={{ border: "1px dotted #1a1a1a" }}
          >
            <PetForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
