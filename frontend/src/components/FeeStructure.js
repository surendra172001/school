import React, { useState, useEffect } from "react";
import { fetchData } from "../helper";

export default function FeeStructure() {
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
      return (
        <tr key={idx}>
          <th scope="row">{idx + 1}</th>
          <td>{grade.gradeName}</td>
          <td>{grade.admissionFees}</td>
          <td>{grade.tutionFees}</td>
          <td>{grade.latePaymentFine}</td>
          <td>{grade.furnitureFees}</td>
          <td>{grade.conveyanceCharges}</td>
          <td>{grade.developmentFees}</td>
          <td>{grade.computerFees}</td>
          <td>{grade.baseTransportFee}</td>
          <td>{grade.baseDist}</td>
          <td>{grade.offsetTransportFee}</td>
          <td>{grade.offsetDist}</td>
          <td>{grade.fixedMonthlyFee}</td>
        </tr>
      );
    });
  }

  return (
    <div>
      <h1>Fee Structure</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Row</th>
            <th scope="col">Grade Name</th>
            <th scope="col">Admission Fees</th>
            <th scope="col">Tution Fees</th>
            <th scope="col">Late Payment Fine</th>
            <th scope="col">Furniture Fees</th>
            <th scope="col">Conveyance Charges</th>
            <th scope="col">Development Fees</th>
            <th scope="col">Computer Fees</th>
            <th scope="col">Minimum Transport Fees</th>
            <th scope="col">Base Distance</th>
            <th scope="col">Offset Transport Fees</th>
            <th scope="col">Offset Distance</th>
            <th scope="col">Fixed Monthly Fees</th>
          </tr>
        </thead>
        <tbody>{contructTableBody()}</tbody>
      </table>
    </div>
  );
}
