import React from "react";
import About from "./components/About";
import AllStudents from "./components/AllStudents";
import AllGrades from "./components/AllGrades";
import Admin from "./components/Admin";
import AdmitStudent from "./components/AdmitStudent";
import AddGrade from "./components/AddGrade";
import StudentUpdate from "./components/StudentUpdate";
import GradeUpdate from "./components/GradeUpdate";
import FeeStructure from "./components/FeeStructure";
import Signin from "./components/Signin";
import Signout from "./components/Signout";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Teacher from "./components/Teacher";
import HireTeacher from "./components/HireTeacher";
import AllTeachers from "./components/AllTeachers";
import Attendance from "./components/Attendance";
import ValidationCheckComp from "./components/ValidationCheckComp";
import AttendanceView from "./components/AttendanceView";
// import Test from "./components/Test";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/allStudents" element={<AllStudents />} />
        <Route path="/allGrades" element={<AllGrades />} />
        <Route path="/admitStudent" element={<AdmitStudent />} />
        <Route path="/hireTeacher" element={<HireTeacher />} />
        <Route path="/allTeachers" element={<AllTeachers />} />
        <Route path="/addGrade" element={<AddGrade />} />
        <Route
          path="/student/:registrationNumber"
          element={<StudentUpdate />}
        />
        <Route path="/grade/:gradeName" element={<GradeUpdate />} />
        <Route path="/feeStructure" element={<FeeStructure />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendanceView" element={<AttendanceView />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/test" element={<ValidationCheckComp />} />
      </Routes>
    </Router>
  );
}
