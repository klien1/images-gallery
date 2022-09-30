import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Search from "./components/Search";
import ImageCard from "./components/ImageCard";
import Welcome from "./components/Welcome";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Spinner from "./components/Spinner";
import { toast, ToastContainer } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5050";

function App() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSavedImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/images`);
      setImages(response.data || []);
      setIsLoading(false);
      toast.success("Saved images downloaded");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    getSavedImages();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const randomPictureResult = await axios.get(
        `${API_URL}/new-image?query=${search}`
      );
      const upperCaseSearch = search.toUpperCase();
      const data = randomPictureResult.data;
      setImages([{ title: upperCaseSearch, ...data }, ...images]);
      setSearch("");
      toast.info(`New image ${upperCaseSearch} was found`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      let title = "";
      setImages(
        images.filter((image) => {
          if (image.id !== id) return true;
          title = image.title;
          return false;
        })
      );
      toast.warn(`Image ${title} was deleted`);
      await axios.delete(`${API_URL}/images/${id}`);
      // if (response.status === 200)
      // else console.log(response.status);
    } catch (error) {
      toast.error(error.message);
    }
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
        toast.info(`Image ${imageToBeSaved.title} was saved`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="App">
      <Header />

      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <div>
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
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </div>
  );
}

export default App;
