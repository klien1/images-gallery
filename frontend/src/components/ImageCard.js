import React from "react";
import { Card, Button } from "react-bootstrap";

const ImageCard = ({ image, handleDeleteImage, handleSaveImage }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={image.urls.small} />
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
          <Button variant="danger" onClick={() => handleDeleteImage(image.id)}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImageCard;
