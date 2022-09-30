import React, { useState } from "react";
import { Card, Button, Nav } from "react-bootstrap";
import Spinner from "./Spinner";

const ImageCard = ({ image, handleDeleteImage, handleSaveImage }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card style={{ width: "18rem" }}>
      {isImageLoaded ? null : <Spinner animation="grow" />}

      <div style={isImageLoaded ? {} : { visibility: "hidden" }}>
        <Card.Img
          // style={isImageLoaded ? {} : { visibility: "hidden" }}
          variant="top"
          src={image.urls.small}
          onLoad={() => setIsImageLoaded(true)}
        />

        <Card.Body>
          <Card.Title>{image.title && image.title.toUpperCase()}</Card.Title>
          <Card.Text>{image.description || image.alt_description}</Card.Text>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              style={image.saved ? { visibility: "hidden" } : {}}
              variant="primary"
              onClick={() => handleSaveImage(image.id)}
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteImage(image.id)}
            >
              Delete
            </Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <Nav className="justify-content-center">
            <Nav.Link
              disabled={!!!image.user.portfolio_url}
              href={image.user.portfolio_url}
              target="_blank"
            >
              {image.user.name || "No Author name"}
            </Nav.Link>
          </Nav>
        </Card.Footer>
      </div>
    </Card>
  );
};

export default ImageCard;
