import React, { useEffect, useState } from "react";
import { fetchGrades, fetchData, API, getToken, postData } from "../helper";
import Base from "./Base";
import Loading from "./Loading";

export default function Attendance() {
  const [grades, setGrades] = useState([]);
  const [gradeName, setGradeName] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [students, setStudents] = useState([]);
  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });

  async function populateGrades() {
    setMetaData({ ...metaData, loading: true });
    const grades = await fetchGrades();
    setGrades([...grades]);
    setMetaData({ ...metaData, loading: false });
  }

  async function fetchGradeStudents() {
    setMetaData({ ...metaData, loading: true });
    const URL = API + `/attendance?gradeName=${gradeName}`;
    const token = getToken();
    const data_students = await fetchData(URL, token);
    // console.log(data_students);
    setStudents([...data_students]);
    setMetaData({ ...metaData, loading: false });
  }

  useEffect(() => {
    populateGrades();
  }, []);

  useEffect(() => {
    if (grades && grades.length > 0) {
      setGradeName(grades[0].gradeName);
    }
  }, [grades]);

  useEffect(() => {
    const choosenGrade = grades.find((grade) => grade.gradeName === gradeName);
    if (choosenGrade) {
      setSections(choosenGrade.sections);
      fetchGradeStudents();
    }
  }, [gradeName]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setSectionName(sections[0]);
    }
  }, [sections]);

  const handleGradeChange = (event) => {
    event.preventDefault();
    setGradeName(event.target.value);
  };

  const handleSectionChange = (event) => {
    event.preventDefault();
    setSectionName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMetaData({ ...metaData, loading: true });
    try {
      const table = document.querySelector("#attendanceTable");
      // console.log(table.rows.length);
      const attendanceData = [];
      for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const present = row.cells[4].childNodes[0].checked;
        const studentRegistrationNum = row.cells[1].innerText;
        attendanceData.push({
          registrationNumber: studentRegistrationNum,
          present,
        });
      }
      // console.log(attendanceData);
      const URL = API + "/attendance";
      const token = getToken();
      const multipartBody = new FormData();
      multipartBody.set("attendanceData", JSON.stringify(attendanceData));
      multipartBody.set("grade", gradeName);
      multipartBody.set("section", sectionName);
      const result = await postData(URL, token, multipartBody);
      console.log(result);
      setMetaData({ ...metaData, loading: false });
    } catch (error) {
      setMetaData({ ...metaData, loading: false, error: error });
      console.log(error);
    }
  };

  const getGradeOptionList = (grades) => {
    return (
      grades &&
      grades.map((grade, idx) => (
        <option key={idx} value={grade.gradeName}>
          {grade.gradeName}
        </option>
      ))
    );
  };

  const getSectionOptionList = (sections) => {
    return (
      sections &&
      sections.map((section, idx) => (
        <option key={idx} value={section}>
          {section}
        </option>
      ))
    );
  };

  const contructTableBody = (students) => {
    return students.map((student, idx) => {
      // const updateLink = "/teacher/" + teacher._id;
      return (
        <tr key={student._id}>
          <th scope="row">{idx + 1}</th>
          <td>{student.registrationNumber}</td>
          <td>{student.studentName}</td>
          <td>{student.roll}</td>
          <td>
            <input
              type="checkbox"
              className="form-check-input w-100"
              name="present"
              id="present"
              style={{ height: "30px" }}
            />
          </td>
        </tr>
      );
    });
  };

  const createStudentList = (students) => (
    <div className="m-3 border border-warning border-2 rounded">
      <table className="table" id="attendanceTable">
        <thead>
          <tr>
            <th scope="col">Row</th>
            <th scope="col">Reg No.</th>
            <th scope="col">Name</th>
            <th scope="col">Roll</th>
            <th scope="col">Present</th>
          </tr>
        </thead>
        <tbody>{contructTableBody(students)}</tbody>
      </table>
    </div>
  );

  const attendancePage = () => (
    <Base
      title="Attendance Page"
      className="container d-flex flex-column align-items-center"
    >
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <div className="row mb-3">
            <label htmlFor="gradeName" className="col-sm-3 col-form-label">
              Grade
            </label>
            <div className="col-sm-7">
              <select
                className="form-control"
                id="gradeName"
                name="gradeName"
                value={gradeName}
                onChange={handleGradeChange}
              >
                {getGradeOptionList(grades)}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="sectionName" className="col-sm-3 col-form-label">
              Section
            </label>
            <div className="col-sm-7">
              <select
                className="form-control"
                id="sectionName"
                name="sectionName"
                value={sectionName}
                onChange={handleSectionChange}
              >
                {getSectionOptionList(sections)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center border border-info border-5 my-5 rounded">
        {createStudentList(students)}
        <button className="btn btn-success btn-lg m-3" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </Base>
  );

  return metaData.loading ? Loading() : attendancePage();
}
