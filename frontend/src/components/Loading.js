import React from "react";

export default function Loading() {
  const spinnerStyle = {
    width: "400px",
    height: "400px",
  };
  return (
    <div className="d-flex justify-content-center flex-column align-items-center min-vh-100 min-vw-100">
      <div className="spinner-border text-center" style={spinnerStyle}></div>
      <h1 className="p-5">Loading...</h1>
    </div>
  );
}
