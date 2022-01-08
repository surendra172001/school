import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  API,
  BLOODGROUPS,
  FEESCHEMES,
  fetchData,
  getToken,
  NATIONALITY,
  postData,
  RELIGIONS,
  SEX,
} from "../helper";

Yup.addMethod(Yup.string, "stripEmptyString", function () {
  return this.transform((value) => (value === "" ? undefined : value));
});

const validationSchema = Yup.object().shape({
  studentName: Yup.string()
    .required("Student Name is required")
    .min(3, "Student Name must be atleast 3 characters")
    .max(50, "Student Name can't exceed 50 characters"),
  fatherName: Yup.string()
    .required("Father Name is required")
    .min(3, "Father Name must be atleast 3 characters")
    .max(50, "Father Name can't exceed 50 characters"),
  motherName: Yup.string()
    .required("Mother Name is required")
    .min(3, "Mother Name must be atleast 3 characters")
    .max(50, "Mother Name can't exceed 50 characters"),
  presentAddr: Yup.string()
    .required("Present address is required")
    .min(10, "Present address must be atleast 3 characters")
    .max(100, "Present address can't exceed 100 characters"),
  permanentAddr: Yup.string()
    .min(10, "Permanent address must be atleast 3 characters")
    .max(100, "Permanent address can't exceed 100 characters"),
  religion: Yup.string().required("Religion Name is required").oneOf(RELIGIONS),
  sex: Yup.string().required("Gender is required").oneOf(SEX),
  DOB: Yup.date().required("Date Of Birth is required"),
  nationality: Yup.string()
    .required("Nationality is required")
    .oneOf(NATIONALITY),
  grade: Yup.string().required("Grade Name is required"),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Invalid mobile number"),
  transportChosen: Yup.boolean(),
  houseDistance: Yup.number()
    .required("house distance is required")
    .min(0, "House distance cannot be negative")
    .max(50, "House distance must be less than 50km"),
  feeScheme: Yup.string().required("Fee Scheme is required").oneOf(FEESCHEMES),
  fatherQualification: Yup.string().stripEmptyString().default("NA"),
  fatherProfession: Yup.string().stripEmptyString().default("NA"),
  fatherAadhar: Yup.string()
    .required("Father Aadhar Number is required")
    .matches(/^\d{12}$/, "Invalid aadhar number"),
  motherQualification: Yup.string().stripEmptyString().default("NA"),
  motherProfession: Yup.string().stripEmptyString().default("NA"),
  motherAadhaar: Yup.string()
    .required("Mother Aadhar Number is required")
    .matches(/^\d{12}$/, "Invalid aadhar number"),
  marriageAnniversary: Yup.date(),
  childAadhaar: Yup.string()
    .required("Child Aadhar Number is required")
    .matches(/^\d{12}$/, "Invalid aadhar number"),
  height: Yup.number()
    .required("Height is required")
    .min(2, "Child height must be atleast 2 feets")
    .max(7, "Invalid Height"),
  weight: Yup.number()
    .required("Weight is required")
    .min(20, "Invalid weight")
    .max(100, "Invalid weight"),
  bloodGroup: Yup.string().oneOf(BLOODGROUPS),
});

const initialValues = {
  studentName: "Narendra Pandey",
  fatherName: "Anuruddhaprasad Pandey",
  motherName: "Nilam Pandey",
  presentAddr:
    "Lokmanya chawl, Hanuman nagar, Kandivali - east, Mumbai -400101",
  permanentAddr:
    "Lokmanya chawl, Hanuman nagar, Kandivali - east, Mumbai -400101",
  religion: "HINDU",
  sex: "MALE",
  DOB: "2021-12-23",
  registrationNumber: "1640238437336",
  nationality: "INDIAN",
  grade: "1",
  mobileNumber: "9137423018",
  transportChosen: true,
  houseDistance: "10.0",
  feeScheme: "1TIMEPAY", // enum
  fatherQualification: "BA",
  fatherProfession: "Farmer",
  fatherAadhar: "935147677222", // file
  motherQualification: "NA",
  motherProfession: "NA",
  motherAadhaar: "935147677222",
  marriageAnniversary: "2021-12-23",
  childAadhaar: "935147677222",
  height: "5",
  weight: "30",
  bloodGroup: "A+",
};

