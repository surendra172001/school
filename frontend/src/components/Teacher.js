import React from "react";
import { Link } from "react-router-dom";

export default function Teacher() {
  const imageUrl =
    "https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fG9mZmljZSUyMHNwYWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60";
  const teacherPageStyles = {
    backgroundImage: `url(${imageUrl})`,
    backgroundColor: "#cccccc",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    width: "100wh",
  };

  const teacherPage = () => (
    <div
      style={teacherPageStyles}
      className="d-flex align-items-center justify-content-center flex-column"
    >
      <h1 className="text-center">Teacher Page</h1>
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column w-50">
          <Link className="m-2" to="/attendance">
            <button type="button" className="btn btn-primary btn-lg w-100">
              Take Attendance
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
  return teacherPage();
}
