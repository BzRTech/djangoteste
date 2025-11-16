import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DescriptorCatalog from "./pages/DescriptorCatalog";
import AdminCRUD from "./pages/AdminCRUD";
import ExamsManagement from "./pages/ExamsManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="descriptors" element={<DescriptorCatalog />} />
          <Route path="admin" element={<AdminCRUD />} />
          <Route path="exams" element={<ExamsManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
