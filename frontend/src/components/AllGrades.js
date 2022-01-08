import React, { useState, useEffect } from "react";
import { fetchData } from "../helper";
import { Link } from "react-router-dom";

export default function AllGrades() {
  const [grades, setGrades] = useState([]);
  async function fetchGrades() {
    const URL = "http://localhost:8000/allGrades";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThlNGMzNjY2Y2Y0NzIxNmJmYjE0NTciLCJpYXQiOjE2Mzg3NjQzMTV9.VZkgOWV1VCH0DNq4of2TRIKBieV6L9zvKHxmyo0thog";
    const data = await fetchData(URL, token);
    setGrades(data);
  }
  useEffect(() => {
    fetchGrades();
  }, []);
  function contructTableBody() {
    return grades.map((grade, idx) => {
      const updateLink = "/grade/" + grade.gradeName;
      return (
        <tr key={idx}>
          <th scope="row">{idx + 1}</th>
          <td>{grade.gradeName}</td>
          <td>
            <Link to={updateLink}>Update</Link>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <h1>Grades List</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Row</th>
            <th scope="col">Grade Name</th>
            <th scope="col">Edit Info</th>
          </tr>
        </thead>
        <tbody>{contructTableBody()}</tbody>
      </table>
    </div>
  );
}
