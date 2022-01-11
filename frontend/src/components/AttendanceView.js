import React, { useEffect, useState } from "react";
import { fetchGrades, fetchData, API, getToken, postData } from "../helper";
import Base from "./Base";
import Loading from "./Loading";

export default function AttendanceView() {
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

  const attendanceViewPage = () => (
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
    </Base>
  );

  return metaData.loading ? Loading() : attendanceViewPage();
}
