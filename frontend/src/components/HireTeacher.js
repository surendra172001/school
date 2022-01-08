import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { API, getToken, postData } from "../helper";

export default function HireTeacher() {
  const [values, setValues] = useState({
    uname: "",
    email: "",
    password: "",
    contactNumber: "",
    aadharNum: "",
    salary: "",
  });

  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });

  const handleChange = (propName) => (event) => {
    if (event.target.files === null) {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setValues({ ...values, [propName]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMetaData({ ...metaData, loading: true });
    try {
      const formBody = { ...values };

      const multipartBody = new FormData();
      for (const fieldName in formBody) {
        if (formBody[fieldName]) {
          multipartBody.set(fieldName, formBody[fieldName]);
        }
      }

      const URL = API + "/hireTeacher";

      const token = getToken();

      const result = await postData(URL, token, multipartBody);
      console.log(result);
      setValues({
        uname: "",
        email: "",
        password: "",
        contactNumber: "",
        aadhaarNum: "",
      });
      setMetaData({ ...metaData, didRedirect: true, loading: false });
    } catch (error) {
      setMetaData({ ...metaData, error: error, loading: false });
      console.log(error);
    }
  };

  const HireTeacherForm = () => (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <h1 className="mt-5">Hire Teacher Form</h1>
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label htmlFor="uname" className="col-sm-3 col-form-label">
                Teahcer Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="uname"
                  id="uname"
                  value={values.uname}
                  onChange={handleChange("uname")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="email" className="col-sm-3 col-form-label">
                Email
              </label>
              <div className="col-sm-7">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange("email")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="password" className="col-sm-3 col-form-label">
                Password
              </label>
              <div className="col-sm-7">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange("password")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="contactNumber"
                className="col-sm-3 col-form-label"
              >
                Contact Number
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  id="contactNumber"
                  value={values.contactNumber}
                  onChange={handleChange("contactNumber")}
                  pattern="\d{10}"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="aadharNum" className="col-sm-3 col-form-label">
                Aadhar Number
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="aadharNum"
                  id="aadharNum"
                  value={values.aadharNum}
                  onChange={handleChange("aadharNum")}
                  pattern="\d{12}"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="salary" className="col-sm-3 col-form-label">
                Salary
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="salary"
                  id="salary"
                  value={values.salary}
                  onChange={handleChange("salary")}
                />
              </div>
            </div>

            <div className="d-flex flex-column align-items-center">
              <button type="submit" className="btn btn-primary btn-lg w-75">
                Hire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const performRedirect = () => {
    if (metaData.didRedirect) {
      return <Navigate to="/admin" />;
    }
  };

  return (
    <>
      {performRedirect()}
      {HireTeacherForm()}
    </>
  );
}
