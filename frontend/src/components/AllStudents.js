import React, { useState, useEffect } from "react";
import { fetchData, getToken, API } from "../helper";
import { Link } from "react-router-dom";

export default function AllStudents() {
  const [students, setStudents] = useState([]);

  async function fetchStudents() {
    const URL = API + "/allStudents";
    const token = getToken();
    const data = await fetchData(URL, token);
    setStudents(data);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function contructTableBody() {
    return students.map((student, idx) => {
      const updateLink = "/student/" + student.registrationNumber;
      return (
        <tr key={idx}>
          <th scope="row">{idx + 1}</th>
          <td>{student.registrationNumber}</td>
          <td>{student.studentName}</td>
          <td>{student.grade}</td>
          <td>{new Date(student.DOA).toISOString().split("T")[0]}</td>
          <td>
            <Link to={updateLink}>Update</Link>
          </td>
        </tr>
      );
    });
  }

  const createStudentList = () => (
    <div>
      <h1>Students List</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Row</th>
            <th scope="col">Registration Number</th>
            <th scope="col">Name</th>
            <th scope="col">Class</th>
            <th scope="col">Date Of Admission</th>
            <th scope="col">Edit Info</th>
          </tr>
        </thead>
        <tbody>{contructTableBody()}</tbody>
      </table>
    </div>
  );

  return createStudentList();
}
