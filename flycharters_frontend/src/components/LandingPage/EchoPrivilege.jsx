import React from 'react';
import bgImage from '/falcon2nd.jpg'; // replace with your actual image path

const EchoPrivilege = () => {
  return (
    <div className="echo-container">
      <div
        className="echo-left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="echo-logo">
          <h1>flycharter</h1>
          <p>PRIVILEGE</p>
        </div>
      </div>
      <div className="echo-right">
        <h2>
          Enter flycharter Privilege Club, our exclusive loyalty program
        </h2>
        <p className="echo-description">
          Crafted for our most loyal flyers — enjoy elevated rewards and a seamless private jet experience.
        </p>
        <button className="echo-button">
          Discover the program →
        </button>
      </div>
    </div>
  );
};

export default EchoPrivilege;