export default function AdmitStudent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const [grades, setGrades] = useState([]);

  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
  });

  async function fetchGrades() {
    setMetaData({ ...metaData, loading: true });
    const URL = API + "/allGrades";
    const token = getToken();
    const data = await fetchData(URL, token);
    setGrades(data);
    setMetaData({ ...metaData, loading: false });
  }

  useEffect(() => {
    fetchGrades();
  }, []);

  function getGradeOptionList() {
    return grades.map((grade, idx) => (
      <option key={idx} value={grade.gradeName}>
        {grade.gradeName}
      </option>
    ));
  }

  const onSubmit = async (values) => {
    setMetaData({ ...metaData, loading: true });
    try {
      const formBody = { ...values };
      formBody["DOB"] = formBody["DOB"].toISOString();
      formBody["marriageAnniversary"] =
        formBody["marriageAnniversary"].toISOString();
      const imgFieldNames = [
        "fatherPhoto",
        "childPhoto",
        "motherPhoto",
        "charCert",
        "termCert",
      ];

      for (let fieldName of imgFieldNames) {
        formBody[fieldName] = formBody[fieldName][0];
      }

      const multipartBody = new FormData();
      for (const fieldName in formBody) {
        if (formBody[fieldName]) {
          multipartBody.set(fieldName, formBody[fieldName]);
        }
      }

      const URL = API + "/admitStudent";

      const token = getToken();

      const result = await postData(URL, token, multipartBody);

      console.log(result);
      setMetaData({ ...metaData, loading: false, didRedirect: true });
    } catch (error) {
      console.log("ERROR");
      setMetaData({ ...metaData, loading: false, error: error });
      // console.log(error);
    }
  };

  const admissionForm = () => {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column">
        <h1 className="mt-5">Student Admission </h1>
        <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
          <div className="container d-flex flex-column">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Student Name</label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("studentName")}
                  />
                </div>
                {errors.studentName && (
                  <span className="alert alert-danger">
                    {errors.studentName.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="DOB" className="col-sm-3 col-form-label">
                  Date Of Birth
                </label>
                <div className="col-sm-7">
                  <input
                    type="date"
                    className="form-control"
                    {...register("DOB")}
                  />
                </div>
                {errors.DOB && (
                  <span className="alert alert-danger">
                    {errors.DOB.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Father Name</label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("fatherName")}
                  />
                </div>
                {errors.fatherName && (
                  <span className="alert alert-danger">
                    {errors.fatherName.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="motherName" className="col-sm-3 col-form-label">
                  Mother Name
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("motherName")}
                  />
                </div>
                {errors.motherName && (
                  <span className="alert alert-danger">
                    {errors.motherName.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="presentAddr"
                  className="col-sm-3 col-form-label"
                >
                  Present Address
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("presentAddr")}
                  />
                </div>
                {errors.presentAddr && (
                  <span className="alert alert-danger">
                    {errors.presentAddr.message}
                  </span>
                )}
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
                    {...register("permanentAddr")}
                  />
                </div>
                {errors.permanentAddr && (
                  <span className="alert alert-danger">
                    {errors.permanentAddr.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="grade" className="col-sm-3 col-form-label">
                  Grade
                </label>
                <div className="col-sm-7">
                  <select
                    className="form-control"
                    id="grade"
                    {...register("grade")}
                  >
                    {getGradeOptionList()}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="mobileNumber"
                  className="col-sm-3 col-form-label"
                >
                  Mobile Number
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("mobileNumber")}
                  />
                </div>
                {errors.mobileNumber && (
                  <span className="alert alert-danger">
                    {errors.mobileNumber.message}
                  </span>
                )}
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
                    {...register("transportChosen")}
                  />
                </div>
                {errors.transportChosen && (
                  <span className="alert alert-danger">
                    {errors.transportChosen.message}
                  </span>
                )}
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
                    type="number"
                    className="form-control"
                    {...register("houseDistance")}
                  />
                </div>
                {errors.houseDistance && (
                  <span className="alert alert-danger">
                    {errors.houseDistance.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="feeScheme" className="col-sm-3 col-form-label">
                  Fee Scheme
                </label>
                <div className="col-sm-7">
                  <select
                    className="form-control"
                    id="feeScheme"
                    {...register("feeScheme")}
                  >
                    <option value="1TIMEPAY">1 Time Pay</option>
                    <option value="2TIMEPAY">2 Time Pay</option>
                    <option value="3TIMEPAY">3 Time Pay</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                {errors.feeScheme && (
                  <span className="alert alert-danger">
                    {errors.feeScheme.message}
                  </span>
                )}
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
                    {...register("fatherQualification")}
                  />
                </div>
                {errors.fatherQualification && (
                  <span className="alert alert-danger">
                    {errors.fatherQualification.message}
                  </span>
                )}
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
                    {...register("fatherProfession")}
                  />
                </div>
                {errors.fatherProfession && (
                  <span className="alert alert-danger">
                    {errors.fatherProfession.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="fatherAadhar"
                  className="col-sm-3 col-form-label"
                >
                  Father Aadhar
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("fatherAadhar")}
                  />
                </div>
                {errors.fatherAadhar && (
                  <span className="alert alert-danger">
                    {errors.fatherAadhar.message}
                  </span>
                )}
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
                    {...register("motherQualification")}
                  />
                </div>
                {errors.motherQualification && (
                  <span className="alert alert-danger">
                    {errors.motherQualification.message}
                  </span>
                )}
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
                    {...register("motherProfession")}
                  />
                </div>
                {errors.motherProfession && (
                  <span className="alert alert-danger">
                    {errors.motherProfession.message}
                  </span>
                )}
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
                    {...register("motherAadhaar")}
                  />
                </div>
                {errors.motherAadhaar && (
                  <span className="alert alert-danger">
                    {errors.motherAadhaar.message}
                  </span>
                )}
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
                    {...register("marriageAnniversary")}
                  />
                </div>
                {errors.marriageAnniversary && (
                  <span className="alert alert-danger">
                    {errors.marriageAnniversary.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="childAadhaar"
                  className="col-sm-3 col-form-label"
                >
                  Child Aadhaar
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    {...register("childAadhaar")}
                  />
                </div>
                {errors.childAadhaar && (
                  <span className="alert alert-danger">
                    {errors.childAadhaar.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="height" className="col-sm-3 col-form-label">
                  Child Height(in feet)
                </label>
                <div className="col-sm-7">
                  <input
                    type="number"
                    className="form-control"
                    {...register("height")}
                  />
                </div>
                {errors.height && (
                  <span className="alert alert-danger">
                    {errors.height.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="weight" className="col-sm-3 col-form-label">
                  Child Weight(in Kg)
                </label>
                <div className="col-sm-7">
                  <input
                    type="number"
                    className="form-control"
                    {...register("weight")}
                  />
                </div>
                {errors.weight && (
                  <span className="alert alert-danger">
                    {errors.weight.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="bloodGroup" className="col-sm-3 col-form-label">
                  Child Blood Group
                </label>
                <div className="col-sm-7">
                  <select
                    className="form-control"
                    id="bloodGroup"
                    {...register("bloodGroup")}
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                {errors.bloodGroup && (
                  <span className="alert alert-danger">
                    {errors.bloodGroup.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="fatherPhoto"
                  className="col-sm-3 col-form-label"
                >
                  Father Photo
                </label>
                <div className="col-sm-7">
                  <input
                    type="file"
                    className="form-control"
                    {...register("fatherPhoto")}
                  />
                </div>
                {errors.fatherPhoto && (
                  <span className="alert alert-danger">
                    {errors.fatherPhoto.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="motherPhoto"
                  className="col-sm-3 col-form-label"
                >
                  Mother Photo
                </label>
                <div className="col-sm-7">
                  <input
                    type="file"
                    className="form-control"
                    {...register("motherPhoto")}
                  />
                </div>
                {errors.motherPhoto && (
                  <span className="alert alert-danger">
                    {errors.motherPhoto.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="childPhoto" className="col-sm-3 col-form-label">
                  Child Photo
                </label>
                <div className="col-sm-7">
                  <input
                    type="file"
                    className="form-control"
                    {...register("childPhoto")}
                  />
                </div>
                {errors.childPhoto && (
                  <span className="alert alert-danger">
                    {errors.childPhoto.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="termCert" className="col-sm-3 col-form-label">
                  Termination Certificate
                </label>
                <div className="col-sm-7">
                  <input
                    type="file"
                    className="form-control"
                    {...register("termCert")}
                  />
                </div>
                {errors.termCert && (
                  <span className="alert alert-danger">
                    {errors.termCert.message}
                  </span>
                )}
              </div>
              <div className="row mb-3">
                <label htmlFor="charCert" className="col-sm-3 col-form-label">
                  Character Certificate
                </label>
                <div className="col-sm-7">
                  <input
                    type="file"
                    className="form-control"
                    {...register("charCert")}
                  />
                </div>
                {errors.charCert && (
                  <span className="alert alert-danger">
                    {errors.charCert.message}
                  </span>
                )}
              </div>
              <div className="d-flex flex-column align-items-center">
                <button type="submit" className="btn btn-primary btn-lg w-50">
                  Admit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const performRedirect = () => {
    if (metaData.didRedirect) {
      return <Navigate to="/admin" />;
    }
  };

  if (metaData.loading) {
    return Loading();
  } else {
    return (
      <>
        {performRedirect()}
        {admissionForm()}
      </>
    );
  }
}
