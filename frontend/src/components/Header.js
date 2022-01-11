import React from "react";
import { Link } from "react-router-dom";
import { getToken } from "../helper";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Sunrise Public School
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin">
                Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">
                About
              </Link>
            </li>
            {getToken() ? (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signout">
                  Signout
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signin">
                  Signin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
