import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Search from "./components/Search";
import ImageCard from "./components/ImageCard";
import Welcome from "./components/Welcome";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5050";

function App() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);

  const getSavedImages = async () => {
    console.log("getting saved iamges");
    try {
      const response = await axios.get(`${API_URL}/images`);
      setImages(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSavedImages();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const randomPictureResult = await axios.get(
        `${API_URL}/new-image?query=${search}`
      );
      const data = randomPictureResult.data;
      // const randomPicture = await fetch(`${API_URL}/new-image?query=${search}`);
      // const data = await randomPicture.json();
      setImages([{ title: search, ...data }, ...images]);
      setSearch("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id);
    imageToBeSaved.saved = true;

    try {
      const response = await axios.post(`${API_URL}/images`, imageToBeSaved);
      if (response.data && response.data.inserted_id) {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
                  handleSaveImage={handleSaveImage}
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
