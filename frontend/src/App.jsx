import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DescriptorCatalog from "./pages/DescriptorCatalog";
import AdminCRUD from "./pages/AdminCRUD";
import ExamsManagement from "./pages/ExamsManagement";
import ExamImport from "./pages/ExamImport";
import StudentProfile from "./pages/StudentProfile";
import StudentAnswers from "./pages/StudentAnswers";
import TakeExam from "./pages/TakeExam";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="descriptors" element={<DescriptorCatalog />} />
            <Route path="admin" element={<AdminCRUD />} />
            <Route path="exams" element={<ExamsManagement />} />
            <Route path="exam-import" element={<ExamImport />} />
            <Route path="student/:id" element={<StudentProfile />} />
            <Route path="student-answers" element={<StudentAnswers />} />
            <Route path="take-exam" element={<TakeExam />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
