import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Search from "./components/Search";
import ImageCard from "./components/ImageCard";
import Welcome from "./components/Welcome";
import { Container, Row, Col } from "react-bootstrap";

// const UNSPALSH_API_KEY = process.env.REACT_APP_UNSPALSH_API_KEY;
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5050";

function App() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    console.log(search);

    try {
      // const url = "https://api.unsplash.com/";
      const randomPicture = await fetch(`${API_URL}/new-image?query=${search}`);
      const data = await randomPicture.json();
      setImages([{ title: search, ...data }, ...images]);
      setSearch("");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  return (
    <div className="App">
      <Header />
      <Search
        search={search}
        setSearch={setSearch}
        handleSubmit={handleSearchSubmit}
      />

      {images.length > 0 ? (
        <Container className="mt-4">
          <Row xs={1} md={2} lg={3}>
            {images.map((image, index) => (
              <Col key={index} className="pb-3">
                <ImageCard
                  image={image}
                  handleDeleteImage={handleDeleteImage}
                />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <Welcome />
      )}
    </div>
  );
}

export default App;
