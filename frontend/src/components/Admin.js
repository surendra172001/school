import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../helper";
import Base from "./Base";

export default function Admin() {
  let navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) {
      navigate("/signin", { replace: true });
    }
  }, []);

  const imageUrl =
    "https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fG9mZmljZSUyMHNwYWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60";
  const adminPageStyles = {
    backgroundImage: `url(${imageUrl})`,
    backgroundColor: "#cccccc",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    width: "100wh",
  };

  const adminPage = () => (
    <div className="border border-danger border-5 my-5 p-5 rounded">
      <div className="container d-flex flex-column">
        <Link className="m-2" to="/admitStudent">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Admit Student
          </button>
        </Link>
        <Link className="m-2" to="/allStudents">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Student List
          </button>
        </Link>
        <Link className="m-2" to="/addGrade">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Add Grade
          </button>
        </Link>
        <Link className="m-2" to="/allGrades">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Grade List
          </button>
        </Link>
        <Link className="m-2" to="/hireTeacher">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Hire Teacher
          </button>
        </Link>
        <Link className="m-2" to="/allTeachers">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Teacher List
          </button>
        </Link>
        <Link className="m-2" to="/feeStructure">
          <button type="button" className="btn btn-primary btn-lg w-100">
            Fees Structure
          </button>
        </Link>
      </div>
    </div>
  );
  return (
    <Base
      title="Admin Page"
      className="d-flex align-items-center justify-content-center flex-column"
      style={adminPageStyles}
    >
      {adminPage()}
    </Base>
  );
}
