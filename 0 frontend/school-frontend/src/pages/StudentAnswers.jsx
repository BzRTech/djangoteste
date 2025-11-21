import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Target,
  Calendar,
  School,
  BookOpen,
  Award,
  TrendingUp,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const StudentAnswers = () => {
  const [examApplications, setExamApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [descriptors, setDescriptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStudent, setFilterStudent] = useState("");
  const [filterCorrect, setFilterCorrect] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Carregar aplicações de provas
  useEffect(() => {
    const loadExamApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/exam-applications/`);
        if (!response.ok) throw new Error("Erro ao carregar aplicações");
        const data = await response.json();
        setExamApplications(data);
        setError(null);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExamApplications();
  }, []);

  // Carregar respostas quando uma aplicação é selecionada
  useEffect(() => {
    if (!selectedApplication) return;

    const loadAnswersAndData = async () => {
      try {
        setLoading(true);

        // Carregar respostas dos alunos para esta aplicação
        const answersResponse = await fetch(
          `${API_BASE_URL}/student-answers/?id_exam_application=${selectedApplication.id}`
        );
        if (!answersResponse.ok) throw new Error("Erro ao carregar respostas");
        const answersData = await answersResponse.json();
        setStudentAnswers(answersData);

        // Carregar questões da prova
        const questionsResponse = await fetch(
          `${API_BASE_URL}/exams/${selectedApplication.id_exam}/questions/`
        );
        if (!questionsResponse.ok) throw new Error("Erro ao carregar questões");
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Carregar alunos
        const studentsResponse = await fetch(`${API_BASE_URL}/students/`);
        if (!studentsResponse.ok) throw new Error("Erro ao carregar alunos");
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);

        // Carregar descritores
        const descriptorsResponse = await fetch(`${API_BASE_URL}/descriptors/`);
        if (!descriptorsResponse.ok) throw new Error("Erro ao carregar descritores");
        const descriptorsData = await descriptorsResponse.json();
        setDescriptors(descriptorsData);

        setError(null);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnswersAndData();
  }, [selectedApplication]);

  // Agrupar respostas por aluno
  const getStudentGroups = () => {
    const groups = {};

    studentAnswers.forEach((answer) => {
      if (!groups[answer.id_student]) {
        groups[answer.id_student] = [];
      }
      groups[answer.id_student].push(answer);
    });

    return groups;
  };

  // Obter dados do aluno
  const getStudent = (studentId) => {
    return students.find((s) => s.id === studentId) || {};
  };

  // Obter dados da questão
  const getQuestion = (questionId) => {
    return questions.find((q) => q.id === questionId) || {};
  };

  // Obter dados do descritor
  const getDescriptor = (descriptorId) => {
    return descriptors.find((d) => d.id === descriptorId) || {};
  };

  // Calcular estatísticas do aluno
  const getStudentStats = (studentId) => {
    const answers = studentAnswers.filter((a) => a.id_student === studentId);
    const correct = answers.filter((a) => a.is_correct).length;
    const total = answers.length;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

    // Descritores conquistados (questões corretas)
    const achievedDescriptors = new Set();
    answers.forEach((answer) => {
      if (answer.is_correct) {
        const question = getQuestion(answer.id_question);
        if (question.id_descriptor) {
          achievedDescriptors.add(question.id_descriptor);
        }
      }
    });

    return {
      correct,
      total,
      percentage,
      wrong: total - correct,
      achievedDescriptors: achievedDescriptors.size,
    };
  };

  // Renderizar card de aplicação de prova
  const renderApplicationCard = (application) => (
    <div
      key={application.id}
      onClick={() => setSelectedApplication(application)}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {application.exam_title || `Prova #${application.id_exam}`}
            </h3>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4" />
              <span>{application.class_name || "Turma não especificada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(application.application_date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {application.students_count || 0} alunos realizaram
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );

  // Renderizar lista de alunos com suas estatísticas
  const renderStudentsList = () => {
    const studentGroups = getStudentGroups();
    const studentIds = Object.keys(studentGroups);

    // Filtrar alunos
    let filteredIds = studentIds;
    if (filterStudent) {
      filteredIds = filteredIds.filter((id) => {
        const student = getStudent(parseInt(id));
        return student.name?.toLowerCase().includes(filterStudent.toLowerCase());
      });
    }

    if (filterCorrect !== "all") {
      filteredIds = filteredIds.filter((id) => {
        const stats = getStudentStats(parseInt(id));
        if (filterCorrect === "good") return parseFloat(stats.percentage) >= 70;
        if (filterCorrect === "medium")
          return parseFloat(stats.percentage) >= 50 && parseFloat(stats.percentage) < 70;
        if (filterCorrect === "poor") return parseFloat(stats.percentage) < 50;
        return true;
      });
    }

    return (
      <div className="space-y-4">
        {filteredIds.map((studentId) => {
          const student = getStudent(parseInt(studentId));
          const stats = getStudentStats(parseInt(studentId));
          const isSelected = selectedStudent === parseInt(studentId);

          return (
            <div
              key={studentId}
              onClick={() => setSelectedStudent(parseInt(studentId))}
              className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                isSelected ? "border-blue-500" : "border-transparent hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{student.name || "Aluno"}</h4>
                    <p className="text-sm text-gray-500">
                      Matrícula: {student.serial_number || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.percentage}%</div>
                    <div className="text-xs text-gray-500">Aproveitamento</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">{stats.correct}</span>
                    </div>
                    <div className="text-xs text-gray-500">Acertos</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">{stats.wrong}</span>
                    </div>
                    <div className="text-xs text-gray-500">Erros</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-purple-600">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">{stats.achievedDescriptors}</span>
                    </div>
                    <div className="text-xs text-gray-500">Descritores</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar respostas detalhadas de um aluno
  const renderStudentAnswers = () => {
    if (!selectedStudent) return null;

    const student = getStudent(selectedStudent);
    const answers = studentAnswers.filter((a) => a.id_student === selectedStudent);
    const stats = getStudentStats(selectedStudent);

    // Ordenar por número da questão
    const sortedAnswers = [...answers].sort((a, b) => {
      const qA = getQuestion(a.id_question);
      const qB = getQuestion(b.id_question);
      return (qA.question_number || 0) - (qB.question_number || 0);
    });

    return (
      <div className="space-y-6">
        {/* Header do aluno */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm">
                {student.name?.charAt(0) || "?"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name || "Aluno"}</h2>
                <p className="text-blue-100">Matrícula: {student.serial_number || "N/A"}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{stats.percentage}%</div>
              <div className="text-blue-100">
                {stats.correct} de {stats.total} questões
              </div>
            </div>
          </div>
        </div>

        {/* Resumo de descritores conquistados */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Descritores Conquistados
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAnswers
              .filter((answer) => answer.is_correct)
              .map((answer) => {
                const question = getQuestion(answer.id_question);
                const descriptor = getDescriptor(question.id_descriptor);

                if (!descriptor.id) return null;

                return (
                  <div
                    key={answer.id}
                    className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-green-800">
                        {descriptor.descriptor_code || "N/A"} - Q{question.question_number}
                      </div>
                      <div className="text-sm text-gray-700">
                        {descriptor.descriptor_name || "Descritor não especificado"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {descriptor.descriptor_description || ""}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {sortedAnswers.filter((a) => a.is_correct).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhum descritor conquistado nesta prova
            </p>
          )}
        </div>

        {/* Lista de respostas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Respostas Detalhadas
            </h3>
          </div>
          <div className="space-y-4">
            {sortedAnswers.map((answer) => {
              const question = getQuestion(answer.id_question);
              const descriptor = getDescriptor(question.id_descriptor);

              return (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border-2 ${
                    answer.is_correct
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {answer.is_correct ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          Questão {question.question_number || "N/A"}
                        </h4>
                        {descriptor.id && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                            {descriptor.descriptor_code}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {question.question_text || "Texto da questão não disponível"}
                      </p>
                      {descriptor.id && (
                        <div className="text-xs text-gray-600 mb-2">
                          <strong>Descritor:</strong> {descriptor.descriptor_name}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-gray-600">
                          <strong>Resposta correta:</strong>{" "}
                          {question.correct_answer || "N/A"}
                        </div>
                        {answer.id_selected_alternative && (
                          <div className="text-gray-600">
                            <strong>Resposta do aluno:</strong> Alternativa{" "}
                            {answer.id_selected_alternative}
                          </div>
                        )}
                        {answer.answer_text && (
                          <div className="text-gray-600">
                            <strong>Resposta dissertativa:</strong> {answer.answer_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !selectedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando aplicações...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Visualização principal - lista de aplicações
  if (!selectedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Respostas dos Alunos
            </h1>
            <p className="text-gray-600">
              Selecione uma aplicação de prova para ver as respostas e descritores
              conquistados
            </p>
          </div>

          {/* Lista de aplicações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examApplications.map(renderApplicationCard)}
          </div>

          {examApplications.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma aplicação de prova encontrada</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Visualização de uma aplicação específica
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão de voltar */}
        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedApplication(null);
              setSelectedStudent(null);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
            <span>Voltar para aplicações</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {selectedApplication.exam_title || `Prova #${selectedApplication.id_exam}`}
          </h1>
          <p className="text-gray-600">
            {selectedApplication.class_name} -{" "}
            {new Date(selectedApplication.application_date).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da esquerda - Lista de alunos */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar aluno..."
                    value={filterStudent}
                    onChange={(e) => setFilterStudent(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterCorrect}
                    onChange={(e) => setFilterCorrect(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="good">Bom (≥70%)</option>
                    <option value="medium">Médio (50-69%)</option>
                    <option value="poor">Baixo (&lt;50%)</option>
                  </select>
                </div>
              </div>
              {renderStudentsList()}
            </div>

            {/* Coluna da direita - Respostas detalhadas */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                renderStudentAnswers()
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Selecione um aluno para ver suas respostas
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnswers;
