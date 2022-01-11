import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Base({
  title = "Page Title",
  className = "d-flex align-items-center justify-content-center flex-column",
  style = {},
  children,
}) {
  return (
    <div>
      <Header />
      <div style={style} className="container-fluid min-vh-100">
        <div className="jumbotron text-center">
          <h2 className="display-4">{title}</h2>
        </div>
        <div className={className}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
