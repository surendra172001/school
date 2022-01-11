import React, { useState, useEffect } from "react";
import { fetchData, postData, API, getToken } from "../helper";
import { useParams, Navigate } from "react-router-dom";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";

// Yup.addMethod(Yup.string, "stripEmptyString", function () {
//   return this.transform((value) => (value === "" ? undefined : value));
// });

// const validationSchema = Yup.object().shape({
//   studentName: Yup.string()
//     .required("Student Name is required")
//     .min(3, "Student Name must be atleast 3 characters")
//     .max(50, "Student Name can't exceed 50 characters"),
//   fatherName: Yup.string()
//     .required("Father Name is required")
//     .min(3, "Father Name must be atleast 3 characters")
//     .max(50, "Father Name can't exceed 50 characters"),
//   motherName: Yup.string()
//     .required("Mother Name is required")
//     .min(3, "Mother Name must be atleast 3 characters")
//     .max(50, "Mother Name can't exceed 50 characters"),
//   presentAddr: Yup.string()
//     .required("Present address is required")
//     .min(10, "Present address must be atleast 3 characters")
//     .max(100, "Present address can't exceed 100 characters"),
//   permanentAddr: Yup.string()
//     .min(10, "Permanent address must be atleast 3 characters")
//     .max(100, "Permanent address can't exceed 100 characters"),
//   religion: Yup.string().required("Religion Name is required").oneOf(RELIGIONS),
//   sex: Yup.string().required("Gender is required").oneOf(SEX),
//   DOB: Yup.date().required("Date Of Birth is required"),
//   nationality: Yup.string()
//     .required("Nationality is required")
//     .oneOf(NATIONALITY),
//   grade: Yup.string().required("Grade Name is required"),
//   mobileNumber: Yup.string()
//     .required("Mobile Number is required")
//     .matches(/^\d{10}$/, "Invalid mobile number"),
//   transportChosen: Yup.boolean(),
//   houseDistance: Yup.number()
//     .required("house distance is required")
//     .min(0, "House distance cannot be negative")
//     .max(50, "House distance must be less than 50km"),
//   feeScheme: Yup.string().required("Fee Scheme is required").oneOf(FEESCHEMES),
//   fatherQualification: Yup.string().stripEmptyString().default("NA"),
//   fatherProfession: Yup.string().stripEmptyString().default("NA"),
//   fatherAadhar: Yup.string()
//     .required("Father Aadhar Number is required")
//     .matches(/^\d{12}$/, "Invalid aadhar number"),
//   motherQualification: Yup.string().stripEmptyString().default("NA"),
//   motherProfession: Yup.string().stripEmptyString().default("NA"),
//   motherAadhaar: Yup.string()
//     .required("Mother Aadhar Number is required")
//     .matches(/^\d{12}$/, "Invalid aadhar number"),
//   marriageAnniversary: Yup.date(),
//   childAadhaar: Yup.string()
//     .required("Child Aadhar Number is required")
//     .matches(/^\d{12}$/, "Invalid aadhar number"),
//   height: Yup.number()
//     .required("Height is required")
//     .min(2, "Child height must be atleast 2 feets")
//     .max(7, "Invalid Height"),
//   weight: Yup.number()
//     .required("Weight is required")
//     .min(20, "Invalid weight")
//     .max(100, "Invalid weight"),
//   bloodGroup: Yup.string().oneOf(BLOODGROUPS),
// });

