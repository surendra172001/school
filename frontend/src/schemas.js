import Joi from "joi";

export const studentValidationSchema = Joi.object({
  studentName: Joi.string().min(3).max(30).required(),
  fatherName: Joi.string().min(3).max(30).required(),
  motherName: Joi.string().min(3).max(30).required(),
  permanentAddr: Joi.string().min(10).max(60).required(),
  presentAddr: Joi.string().min(10).max(60).required(),
  religion: Joi.string()
    .valid(...RELIGIONS)
    .required(),
  sex: Joi.string()
    .valid(...SEX)
    .required(),
  DOB: Joi.date().iso().required(),
  DOA: Joi.date().iso().required(),
  registrationNumber: Joi.string().required(),
  nationality: Joi.string()
    .valid(...NATIONALITY)
    .required(),
  grade: Joi.string().required(),
  section: Joi.string().required(),
  roll: Joi.number().required(),
  mobileNumber: Joi.string().pattern(new RegExp("^d{10}$")).required(),
  transportChosen: Joi.boolean().required(),
  houseDistance: Joi.number().required(),
  feesPaid: Joi.number().required(),
  feesPaid: Joi.number().required(),
  feeScheme: Joi.string()
    .valid(...FEESCHEMES)
    .required(),
  discountPercent: Joi.number().required(),
  fatherQualification: Joi.string().required(),
  fatherProfession: Joi.string().required(),
  fatherPhoto: Joi.string().required(),
  fatherAadhar: Joi.string().pattern(new RegExp("^d{12}$")).required(),
  motherQualification: Joi.string().required(),
  motherProfession: Joi.string().required(),
  motherPhoto: Joi.string().required(),
  motherAadhaar: Joi.string().pattern(new RegExp("^d{12}$")).required(),
  marriageAnniversary: Joi.date().iso().required(),
  childAadhaar: Joi.string().pattern(new RegExp("^d{12}$")).required(),
  childPhoto: Joi.string().required(),
  height: Joi.number().required(),
  weight: Joi.number().required(),
  bloodGroup: Joi.string()
    .valid(...FEESCHEMES)
    .required(),
  previousSchool: Joi.string().min(3).max(30).required(),
  termCert: Joi.string().required(),
  charCert: Joi.string().required(),
});
