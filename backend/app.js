if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const expressJwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const Joi = require("joi");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "content-type, Authorization");
  next();
});

mongoose
  .connect(process.env.DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((obj) => {
    console.log("Connection Successful");
  })
  .catch((databaseConnectionError) => {
    console.error(databaseConnectionError);
    console.error("DATABASE CONNECTION ERROR");
  });

// S3 BUCKET SETUP
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: process.env.AWS_REGION,
});

// MULTER MIDDLEWARE CONFIGURATION
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      // console.log(file);
      try {
        const uniqueSuffix = req.registrationNumber;
        const fileExtension = file.originalname.split(".")[1];
        const mainFile = file.fieldname.toUpperCase();
        // console.log(mainFile);
        cb(null, mainFile + "_" + uniqueSuffix + "." + fileExtension);
      } catch (error) {
        const err_msg = "S3 UPLOAD FILE RENAMING ERROR";
        console.log(err_msg);
        throw err_msg;
      }
    },
  }),
});

// CONSTANTS
const ROLES = {
  TEACHER: 0,
  ADMIN: 1,
};
const RELIGIONS = ["HINDU", "MOMEDIAN", "OTHER"];
const SEX = ["MALE", "FEMALE", "OTHER"];
const NATIONALITY = ["INDIAN", "NRI", "OTHER"];
const FEESCHEMES = ["1TIMEPAY", "2TIMEPAY", "3TIMEPAY", "OTHER"];
const BLOODGROUPS = ["NA", "A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];

// SCHEMAS
const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  permanentAddr: {
    type: String,
    required: true,
  },
  presentAddr: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    enum: RELIGIONS,
    default: RELIGIONS[0],
  },
  sex: {
    type: String,
    enum: SEX,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  DOA: {
    type: Date,
    default: Date.now(),
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  nationality: {
    type: String,
    enum: NATIONALITY,
    default: NATIONALITY[0],
  },
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  transportChosen: {
    type: Boolean,
    required: true,
  },
  houseDistance: {
    type: Number,
    required: true,
  },
  feesPaid: {
    type: Number,
    required: true,
  },
  feesTotal: {
    type: Number,
    required: true,
  },
  feeScheme: {
    type: String,
    enum: FEESCHEMES,
    required: true,
  },
  discountPercent: {
    type: Number,
    enum: [0.15, 0.1, 0.5, 0],
    required: true,
  },
  fatherQualification: {
    type: String,
    default: "NA",
  },
  fatherProfession: {
    type: String,
    default: "NA",
  },
  fatherPhoto: {
    type: String,
    default: "NA",
  },
  fatherAadhar: {
    type: String,
    default: "NA",
  },
  motherQualification: {
    type: String,
    default: "NA",
  },
  motherProfession: {
    type: String,
    default: "NA",
  },
  motherPhoto: {
    type: String,
    default: "NA",
  },
  motherAadhaar: {
    type: String,
    default: "NA",
  },
  marriageAnniversary: {
    type: Date,
    default: new Date(0),
  },
  childAadhaar: {
    type: String,
    default: "NA",
  },
  childPhoto: {
    type: String,
    default: "NA",
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: BLOODGROUPS,
    default: BLOODGROUPS[0],
  },
  previousSchool: {
    type: String,
    default: "NA",
  },
  termCert: {
    type: String,
    default: "NA",
  },
  charCert: {
    type: String,
    default: "NA",
  },
});

const gradeSchema = new mongoose.Schema({
  gradeName: {
    type: String,
    required: true,
    unique: true,
  },
  maxSectionSize: {
    type: Number,
    required: true,
  },
  studentCnt: {
    type: Number,
    required: true,
  },
  sections: {
    type: Array(String),
    default: [],
  },
  admissionFees: {
    type: Number,
    required: true,
  },
  tutionFees: {
    type: Number,
    required: true,
  },
  latePaymentFine: {
    type: Number,
    required: true,
  },
  furnitureFees: {
    type: Number,
    required: true,
  },
  conveyanceCharges: {
    type: Number,
    required: true,
  },
  examFees: {
    type: Number,
    required: true,
  },
  developmentFees: {
    type: Number,
    required: true,
  },
  computerFees: {
    type: Number,
    required: true,
  },
  totalFixedFees: {
    type: Number,
    required: true,
  },
  baseTransportFee: {
    type: Number,
    required: true,
  },
  baseDist: {
    type: Number,
    required: true,
  },
  offsetTransportFee: {
    type: Number,
    required: true,
  },
  offsetDist: {
    type: Number,
    required: true,
  },
  fixedMonthlyFee: {
    type: Number,
    required: true,
  },
});

