import React from 'react';
// require('dotenv').config();
import { Link } from 'react-router-dom';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import '../App.css';

function Landing () {
  return (
    <main>
      <Link to='/signup' style={{ textDecoration: 'none' }}>
        <h1>Sign Up now</h1>
      </Link>
      <Link to='/login' style={{ textDecoration: 'none' }}>
        <h1>Login now</h1>
      </Link>
      <LoadScript
      googleMapsApiKey="AIzaSyASumuKSGSUz0lRlU4hfva2BG-NGKKPTAI"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
    </main>
  )
}
;

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

// class Landing extends Map {
//   render() {
//     return (
    
//   )
// }
// };

export default Landing;
;