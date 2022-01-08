import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Base({
  title = "Page Title",
  className = "",
  children,
}) {
  return (
    <>
      <Header />
      <div className="d-flex align-items-center flex-column min-vh-100">
        <h1 className="mt-5">{title}</h1>
        <div className={className}>{children}</div>
      </div>
      <Footer />
    </>
  );
}
