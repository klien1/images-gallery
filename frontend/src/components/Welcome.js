import React from "react";
import { Container, Button } from "react-bootstrap";

const Welcome = () => {
  return (
    <Container className="mt-4">
      <div className="p-5 mb-4 bg-light rounded-3 ">
        <div className="container-fluid py-5 ">
          <h1>Images Gallery</h1>
          <p>Application that retrieves photos from Unsplash API</p>
          <p>
            <Button href="https://unsplash.com/">Learn more</Button>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Welcome;
