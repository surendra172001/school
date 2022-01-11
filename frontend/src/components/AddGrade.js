import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData, API, getToken } from "../helper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const initialValues = {
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
};

const validationSchema = Yup.object().shape({
  gradeName: Yup.string()
    .required("Grade Name is required")
    .min(1, "Grade Name must be atleast 1 characters")
    .max(4, "Grade Name can't exceed 4 characters"),
  maxSectionSize: Yup.number()
    .required("Section size is required")
    .min(1, "Father Name must be atleast 3 characters"),
  admissionFees: Yup.number()
    .required("Admission Fees is required")
    .min(1, "Admission Fees atleast 1"),
  tutionFees: Yup.number()
    .required("Tution Fees is required")
    .min(1, "Tution Fees atleast 1"),
  latePaymentFine: Yup.number()
    .required("Late Payment Fine is required")
    .min(1, "Late Payment Fine should be atleast 1"),
  furnitureFees: Yup.number()
    .required("Furniture Fees Fine is required")
    .min(1, "Furniture Fees should be atleast 1"),
  conveyanceCharges: Yup.number()
    .required("Conveyance Charges Fine is required")
    .min(1, "Conveyance Charges should be atleast 1"),
  developmentFees: Yup.number()
    .required("Development Fees is required")
    .min(1, "Development Fees should be atleast 1"),
  computerFees: Yup.number()
    .required("Computer Fees is required")
    .min(1, "Computer Fees should be atleast 1"),
  examFees: Yup.number()
    .required("Exam Fees is required")
    .min(1, "Exam Fees should be atleast 1"),
  baseTransportFee: Yup.number()
    .required("Base Transport Fee is required")
    .min(1, "Base Transport Fee should be atleast 1"),
  baseDist: Yup.number()
    .required("Base Dist is required")
    .min(1, "Base Dist should be atleast 1"),
  offsetTransportFee: Yup.number()
    .required("Offset Transport Fee is required")
    .min(1, "Offset Transport Fee should be atleast 1"),
  offsetDist: Yup.number()
    .required("Offset Dist is required")
    .min(1, "Offset Dist should be atleast 1"),
  fixedMonthlyFee: Yup.number()
    .required("Fixed Monthly Fee is required")
    .min(1, "Fixed Monthly Fee should be atleast 1"),
});

export default function AddGrade() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  let navigate = useNavigate();

  const [metaData, setMetaData] = useState({
    didRedirect: false,
    loading: false,
    error: "",
  });

  const onSubmit = async (values) => {
    setMetaData({ ...metaData, loading: true });
    try {
      const formBody = { ...values };

      const multipartBody = new FormData();
      for (const fieldName in formBody) {
        if (formBody[fieldName]) {
          multipartBody.set(fieldName, formBody[fieldName]);
        }
      }

      const URL = API + "/createGrade";

      const token = getToken();

      const result = await postData(URL, token, multipartBody);
      navigate("/admin");
      console.log(result);
      setMetaData({ ...metaData, didRedirect: true, loading: false });
    } catch (error) {
      setMetaData({ ...metaData, error: error, loading: false });
      console.log(error);
    }
  };

  const createGradeForm = () => (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <h1 className="mt-5">Grade Creation Form</h1>
      <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
        <div className="container d-flex flex-column">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <label htmlFor="gradeName" className="col-sm-3 col-form-label">
                Grade Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  {...register("gradeName")}
                />
              </div>
              {errors.gradeName && (
                <span className="alert alert-danger">
                  {errors.gradeName.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("maxSectionSize")}
                />
              </div>
              {errors.maxSectionSize && (
                <span className="alert alert-danger">
                  {errors.maxSectionSize.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("admissionFees")}
                />
              </div>
              {errors.admissionFees && (
                <span className="alert alert-danger">
                  {errors.admissionFees.message}
                </span>
              )}
            </div>
            <div className="row mb-3">
              <label htmlFor="tutionFees" className="col-sm-3 col-form-label">
                Tution Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  name="tutionFees"
                  {...register("tutionFees")}
                />
              </div>
              {errors.tutionFees && (
                <span className="alert alert-danger">
                  {errors.tutionFees.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("latePaymentFine")}
                />
              </div>
              {errors.latePaymentFine && (
                <span className="alert alert-danger">
                  {errors.latePaymentFine.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("furnitureFees")}
                />
              </div>
              {errors.furnitureFees && (
                <span className="alert alert-danger">
                  {errors.furnitureFees.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("conveyanceCharges")}
                />
              </div>
              {errors.conveyanceCharges && (
                <span className="alert alert-danger">
                  {errors.conveyanceCharges.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("developmentFees")}
                />
              </div>
              {errors.developmentFees && (
                <span className="alert alert-danger">
                  {errors.developmentFees.message}
                </span>
              )}
            </div>

            <div className="row mb-3">
              <label htmlFor="computerFees" className="col-sm-3 col-form-label">
                Computer Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  {...register("computerFees")}
                />
              </div>
              {errors.computerFees && (
                <span className="alert alert-danger">
                  {errors.computerFees.message}
                </span>
              )}
            </div>

            <div className="row mb-3">
              <label htmlFor="examFees" className="col-sm-3 col-form-label">
                Exam Fees
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  {...register("examFees")}
                />
              </div>
              {errors.examFees && (
                <span className="alert alert-danger">
                  {errors.examFees.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("baseTransportFee")}
                />
              </div>
              {errors.baseTransportFee && (
                <span className="alert alert-danger">
                  {errors.baseTransportFee.message}
                </span>
              )}
            </div>
            <div className="row mb-3">
              <label htmlFor="baseDist" className="col-sm-3 col-form-label">
                Base Distance
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  {...register("baseDist")}
                />
              </div>
              {errors.baseDist && (
                <span className="alert alert-danger">
                  {errors.baseDist.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  {...register("offsetTransportFee")}
                />
              </div>
              {errors.offsetTransportFee && (
                <span className="alert alert-danger">
                  {errors.offsetTransportFee.message}
                </span>
              )}
            </div>
            <div className="row mb-3">
              <label htmlFor="offsetDist" className="col-sm-3 col-form-label">
                Offset Distance
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  name="offsetDist"
                  {...register("offsetDist")}
                />
              </div>
              {errors.offsetDist && (
                <span className="alert alert-danger">
                  {errors.offsetDist.message}
                </span>
              )}
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
                  type="number"
                  className="form-control"
                  name="fixedMonthlyFee"
                  {...register("fixedMonthlyFee")}
                />
              </div>
              {errors.fixedMonthlyFee && (
                <span className="alert alert-danger">
                  {errors.fixedMonthlyFee.message}
                </span>
              )}
            </div>

            <div className="d-flex flex-column align-items-center">
              <button type="submit" className="btn btn-primary btn-lg w-75">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createGradeForm();
}
