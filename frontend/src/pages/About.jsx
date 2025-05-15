import React from 'react';

const About = () => {
  return (
    <div className="container">
      <h1>About This Project</h1>
      <p>This is a simple e-commerce platform built with the following technologies:</p>
      <ul>
        <li>Neon PostgreSQL</li>
        <li>React</li>
        <li>Bootstrap</li>
        <li>Node.js</li>
        <li>GraphQL</li>
        <li>Express-GraphQL</li>
      </ul>
      <p>The purpose of this project is to demonstrate a basic e-commerce functionality for learning purposes.</p>
      <p>To upload product images, place them in the <code>/frontend/src/assets/images</code> folder and update the database with the corresponding paths.</p>
    </div>
  );
};

export default About;