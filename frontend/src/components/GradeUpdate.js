import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchData, postData, API, getToken } from "../helper";

export default function GradeUpdate() {
  const { gradeName } = useParams();
  const [values, setValues] = useState({
    gradeName: "",
    maxSectionSize: "",
    admissionFees: "",
    tutionFees: "",
    latePaymentFine: "",
    furnitureFees: "",
    conveyanceCharges: "",
    developmentFees: "",
    computerFees: "",
    examFees: "",
    baseTransportFee: "",
    baseDist: "",
    offsetTransportFee: "",
    offsetDist: "",
    fixedMonthlyFee: "",
  });

  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });

  async function fetchGrade() {
    setMetaData({ ...metaData, loading: true });
    const URL = API + `/grade/${gradeName}`;
    const token = getToken();
    const grade = await fetchData(URL, token);
    setMetaData({ ...metaData, loading: false });
    setValues({
      ...values,
      gradeName: grade.gradeName,
      maxSectionSize: grade.maxSectionSize,
      admissionFees: grade.admissionFees,
      tutionFees: grade.tutionFees,
      latePaymentFine: grade.latePaymentFine,
      furnitureFees: grade.furnitureFees,
      conveyanceCharges: grade.conveyanceCharges,
      developmentFees: grade.developmentFees,
      computerFees: grade.computerFees,
      examFees: grade.examFees,
      baseTransportFee: grade.baseTransportFee,
      baseDist: grade.baseDist,
      offsetTransportFee: grade.offsetTransportFee,
      offsetDist: grade.offsetDist,
      fixedMonthlyFee: grade.fixedMonthlyFee,
    });
  }

  useEffect(() => {
    fetchGrade();
  }, []);

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

      const URL = API + `/grade/${gradeName}`;
      const token = getToken();

      const result = await postData(URL, token, multipartBody);
      console.log(result);
      setValues({
        gradeName: "",
        maxSectionSize: "",
        admissionFees: "",
        tutionFees: "",
        latePaymentFine: "",
        furnitureFees: "",
        conveyanceCharges: "",
        developmentFees: "",
        computerFees: "",
        examFees: "",
        baseTransportFee: "",
        baseDist: "",
        offsetTransportFee: "",
        offsetDist: "",
        fixedMonthlyFee: "",
      });
      setMetaData({ ...metaData, didRedirect: true, loading: false });
    } catch (error) {
      setMetaData({ ...metaData, error: error, loading: false });
      console.log(error);
    }
  };

  const updateGradeForm = () => (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <h1 className="mt-5">Grade Updation Form</h1>
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label htmlFor="gradeName" className="col-sm-3 col-form-label">
                Grade Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="gradeName"
                  id="gradeName"
                  value={values.gradeName}
                  onChange={handleChange("gradeName")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="maxSectionSize"
                className="col-sm-3 col-form-label"
              >
                Section Size
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="maxSectionSize"
                  id="maxSectionSize"
                  value={values.maxSectionSize}
                  onChange={handleChange("maxSectionSize")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="admissionFees"
                className="col-sm-3 col-form-label"
              >
                Admission Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="admissionFees"
                  id="admissionFees"
                  value={values.admissionFees}
                  onChange={handleChange("admissionFees")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="tutionFees" className="col-sm-3 col-form-label">
                Tution Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="tutionFees"
                  id="tutionFees"
                  value={values.tutionFees}
                  onChange={handleChange("tutionFees")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="latePaymentFine"
                className="col-sm-3 col-form-label"
              >
                Late Payment Fine
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="latePaymentFine"
                  id="latePaymentFine"
                  value={values.latePaymentFine}
                  onChange={handleChange("latePaymentFine")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="furnitureFees"
                className="col-sm-3 col-form-label"
              >
                Furniture Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="furnitureFees"
                  id="furnitureFees"
                  value={values.furnitureFees}
                  onChange={handleChange("furnitureFees")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="conveyanceCharges"
                className="col-sm-3 col-form-label"
              >
                Conveyance Charges
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="conveyanceCharges"
                  id="conveyanceCharges"
                  value={values.conveyanceCharges}
                  onChange={handleChange("conveyanceCharges")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="developmentFees"
                className="col-sm-3 col-form-label"
              >
                Development Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="developmentFees"
                  id="developmentFees"
                  value={values.developmentFees}
                  onChange={handleChange("developmentFees")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="computerFees" className="col-sm-3 col-form-label">
                Computer Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="computerFees"
                  id="computerFees"
                  value={values.computerFees}
                  onChange={handleChange("computerFees")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="examFees" className="col-sm-3 col-form-label">
                Exam Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="examFees"
                  id="examFees"
                  value={values.examFees}
                  onChange={handleChange("examFees")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="baseTransportFee"
                className="col-sm-3 col-form-label"
              >
                Base Transport Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="baseTransportFee"
                  id="baseTransportFee"
                  value={values.baseTransportFee}
                  onChange={handleChange("baseTransportFee")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="baseDist" className="col-sm-3 col-form-label">
                Base Distance
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="baseDist"
                  id="baseDist"
                  value={values.baseDist}
                  onChange={handleChange("baseDist")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="offsetTransportFee"
                className="col-sm-3 col-form-label"
              >
                Offset Transport Fee
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="offsetTransportFee"
                  id="offsetTransportFee"
                  value={values.offsetTransportFee}
                  onChange={handleChange("offsetTransportFee")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="offsetDist" className="col-sm-3 col-form-label">
                Offset Distance
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="offsetDist"
                  id="offsetDist"
                  value={values.offsetDist}
                  onChange={handleChange("offsetDist")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="fixedMonthlyFee"
                className="col-sm-3 col-form-label"
              >
                Fixed Monthly Fee
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="fixedMonthlyFee"
                  id="fixedMonthlyFee"
                  value={values.fixedMonthlyFee}
                  onChange={handleChange("fixedMonthlyFee")}
                />
              </div>
            </div>

            <div className="d-flex flex-column align-items-center">
              <button type="submit" className="btn btn-primary btn-lg w-75">
                Update
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
      {updateGradeForm()}
    </>
  );
}
