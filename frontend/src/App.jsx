import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FiltrosProvider } from "./contexts/FiltrosContext";
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

// Secretaria de Educacao Pages
import {
  VisaoGeral,
  Desempenho,
  FluxoEscolar,
  Frequencia,
  CorpoDocente,
  Infraestrutura,
  Financeiro,
  PerfilAlunos,
  EscolaDetalhe,
} from "./pages/secretaria";

function App() {
  return (
    <ThemeProvider>
      <FiltrosProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/secretaria" replace />} />

              {/* Secretaria de Educacao Routes */}
              <Route path="secretaria" element={<VisaoGeral />} />
              <Route path="secretaria/desempenho" element={<Desempenho />} />
              <Route path="secretaria/fluxo" element={<FluxoEscolar />} />
              <Route path="secretaria/frequencia" element={<Frequencia />} />
              <Route path="secretaria/professores" element={<CorpoDocente />} />
              <Route path="secretaria/infraestrutura" element={<Infraestrutura />} />
              <Route path="secretaria/financeiro" element={<Financeiro />} />
              <Route path="secretaria/alunos" element={<PerfilAlunos />} />
              <Route path="secretaria/escola/:id" element={<EscolaDetalhe />} />

              {/* School System Routes */}
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
      </FiltrosProvider>
    </ThemeProvider>
  );
}

export default App;