export default function StudentUpdate() {
  const { registrationNumber } = useParams();
  const [grades, setGrades] = useState([]);
  const [values, setValues] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    permanentAddr: "",
    presentAddr: "",
    religion: "HINDU",
    sex: "MALE",
    DOB: "",
    DOA: "",
    registrationNumber: "",
    nationality: "INDIAN",
    grade: "1",
    roll: "",
    mobileNumber: "",
    transportChosen: false,
    houseDistance: "",
    feeScheme: "1TIMEPAY", // enum
    fatherQualification: "",
    fatherProfession: "",
    fatherPhoto: React.createRef(),
    fatherAadhar: "", // file
    motherQualification: "",
    motherProfession: "",
    motherPhoto: React.createRef(), // file
    motherAadhaar: "",
    marriageAnniversary: "",
    childAadhaar: "",
    childPhoto: React.createRef(),
    height: "",
    weight: "",
    bloodGroup: "",
    previousSchool: "",
    termCert: React.createRef(),
    charCert: React.createRef(),
  });
  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });
  const [imageFields, setImageFields] = useState({
    termCert: "",
    charCert: "",
    childPhoto: "",
    fatherPhoto: "",
    motherPhoto: "",
  });

  async function fetchGrades() {
    const URL = API + "/allGrades";
    const token = getToken();
    const data = await fetchData(URL, token);
    setGrades(data);
  }

  async function fetchStudent() {
    try {
      const token = getToken();
      const URL = `http://localhost:8000/student/${registrationNumber}`;
      const data = await fetchData(URL, token);
      setValues({
        ...values,
        studentName: data.studentName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        permanentAddr: data.permanentAddr,
        presentAddr: data.presentAddr,
        religion: data.religion,
        sex: data.sex,
        DOB: data.DOB,
        registrationNumber: data.registrationNumber,
        nationality: data.nationality,
        grade: data.grade,
        roll: data.roll,
        mobileNumber: data.mobileNumber,
        transportChosen: data.transportChosen,
        houseDistance: data.houseDistance,
        feeScheme: data.feeScheme, // enum
        fatherQualification: data.fatherQualification,
        fatherProfession: data.fatherProfession,
        fatherAadhar: data.fatherAadhar, // file
        motherQualification: data.motherQualification,
        motherProfession: data.motherProfession,
        motherAadhaar: data.motherAadhaar,
        marriageAnniversary: data.marriageAnniversary,
        childAadhaar: data.childAadhaar,
        height: data.height,
        weight: data.weight,
        bloodGroup: data.bloodGroup,
        previousSchool: data.previousSchool,
      });
      setImageFields({
        termCert: data.termCert,
        charCert: data.charCert,
        childPhoto: data.childPhoto,
        fatherPhoto: data.fatherPhoto,
        motherPhoto: data.motherPhoto,
      });
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  function getGradeOptionList() {
    return grades.map((grade, idx) => (
      <option key={idx} value={grade.gradeName}>
        {grade.gradeName}
      </option>
    ));
  }

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
      // console.log(values);
      // console.log(values["fatherPhoto"].current.files[0]);
      const formBody = { ...values };
      const imgFieldNames = [
        "fatherPhoto",
        "childPhoto",
        "motherPhoto",
        "charCert",
        "termCert",
      ];

      // console.log(formBody);
      for (let fieldName of imgFieldNames) {
        formBody[fieldName] = formBody[fieldName].current.files[0];
      }
      const multipartBody = new FormData();
      for (const fieldName in formBody) {
        if (formBody[fieldName]) {
          multipartBody.set(fieldName, formBody[fieldName]);
        }
      }

      const URL = API + `/student/${registrationNumber}`;
      const token = getToken();

      const result = await postData(URL, token, multipartBody);
      console.log(result);
      setValues({
        ...values,
        studentName: "",
        fatherName: "",
        motherName: "",
        permanentAddr: "",
        presentAddr: "",
        religion: "HINDU",
        sex: "MALE",
        DOB: "",
        DOA: "",
        registrationNumber: "",
        nationality: "INDIAN",
        grade: "1",
        roll: "",
        mobileNumber: "",
        transportChosen: false,
        houseDistance: "",
        feeScheme: "1TIMEPAY", // enum
        fatherQualification: "",
        fatherProfession: "",
        fatherAadhar: "", // file
        motherQualification: "",
        motherProfession: "",
        motherAadhaar: "",
        marriageAnniversary: "",
        childAadhaar: "",
        height: "",
        weight: "",
        bloodGroup: "",
        previousSchool: "",
      });
      setMetaData({ ...metaData, loading: false, didRedirect: true });
    } catch (error) {
      setMetaData({ ...metaData, loading: false, error: error });
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchStudent();
  }, []);

  const loadingScreen = () => (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
  const renderImage = (imageUrl) => {
    const imageComp = (
      <img key={imageUrl} src={imageUrl} style={{ height: 300, width: 300 }} />
    );

    const imgNotAvailabe = <p>Image not uploaded yet</p>;

    return (
      <div className="d-flex justify-content-center align-items-center">
        {imageUrl != "NA" ? imageComp : imgNotAvailabe}
      </div>
    );
  };

  const imageList = () => (
    <div className="border border-danger border-5 my-5 p-5 w-100 rounded">
      <div className="row">
        {renderImage(imageFields.fatherPhoto)}
        {renderImage(imageFields.termCert)}
        {renderImage(imageFields.charCert)}
        {renderImage(imageFields.childPhoto)}
        {renderImage(imageFields.motherPhoto)}
      </div>
    </div>
  );

  const performRedirect = () => {
    if (metaData.didRedirect) {
      return <Navigate to="/admin" />;
    }
  };

  const StudentUpdateForm = () => (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <h1 className="mt-5">Student Info Update</h1>
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <form
            action="/admitStudent"
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="row mb-3">
              <label htmlFor="studentName" className="col-sm-3 col-form-label">
                Student Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="studentName"
                  id="studentName"
                  value={values.studentName}
                  onChange={handleChange("studentName")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="fatherName" className="col-sm-3 col-form-label">
                Father Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="fatherName"
                  id="fatherName"
                  value={values.fatherName}
                  onChange={handleChange("fatherName")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="motherName" className="col-sm-3 col-form-label">
                Mother Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="motherName"
                  id="motherName"
                  value={values.motherName}
                  onChange={handleChange("motherName")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="presentAddr" className="col-sm-3 col-form-label">
                Present Address
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="presentAddr"
                  id="presentAddr"
                  value={values.presentAddr}
                  onChange={handleChange("presentAddr")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="permanentAddr"
                className="col-sm-3 col-form-label"
              >
                Permanent Address
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="permanentAddr"
                  id="permanentAddr"
                  value={values.permanentAddr}
                  onChange={handleChange("permanentAddr")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="religion" className="col-sm-3 col-form-label">
                Religion
              </label>
              <div className="col-sm-7">
                <select
                  className="form-control"
                  id="religion"
                  name="religion"
                  value={values.religion}
                  onChange={handleChange("religion")}
                >
                  <option value="HINDU">HINDU</option>
                  <option value="MOMEDIAN">MOMEDIAN</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="sex" className="col-sm-3 col-form-label">
                Gender
              </label>
              <div className="col-sm-7">
                <select
                  className="form-control"
                  id="sex"
                  name="sex"
                  value={values.sex}
                  onChange={handleChange("sex")}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="DOB" className="col-sm-3 col-form-label">
                Date of Birth
              </label>
              <div className="col-sm-7">
                <input
                  type="date"
                  className="form-control"
                  name="DOB"
                  id="DOB"
                  value={values.DOB.split("T")[0]}
                  onChange={handleChange("DOB")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="nationality" className="col-sm-3 col-form-label">
                Nationality
              </label>
              <div className="col-sm-7">
                <select
                  className="form-control"
                  id="nationality"
                  name="nationality"
                  value={values.nationality}
                  onChange={handleChange("nationality")}
                >
                  <option value="INDIAN">Indian</option>
                  <option value="NRI">NRI</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="grade" className="col-sm-3 col-form-label">
                Grade
              </label>
              <div className="col-sm-7">
                <select
                  className="form-control"
                  id="grade"
                  name="grade"
                  value={values.grade}
                  onChange={handleChange("grade")}
                >
                  {getGradeOptionList()}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="mobileNumber" className="col-sm-3 col-form-label">
                Mobile Number
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="mobileNumber"
                  id="mobileNumber"
                  value={values.mobileNumber}
                  onChange={handleChange("mobileNumber")}
                  pattern="\d{10}"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="transportChosen"
                className="col-sm-3 col-form-label"
              >
                Transport Opted
              </label>
              <div className="col-sm-7">
                <input
                  type="checkbox"
                  className="form-check-input w-25 h-100"
                  name="transportChosen"
                  id="transportChosen"
                  checked={values.transportChosen}
                  onChange={handleChange("transportChosen")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="houseDistance"
                className="col-sm-3 col-form-label"
              >
                House Distance(in Km)
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="houseDistance"
                  id="houseDistance"
                  value={values.houseDistance}
                  onChange={handleChange("houseDistance")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="feeScheme" className="col-sm-3 col-form-label">
                Fee Scheme
              </label>
              <div className="col-sm-7">
                <select
                  className="form-control"
                  id="feeScheme"
                  name="feeScheme"
                  value={values.feeScheme}
                  onChange={handleChange("feeScheme")}
                >
                  <option value="1TIMEPAY">1 Time Pay</option>
                  <option value="2TIMEPAY">2 Time Pay</option>
                  <option value="3TIMEPAY">3 Time Pay</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="fatherQualification"
                className="col-sm-3 col-form-label"
              >
                Father Qualification
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="fatherQualification"
                  id="fatherQualification"
                  value={values.fatherQualification}
                  onChange={handleChange("fatherQualification")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="fatherProfession"
                className="col-sm-3 col-form-label"
              >
                Father Profession
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="fatherProfession"
                  id="fatherProfession"
                  value={values.fatherProfession}
                  onChange={handleChange("fatherProfession")}
                />
              </div>
            </div>
            {renderImage(imageFields.fatherPhoto)}

            <div className="row mb-3">
              <label htmlFor="fatherPhoto" className="col-sm-3 col-form-label">
                Father Photo
              </label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className="form-control"
                  name="fatherPhoto"
                  id="fatherPhoto"
                  ref={values.fatherPhoto}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="fatherAadhar" className="col-sm-3 col-form-label">
                Father Aadhar
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="fatherAadhar"
                  id="fatherAadhar"
                  value={values.fatherAadhar}
                  onChange={handleChange("fatherAadhar")}
                  pattern="\d{12}"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="motherQualification"
                className="col-sm-3 col-form-label"
              >
                Mother Qualification
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="motherQualification"
                  id="motherQualification"
                  value={values.motherQualification}
                  onChange={handleChange("motherQualification")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="motherProfession"
                className="col-sm-3 col-form-label"
              >
                Mother Profession
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="motherProfession"
                  id="motherProfession"
                  value={values.motherProfession}
                  onChange={handleChange("motherProfession")}
                />
              </div>
            </div>
            {renderImage(imageFields.motherPhoto)}
            <div className="row mb-3">
              <label htmlFor="fatherPhoto" className="col-sm-3 col-form-label">
                Mother Photo
              </label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className="form-control"
                  name="motherPhoto"
                  id="motherPhoto"
                  ref={values.motherPhoto}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="motherAadhaar"
                className="col-sm-3 col-form-label"
              >
                Mother Aadhaar
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="motherAadhaar"
                  id="motherAadhaar"
                  value={values.motherAadhaar}
                  onChange={handleChange("motherAadhaar")}
                  pattern="\d{12}"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="marriageAnniversary"
                className="col-sm-3 col-form-label"
              >
                Marriage Anniversary
              </label>
              <div className="col-sm-7">
                <input
                  type="date"
                  className="form-control"
                  name="marriageAnniversary"
                  id="marriageAnniversary"
                  value={values.marriageAnniversary.split("T")[0]}
                  onChange={handleChange("marriageAnniversary")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="childAadhaar" className="col-sm-3 col-form-label">
                Child Aadhaar
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="childAadhaar"
                  id="childAadhaar"
                  value={values.childAadhaar}
                  onChange={handleChange("childAadhaar")}
                />
              </div>
            </div>
            {renderImage(imageFields.childPhoto)}
            <div className="row mb-3">
              <label htmlFor="childPhoto" className="col-sm-3 col-form-label">
                Child Photo
              </label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className="form-control"
                  name="childPhoto"
                  id="childPhoto"
                  ref={values.childPhoto}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="height" className="col-sm-3 col-form-label">
                Child Height(in feet)
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="height"
                  id="height"
                  value={values.height}
                  onChange={handleChange("height")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="weight" className="col-sm-3 col-form-label">
                Child Weight(in Kg)
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="weight"
                  id="weight"
                  value={values.weight}
                  onChange={handleChange("weight")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="bloodGroup" className="col-sm-3 col-form-label">
                Child Blood Group
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="bloodGroup"
                  id="bloodGroup"
                  value={values.bloodGroup}
                  onChange={handleChange("bloodGroup")}
                />
              </div>
            </div>
            {renderImage(imageFields.termCert)}
            <div className="row mb-3">
              <label htmlFor="termCert" className="col-sm-3 col-form-label">
                Termination Certificate
              </label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className="form-control"
                  name="termCert"
                  id="termCert"
                  ref={values.termCert}
                />
              </div>
            </div>
            {renderImage(imageFields.charCert)}
            <div className="row mb-3">
              <label htmlFor="charCert" className="col-sm-3 col-form-label">
                Character Certificate
              </label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className="form-control"
                  name="charCert"
                  id="charCert"
                  ref={values.charCert}
                />
              </div>
            </div>
            <div className="d-flex flex-column align-items-center">
              <button type="submit" className="btn btn-primary btn-lg w-50">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {performRedirect()}
      {StudentUpdateForm()}
    </>
  );
}
