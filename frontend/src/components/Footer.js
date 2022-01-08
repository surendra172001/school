import React from "react";

export default function Footer() {
  let footerStlye = {
    position: "relative",
    bottom: "0px",
    left: "0px",
    right: "0px",
  };
  return (
    <footer
      className="bg-dark text-light text-center p-4 border border-5 border-danger rounded fs-4"
      style={footerStlye}
    >
      Copyright&copy;vishalSAP.com
    </footer>
  );
}
