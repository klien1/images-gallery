import React from "react";
import { Spinner as Loader } from "react-bootstrap";

const spinnerStyle = {
  position: "absolute",
  top: "calc(50% - 1rem)",
  left: "calc(50% - 1rem)",
};

const Spinner = ({ animation }) => {
  return (
    <div style={spinnerStyle}>
      <Loader animation={animation} variant="secondary" />
    </div>
  );
};

export default Spinner;
