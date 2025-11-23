import React, { useState, useEffect } from "react";

import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Send,
  Trophy,
  XCircle,
  Loader2,
  Target,
  Award,
  Home,
} from "lucide-react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const TakeExam = () => {
  // Estado para identificação do aluno (em produção viria de autenticação)

  const [studentId, setStudentId] = useState(null);

  const [student, setStudent] = useState(null);

  // Estados para seleção de aluno (temporário - para demonstração)

  const [allStudents, setAllStudents] = useState([]);

  const [showStudentSelector, setShowStudentSelector] = useState(true);

  // Estados principais

  const [availableExams, setAvailableExams] = useState([]);

  const [selectedExam, setSelectedExam] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState(null);

  const [startTime, setStartTime] = useState(null);

  const [timeElapsed, setTimeElapsed] = useState(0);

  // Carregar lista de alunos (apenas para demonstração)

  useEffect(() => {
    if (showStudentSelector) {
      loadStudents();
    }
  }, [showStudentSelector]);

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/`);

      if (!response.ok) throw new Error("Erro ao carregar alunos");

      const data = await response.json();

      setAllStudents(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    }
  };

  const selectStudent = async (studentData) => {
    setStudentId(studentData.id_student);

    setStudent(studentData);

    setShowStudentSelector(false);
  };

  // Carregar provas disponíveis quando aluno é selecionado

  useEffect(() => {
    if (studentId && student) {
      loadAvailableExams();
    }
  }, [studentId, student]);

  // Timer

  useEffect(() => {
    let interval;

    if (startTime && !submitted) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, submitted]);

  const loadAvailableExams = async () => {
    try {
      setLoading(true);

      setError(null);

      if (!student.id_class) {
        setError("Você não está matriculado em nenhuma turma");

        setLoading(false);

        return;
      }

      // Buscar aplicações de provas para a turma do aluno

      const response = await fetch(
        `${API_BASE_URL}/exam-applications/?id_class=${student.id_class}&status=in_progress`
      );

      if (!response.ok) throw new Error("Erro ao carregar provas disponíveis");

      const data = await response.json();

      const applications = Array.isArray(data) ? data : data.results || [];

      // Filtrar apenas aplicações em andamento ou agendadas

      const available = applications.filter(
        (app) => app.status === "in_progress" || app.status === "scheduled"
      );

      setAvailableExams(available);
    } catch (err) {
      console.error("Erro:", err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async (application) => {
    try {
      setLoading(true);

      setError(null);

      // Verificar se aluno já fez esta prova

      const resultsResponse = await fetch(
        `${API_BASE_URL}/exam-results/?id_student=${studentId}&id_exam_application=${application.id}`
      );

      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();

        const results = Array.isArray(resultsData)
          ? resultsData
          : resultsData.results || [];

        if (results.length > 0) {
          alert("Você já realizou esta prova!");

          setLoading(false);

          return;
        }
      }

      // Buscar questões da prova

      const questionsResponse = await fetch(
        `${API_BASE_URL}/exams/${application.id_exam}/questions/`
      );

      if (!questionsResponse.ok) throw new Error("Erro ao carregar questões");

      const questionsData = await questionsResponse.json();

      setQuestions(questionsData);

      setSelectedExam(application);

      setStartTime(Date.now());

      setCurrentQuestionIndex(0);

      setAnswers({});
    } catch (err) {
      console.error("Erro:", err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, alternativeId) => {
    setAnswers((prev) => ({
      ...prev,

      [questionId]: alternativeId,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const submitExam = async () => {
    if (
      !window.confirm(
        `Você respondeu ${Object.keys(answers).length} de ${
          questions.length
        } questões.\n\nDeseja realmente enviar a prova? Essa ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      setError(null);

      // Preparar dados para envio

      const answersArray = questions.map((question) => ({
        id_question: question.id,

        id_selected_alternative: answers[question.id] || null,

        answer_text: "",
      }));

      const payload = {
        id_student: studentId,

        id_exam_application: selectedExam.id,

        answers: answersArray,
      };

      // Enviar respostas

      const response = await fetch(
        `${API_BASE_URL}/student-answers/bulk_create/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Erro ao enviar respostas");
      }

      const responseData = await response.json();

      // Buscar resultado

      const resultResponse = await fetch(
        `${API_BASE_URL}/exam-results/?id_student=${studentId}&id_exam_application=${selectedExam.id}`
      );

      if (resultResponse.ok) {
        const resultData = await resultResponse.json();

        const results = Array.isArray(resultData)
          ? resultData
          : resultData.results || [];

        setResult(results[0] || null);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar:", err);

      setError(err.message);

      alert("Erro ao enviar a prova: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetExam = () => {
    setSelectedExam(null);

    setQuestions([]);

    setAnswers({});

    setCurrentQuestionIndex(0);

    setSubmitted(false);

    setResult(null);

    setStartTime(null);

    setTimeElapsed(0);

    loadAvailableExams();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Renderizar seletor de aluno (temporário)

  if (showStudentSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Fazer Prova
              </h1>

              <p className="text-gray-600">Selecione seu nome para começar</p>
            </div>

            <div className="space-y-3">
              {allStudents.map((studentData) => (
                <button
                  key={studentData.id_student}
                  onClick={() => selectStudent(studentData)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {studentData.student_name?.charAt(0) || "?"}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {studentData.student_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Matrícula: {studentData.student_serial}
                      </p>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            {allStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />

                <p>Nenhum aluno cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tela de resultado

  if (submitted && result) {
    const percentage =
      result.max_score > 0
        ? ((result.total_score / result.max_score) * 100).toFixed(1)
        : 0;

    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header de sucesso */}

            <div
              className={`text-center mb-8 p-6 rounded-lg ${
                passed ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              {passed ? (
                <Trophy className="w-20 h-20 text-green-600 mx-auto mb-4" />
              ) : (
                <Award className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
              )}

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {passed ? "Parabéns!" : "Prova Concluída!"}
              </h1>

              <p className="text-gray-600">Sua prova foi enviada com sucesso</p>
            </div>

            {/* Estatísticas */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {percentage}%
                </div>

                <div className="text-sm text-gray-600">Aproveitamento</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {result.correct_answers}
                </div>

                <div className="text-sm text-gray-600">Acertos</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {result.wrong_answers}
                </div>

                <div className="text-sm text-gray-600">Erros</div>
              </div>
            </div>

            {/* Detalhes */}

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Detalhes da Prova
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nota:</span>

                  <span className="font-semibold ml-2">
                    {result.total_score} / {result.max_score}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Tempo:</span>

                  <span className="font-semibold ml-2">
                    {formatTime(timeElapsed)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Questões respondidas:</span>

                  <span className="font-semibold ml-2">
                    {Object.keys(answers).length} / {questions.length}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Status:</span>

                  <span
                    className={`font-semibold ml-2 ${
                      passed ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {passed ? "Aprovado" : "Necessita Reforço"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões */}

            <div className="flex gap-4">
              <button
                onClick={resetExam}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Ver Outras Provas
              </button>

              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela fazendo a prova

  if (selectedExam && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    const totalQuestions = questions.length;

    const answeredCount = Object.keys(answers).length;

    const progress = (answeredCount / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header fixo */}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {selectedExam.exam_name}
                </h1>

                <p className="text-gray-600">{student.student_name}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="w-5 h-5" />

                    <span className="font-bold text-xl">
                      {formatTime(timeElapsed)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">Tempo decorrido</div>
                </div>
              </div>
            </div>

            {/* Barra de progresso */}

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>

                <span>
                  {answeredCount} de {totalQuestions} questões
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navegação de questões */}

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-40">
                <h3 className="font-bold text-gray-800 mb-3">Questões</h3>

                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;

                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(idx)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          isCurrent
                            ? "bg-blue-600 text-white shadow-lg scale-110"
                            : isAnswered
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Questão atual */}

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      Questão {currentQuestionIndex + 1} de {totalQuestions}
                    </span>

                    {currentQuestion.difficulty_level && (
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          currentQuestion.difficulty_level === "easy"
                            ? "bg-green-100 text-green-800"
                            : currentQuestion.difficulty_level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {currentQuestion.difficulty_level === "easy" && "Fácil"}

                        {currentQuestion.difficulty_level === "medium" &&
                          "Médio"}

                        {currentQuestion.difficulty_level === "hard" &&
                          "Difícil"}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentQuestion.question_text}
                  </h2>

                  {currentQuestion.descriptor_name && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />

                        <div>
                          <div className="text-sm font-semibold text-purple-900">
                            Descritor: {currentQuestion.descriptor_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alternativas */}

                <div className="space-y-3 mb-8">
                  {currentQuestion.alternatives &&
                    currentQuestion.alternatives.map((alt) => {
                      const isSelected = answers[currentQuestion.id] === alt.id;

                      return (
                        <button
                          key={alt.id}
                          onClick={() =>
                            handleAnswerSelect(currentQuestion.id, alt.id)
                          }
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "bg-blue-50 border-blue-500 shadow-md"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>

                            <div className="flex-1">
                              <span className="font-semibold text-gray-700 mr-2">
                                {alt.alternative_letter})
                              </span>

                              <span className="text-gray-800">
                                {alt.alternative_text}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>

                {/* Navegação */}

                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>

                  <div className="flex gap-2">
                    {currentQuestionIndex === totalQuestions - 1 ? (
                      <button
                        onClick={submitExam}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Enviar Prova
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={goToNextQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Próxima
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de seleção de prova

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Provas Disponíveis
              </h1>

              <p className="text-gray-600">
                Olá, {student?.student_name}! Selecione uma prova para começar.
              </p>
            </div>

            <button
              onClick={() => setShowStudentSelector(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Trocar Aluno
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro</h2>

            <p className="text-gray-600 mb-6">{error}</p>

            <button
              onClick={loadAvailableExams}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : availableExams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma prova disponível
            </h2>

            <p className="text-gray-600">
              Não há provas liberadas para você no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => startExam(exam)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      exam.status === "in_progress"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {exam.status === "in_progress"
                      ? "Em Andamento"
                      : "Agendada"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {exam.exam_name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(exam.application_date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>

                  {exam.start_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />

                      <span>
                        {exam.start_time} - {exam.end_time || "Sem limite"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    startExam(exam);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <BookOpen className="w-5 h-5" />
                  Iniciar Prova
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
