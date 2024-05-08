import React from 'react';
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
//import { Navigate } from 'react-router';

const Homepage = () => {
  return (
    <div className="homePageBg">
      <div className="typewriterEffect">
        <Typewriter
          options={{
            strings: ["Welcome to ISSL"],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <p className="homepageText">
        Please fill out the visitation form to register your visit and notify
        your host
      </p>

      <Link to={`/visitorsform`}>
        <button className="homepageBtn">Fill Visitation Form</button>
      </Link>
    </div>
  );
}

export default Homepage;