const enquirySchema = new mongoose.Schema({
  enquiryDate: {
    type: Date,
    required: true,
  },
  childName: {
    type: String,
    default: "NA",
  },
  DOB: {
    type: Date,
    default: new Date(0),
  },
  gradeName: {
    type: String,
    default: "NA",
  },
  currentSchool: {
    type: String,
    default: "NA",
  },
  currentGrade: {
    type: String,
    default: "NA",
  },
  fatherName: {
    type: String,
    required: true,
  },
  fatherQualification: {
    type: String,
    default: "NA",
  },
  motherName: {
    type: String,
    default: "NA",
  },
  motherQualification: {
    type: String,
    rdefault: "NA",
  },
  occupation: {
    type: String,
    enum: ["BUSINESS", "SERVICE", "OTHER"],
    default: "SERVICE",
  },
  fatherProfession: {
    type: String,
    default: "NA",
  },
  postalAddr: {
    type: String,
    default: "NA",
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid email Id!`,
    },
  },
  encry_password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    enum: [ROLES.TEACHER, ROLES.ADMIN],
  },
  subject: {
    type: Array(String),
    required: true,
    default: [],
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  aadharNum: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
  },
  salary: {
    type: Number,
    required: true,
  },
});

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  present: {
    type: Boolean,
    required: true,
  },
});

// MODELS
const Student = mongoose.model("Student", studentSchema);
const Grade = mongoose.model("Grade", gradeSchema);
const Enquiry = mongoose.model("Enquiry", enquirySchema);
const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

/*UTILITY FUNCTIONS*************************************** */
// Student Admission
const updateGradeInfo = async (grade) => {
  // it updates student cnt by 1, adds a new section if required
  try {
    grade["studentCnt"] = grade["studentCnt"] + 1;
    const sectionSize = grade["maxSectionSize"];
    const studentCnt = grade["studentCnt"];
    if (studentCnt % sectionSize == 1) {
      const sectionName = `${Math.ceil(studentCnt / sectionSize)}`;
      grade["sections"].push(sectionName);
    }

    let updatedGrade = await Grade.findByIdAndUpdate(grade["_id"], grade);
    console.log(updatedGrade);
    return updatedGrade;
  } catch (error) {
    const err_msg = "GRADE UPDATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

const populateSectionRollFees = (req, grade) => {
  try {
    // console.log(grade);
    const sectionSize = grade["maxSectionSize"];
    const studentCnt = grade["studentCnt"] + 1;
    // console.log(sectionSize, studentCnt);
    const sectionName = `${Math.ceil(studentCnt / sectionSize)}`;
    // console.log(studentCnt);

    // CAL TOTAL FEES INCLUDING TRANSPORT FEES IF IT IS OPTED
    let transportFees = 0;
    if (req.body.transportChosen) {
      const { baseTransportFee, baseDist, offsetTransportFee, offsetDist } =
        grade;
      let { houseDistance } = req.body;
      transportFees = baseTransportFee;
      houseDistance -= baseDist;
      if (houseDistance > 0) {
        transportFees +=
          Math.floor(houseDistance / offsetDist) * offsetTransportFee;
      }
    }

    req.body["roll"] = studentCnt;
    req.body["section"] = sectionName;
    req.body["feesTotal"] = grade["totalFixedFees"] + transportFees;

    const { feeScheme } = req.body;
    const { fixedMonthlyFee } = grade;

    // Fees for other feeScheme
    if (feeScheme == "OTHER") {
      req.body["feesTotal"] = fixedMonthlyFee * 12;
    }

    schemeDiscountPercent = {
      "1TIMEPAY": 0.15,
      "2TIMEPAY": 0.1,
      "3TIMEPAY": 0.05,
      OTHER: 0.0,
    };

    // POPULATING DISCOUNT PERCENT
    req.body["discountPercent"] = schemeDiscountPercent[feeScheme];

    // CAL DISCOUNT PERCENT FOR FEES
    req.body["feesTotal"] -=
      req.body["feesTotal"] * schemeDiscountPercent[feeScheme];

    req.body["feesPaid"] = 0;
  } catch (error) {
    console.log(error);
    const err_msg = "ROLL NUM AND SECTION POPULATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

const generateRegistrationNum = (req, res, next) => {
  try {
    // const dt = new Date();
    // const gradeName = parseInt(grade["gradeName"]).toLocaleString("en-IN", {
    //   minimumIntegerDigits: 2,
    // });
    // const studentCnt = (grade["studentCnt"] + 1).toLocaleString("en-IN", {
    //   minimumIntegerDigits: 3,
    // });
    // req.body["registrationNumber"] = dt.getFullYear() + gradeName + studentCnt;
    req["registrationNumber"] = Date.now();
    next();
  } catch (error) {
    const err_msg = "REGISTRATION NUMBER POPULATION ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

const admissionPreprocess = async (req, res, next) => {
  // console.log(req.body);
  const grade = req.body["grade"];
  try {
    let readGrade = await Grade.findOne({ gradeName: grade });
    req.body.readGrade = readGrade;
    // console.log(readGrade);
    if (readGrade) {
      req.body["registrationNumber"] = req.registrationNumber;
      req.body["transportChosen"] = req.body["transportChosen"] ? true : false;
      populateSectionRollFees(req, readGrade);
      next();
    } else {
      res.status(400).send("INVALID GRADE NAME");
    }
  } catch (error) {
    const err_msg = "ADMISSION PREPROCESS ERROR";
    console.log(err_msg);
    throw err_msg;
  }
};

const populateRegistrationNumInReq = (req, res, next) => {
  // console.log(req.body);
  req.registrationNumber = req.params["registrationNumber"];
  next();
};

// TEACHER
const populateTeacherRole = (req, res, next) => {
  req.body.role = ROLES.TEACHER;
  next();
};

// AUTH
const isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "user",
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.cookies["token"]) {
      return req.cookies["token"];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});

async function getImage(imageName) {
  const imageData = s3
    .getObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    })
    .promise();
  return imageData;
}

function encode(data) {
  let buf = Buffer.from(data);
  let base64Data = buf.toString("base64");
  return base64Data;
}

// GRADE
const sumFees = (req, res, next) => {
  try {
    let totalFixedFees = 0;
    totalFixedFees += parseInt(req.body["admissionFees"]);
    totalFixedFees += parseInt(req.body["tutionFees"]);
    totalFixedFees += parseInt(req.body["latePaymentFine"]);
    totalFixedFees += parseInt(req.body["furnitureFees"]);
    totalFixedFees += parseInt(req.body["conveyanceCharges"]);
    totalFixedFees += parseInt(req.body["examFees"]);
    totalFixedFees += parseInt(req.body["developmentFees"]);
    totalFixedFees += parseInt(req.body["computerFees"]);
    req.body["totalFixedFees"] = totalFixedFees;
    next();
  } catch (error) {
    console.log(error);
    console.log("FEES SUM FINDING ERROR");
    res.status(500);
  }
};

/* CONTROLLERS */

// GRADES
const createGradePost = async (req, res) => {
  // VALIDATE THE BODY
  req.body.sections = [];
  req.body.studentCnt = 0;
  // console.log(req.body);
  const newGrade = Grade(req.body);
  try {
    const createdGrade = await newGrade.save();
    res.json(createdGrade);
  } catch (error) {
    console.log(error);
    console.log("GRADE CREATION ERROR");
    res.status(500).send("GRADE CREATION ERROR");
  }
};

const getAllGrades = async (req, res) => {
  const grades = await Grade.find();
  // res.render("allGrades", { grades });
  // console.log(grades);
  res.json(grades);
};

const getGrade = async (req, res) => {
  const { gradeName } = req.params;
  try {
    const grade = await Grade.findOne({ gradeName });
    if (grade) {
      // res.render("gradeInfo", { grade });
      res.json(grade);
    } else {
      res.status(400).send(`Invalid grade Name: ${gradeName}`);
    }
  } catch (error) {
    console.log(error);
    console.log("GRADE FETCHING ERROR");
    res.status(500).send(error);
  }
};

const updateGrade = async (req, res) => {
  const { gradeName } = req.params;

  try {
    const updatedGrade = await Grade.findOneAndUpdate({ gradeName }, req.body, {
      new: true,
    });
    if (updatedGrade) {
      // res.json(updatedGrade);
      res.redirect(`/grade/${gradeName}`);
    } else {
      res.status(400).send(`Invalid Grade Name: ${gradeName}`);
    }
  } catch (error) {
    console.log(error);
    console.log("GRADE UPDATION ERROR");
    res.status(500).send(error);
  }
};
// STUDENT
const createStudent = async (req, res) => {
  // console.log(typeof req.files);

  // populating paths of images
  for (const fieldName in req.files) {
    const file = req.files[fieldName][0];
    req.body[fieldName] = file.location;
  }
  // console.log(req.body);
  let readGrade = req.body["readGrade"];
  delete req.body["readGrade"];

  try {
    const newStudent = new Student(req.body);
    const admittedStudent = await newStudent.save();

    readGrade = await updateGradeInfo(readGrade);

    res.json(admittedStudent);
  } catch (error) {
    console.log(error);
    console.log("STUDENT ADMISSION ERROR");
    res.status(500).send(error);
  }
};

const getAllStudents = async (req, res) => {
  const students = await Student.find();
  // res.render("allStudents", { students });
  res.json(students);
};

const getStudent = async (req, res) => {
  const { registrationNumber } = req.params;
  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      // const grades = await Grade.find();
      // res.render("studentInfo", { student, grades });
      res.json(student);
    } else {
      res
        .status(400)
        .send(`Invalid Registration Number: ${registrationNumber}`);
    }
  } catch (error) {
    console.log(error);
    console.log("STUDENT FETCHING ERROR");
    res.status(500).send(error);
  }
};

const validateStudent = (req, res, next) => {
  const studentValidationSchema = Joi.object({
    studentName: Joi.string().min(3).max(30).required(),
    fatherName: Joi.string().min(3).max(30).required(),
    motherName: Joi.string().min(3).max(30).required(),
    permanentAddr: Joi.string().min(10).max(100).required(),
    presentAddr: Joi.string().min(10).max(100).required(),
    religion: Joi.string()
      .valid(...RELIGIONS)
      .required(),
    sex: Joi.string()
      .valid(...SEX)
      .required(),
    DOB: Joi.date().iso().required(),
    registrationNumber: Joi.number().required(),
    nationality: Joi.string()
      .valid(...NATIONALITY)
      .required(),
    readGrade: Joi.object(),
    grade: Joi.string().required(),
    section: Joi.string().required(),
    roll: Joi.number().required(),
    mobileNumber: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
    transportChosen: Joi.boolean().required(),
    houseDistance: Joi.number().required(),
    feesPaid: Joi.number().required(),
    feesTotal: Joi.number().required(),
    feeScheme: Joi.string()
      .valid(...FEESCHEMES)
      .required(),
    discountPercent: Joi.number().required(),
    fatherQualification: Joi.string().required(),
    fatherProfession: Joi.string().required(),
    fatherPhoto: Joi.string(),
    fatherAadhar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    motherQualification: Joi.string().required(),
    motherProfession: Joi.string().required(),
    motherPhoto: Joi.string(),
    motherAadhaar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    marriageAnniversary: Joi.date().iso().required(),
    childAadhaar: Joi.string().pattern(new RegExp("^[0-9]{12}$")).required(),
    childPhoto: Joi.string(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    bloodGroup: Joi.string()
      .valid(...BLOODGROUPS)
      .required(),
    termCert: Joi.string(),
    charCert: Joi.string(),
  });
  const values = studentValidationSchema.validate(req.body);
  if (values.error) {
    res.status(400).json({ error: values.error.details });
  } else {
    next();
  }
};

const updateStudent = async (req, res) => {
  // res.send("ok");
  const { registrationNumber } = req.params;

  // console.log(req.body);

  // INCASE IMAGE FIELDS ARE NOT POPULATED THE VALUE IS EMPTY STRING,
  // SO WE SHOULD NOT UPDATE THE PREVIOUS VALUE
  const imageFields = [
    "fatherPhoto",
    "motherPhoto",
    "childPhoto",
    "termCert",
    "charCert",
  ];

  for (let field of imageFields) {
    // console.log(field, req.files[field]);
    if (req.files[field]) {
      req.body[field] = req.files[field][0]["location"];
    }
  }

  // res.send("ok");

  // console.log(req.body);

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { registrationNumber },
      req.body,
      { new: true }
    );
    if (updatedStudent) {
      res.json(updatedStudent);
    } else {
      res
        .status(400)
        .send(`Invalid Registration Number: ${registrationNumber}`);
    }
  } catch (error) {
    console.log(error);
    console.log("STUDENT UPDATION ERROR");
    res.status(500).send(error);
  }
};

// Teacher
const getAllTeachers = async (req, res) => {
  const teachers = await User.find({ role: ROLES.TEACHER });
  // res.render("allStudents", { students });
  res.json(teachers);
};

// AUTH
const handleSignup = async (req, res) => {
  // console.log(req.body);
  // console.log(ROLES.ADMIN, ROLES.TEACHER);
  try {
    const salt_rounds = 10;
    const encry_password = await bcrypt.hash(req.body["password"], salt_rounds);
    req.body["encry_password"] = encry_password;
    delete req.body["password"];
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const handleSignin = async (req, res) => {
  // console.log(req.body);
  // res.send("ok");

  // console.log(typeof req.headers.cookie);
  // console.log(req.cookies);

  const { email, password } = req.body;

  // VALIDATE INPUT

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send("user doesn't exists");
    } else if (!(await bcrypt.compare(password, user.encry_password))) {
      res.status(401).send("Incorrect password");
    } else {
      // create a token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const oneDay = 1000 * 60 * 60 * 24;

      res.cookie("token", token, {
        maxAge: oneDay,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      const { _id, uname, email, role } = user;

      res.json({ token, user: { _id, uname, email, role } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const handleSignout = (req, res) => {
  res.clearCookie("token");
  res.json({ messasge: "User signout successfull" });
};

// ATTENDANCE
const findGradeStudents = async (req, res) => {
  const { gradeName } = req.query;
  try {
    const students = await Student.find(
      { grade: gradeName },
      "registrationNumber studentName roll"
    );
    res.json(students);
  } catch (error) {
    console.log(error);
    res.json({ error: "INVALID GRADE NAME" });
  }
};

const handleAttendancePost = async (req, res) => {
  try {
    const { grade, section } = req.body;
    let attendanceData = JSON.parse(req.body.attendanceData);
    // console.log(attendanceData);

    const currentDate = Date.now();
    const attendances = attendanceData.map((aData) => ({
      date: currentDate,
      grade,
      section,
      registrationNumber: aData.registrationNumber,
      present: aData.present,
    }));
    const result = await Attendance.insertMany(attendances);
    res.json({ msg: "Successful", result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "INVALID ATTENDANCE" });
  }
};

/*ROUTES****************************************/
app.get("/", (req, res) => {
  res.send("ok");
});

// GRADE
app
  .route("/createGrade")
  .get(isSignedIn, (req, res) => {
    res.render("createGrade");
  })
  .post(isSignedIn, uploadS3.none(), sumFees, createGradePost);

app.route("/allGrades").get(isSignedIn, getAllGrades);

app
  .route("/grade/:gradeName")
  .get(isSignedIn, getGrade)
  .post(isSignedIn, uploadS3.none(), sumFees, updateGrade);

// STUDENT
const uploadStudentInfo = uploadS3.fields([
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "childPhoto", maxCount: 1 },
  { name: "charCert", maxCount: 1 },
  { name: "termCert", maxCount: 1 },
]);

app
  .route("/admitStudent")
  .get(isSignedIn, async (req, res) => {
    const grades = await Grade.find();
    // console.log(grades);
    res.render("admitStudent", { grades });
  })
  .post(
    isSignedIn,
    generateRegistrationNum,
    uploadStudentInfo,
    admissionPreprocess,
    validateStudent,
    createStudent
  );

app.route("/allStudents").get(isSignedIn, getAllStudents);

app
  .route("/student/:registrationNumber")
  .get(isSignedIn, getStudent)
  .post(
    isSignedIn,
    populateRegistrationNumInReq,
    uploadStudentInfo,
    updateStudent
  );

// FEESSTRUCTURE
app.route("/feesStructure").get(isSignedIn, async (req, res) => {
  // console.log(Object.keys(req));
  // console.log(req.headers.authorization.split(" "));
  const grades = await Grade.find();
  res.render("feesStructure", { grades });
});

// ENQUIRY FORM
app
  .route("/enquiryForm")
  .get(isSignedIn, async (req, res) => {
    const grades = await Grade.find();
    res.render("enquiry", { grades });
  })
  .post(isSignedIn, async (req, res) => {
    console.log(req.body);
    try {
      const newEnquiry = new Enquiry(req.body);
      const savedEnquiry = await newEnquiry.save();
      res.json(savedEnquiry);
    } catch (error) {
      console.log(error);
      console.log("ENQUIRY SAVING ERROR");
      res.status(500).send(error);
    }
  });

// ADMIN DASHBOARD
app.route("/admin").get(isSignedIn, (req, res) => {
  res.render("admin");
});
app.route("/allTeachers").get(isSignedIn, getAllTeachers);

// Teacher Dashboard
// Attendance
app
  .route("/attendance")
  .get(isSignedIn, findGradeStudents)
  .post(isSignedIn, uploadS3.none(), handleAttendancePost);

app
  .route("/attendanceStudents/:grade/:section")
  .get(isSignedIn, async (req, res) => {
    // VALIDATION of params using regex is left
    const { grade, section } = req.params;
    // console.log(grade, section);
    const students = await Student.find({ grade, section });
    res.json(students);
  })
  .post(isSignedIn, uploadS3.none(), async (req, res) => {
    const { grade, section } = req.params;
    // validate incoming info
    const { students } = req.body;
    for (let i = 0; i < students.length; i++) {
      students[i].section = section;
    }
    try {
      const attendanceRecords = await Attendance.insertMany(students);
      res.json(attendanceRecords);
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });

// WEBSITE USER
app
  .route("/hireTeacher")
  .post(uploadS3.none(), populateTeacherRole, handleSignup);

app
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(uploadS3.none(), handleSignin);

app.route("/signout").get(handleSignout);

// app
//   .route("/test")
//   .get((req, res) => {
//     res.render("test");
//   })
//   .post(isSignedIn, uploadStudentInfo, (req, res) => {
//     console.log(req.files);
//     console.log(req.body);
//     res.json({ result: "ok" });
//   });
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

/*
email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      try {
        const uniqueSuffix = req.registrationNumber;
        const fileExtension = file.originalname.split(".")[1];
        const mainFile = file.fieldname.toUpperCase();
        // console.log(mainFile);
        cb(null, mainFile + "_" + uniqueSuffix + "." + fileExtension);
      } catch (error) {
        const err_msg = "S3 UPLOAD FILE RENAMING ERROR";
        console.log(err_msg);
        throw err_msg;
      }
    },
  }),
});

const testMulter = upload.fields([
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "childPhoto", maxCount: 1 },
  { name: "charCert", maxCount: 1 },
  { name: "termCert", maxCount: 1 },
]);



// { dest: "uploads/" }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(file.fieldName);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({
  storage,
  key: function (req, file, cb) {
    try {
      const uniqueSuffix = req.registrationNumber;
      const fileExtension = file.originalname.split(".")[1];
      const mainFile = file.fieldname.toUpperCase();
      // console.log(mainFile);
      cb(null, mainFile + "_" + uniqueSuffix + "." + fileExtension);
    } catch (error) {
      const err_msg = "S3 UPLOAD FILE RENAMING ERROR";
      console.log(err_msg);
      throw err_msg;
    }
  },
});
const testMulter = upload.fields([
  { name: "fatherPhoto", maxCount: 1 },
  { name: "motherPhoto", maxCount: 1 },
  { name: "childPhoto", maxCount: 1 },
  { name: "charCert", maxCount: 1 },
  { name: "termCert", maxCount: 1 },
]);
const testMulter2 = upload.fields([
  { name: "myp", maxCount: 1 },
  { name: "fatherPhoto", maxCount: 1 },
]);

*/
