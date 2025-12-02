import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  List,
  Users,
  Loader2,
} from "lucide-react";
import Loading from "../components/Loading";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const ExamImport = () => {
  const [activeTab, setActiveTab] = useState("answer-key");
  const [loading, setLoading] = useState(false);
  const [importedExams, setImportedExams] = useState([]);
  const [classes, setClasses] = useState([]);

  // Estado para upload de gabarito
  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [answerKeyPreview, setAnswerKeyPreview] = useState(null);
  const [answerKeyResult, setAnswerKeyResult] = useState(null);

  // Estado para upload de respostas
  const [answersFile, setAnswersFile] = useState(null);
  const [answersPreview, setAnswersPreview] = useState(null);
  const [answersResult, setAnswersResult] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, classesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/exams/`),
        fetch(`${API_BASE_URL}/classes/`),
      ]);

      const examsData = await examsRes.json();
      const classesData = await classesRes.json();

      setImportedExams(
        Array.isArray(examsData)
          ? examsData
          : examsData.results || []
      );
      setClasses(
        Array.isArray(classesData)
          ? classesData
          : classesData.results || []
      );
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UPLOAD DE GABARITO
  // ============================================

  const handleAnswerKeyFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnswerKeyFile(file);
      setAnswerKeyResult(null);
      previewAnswerKeyFile(file);
    }
  };

  const previewAnswerKeyFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").slice(0, 6); // Preview primeiras 5 linhas
      setAnswerKeyPreview(lines.join("\n"));
    };
    reader.readAsText(file);
  };

  const handleAnswerKeyUpload = async () => {
    if (!answerKeyFile) {
      alert("Selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", answerKeyFile);

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/exams/import_answer_key/`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAnswerKeyResult(result);
        fetchData(); // Atualiza lista de provas
      } else {
        setAnswerKeyResult({
          success: false,
          error: result.error || "Erro ao processar arquivo",
        });
      }
    } catch (err) {
      setAnswerKeyResult({
        success: false,
        error: `Erro: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAnswerKeyForm = () => {
    setAnswerKeyFile(null);
    setAnswerKeyPreview(null);
    setAnswerKeyResult(null);
  };

  // ============================================
  // UPLOAD DE RESPOSTAS
  // ============================================

  const handleAnswersFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnswersFile(file);
      setAnswersResult(null);
      previewAnswersFile(file);
    }
  };

  const previewAnswersFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").slice(0, 6); // Preview primeiras 5 linhas
      setAnswersPreview(lines.join("\n"));
    };
    reader.readAsText(file);
  };

  const handleAnswersUpload = async () => {
    if (!answersFile) {
      alert("Selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", answersFile);

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/exam-applications/import_student_answers/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAnswersResult(result);
      } else {
        setAnswersResult({
          success: false,
          error: result.error || "Erro ao processar arquivo",
        });
      }
    } catch (err) {
      setAnswersResult({
        success: false,
        error: `Erro: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAnswersForm = () => {
    setAnswersFile(null);
    setAnswersPreview(null);
    setAnswersResult(null);
    setSelectedExam("");
    setSelectedClass("");
  };

  // ============================================
  // DOWNLOAD DE TEMPLATES
  // ============================================

  const downloadAnswerKeyTemplate = () => {
    const csvContent = `codigo_prova,nome_prova,disciplina,ano_escolar,numero_questao,resposta_correta,codigo_descritor,pontos,dificuldade,enunciado
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,1,A,D01,1.0,easy,Qual é o resultado de 5 + 3?
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,2,C,D02,1.5,medium,Resolva a equação 2x = 10
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,3,B,D01,1.0,hard,Calcule a área de um quadrado de lado 4cm`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_gabarito.csv";
    link.click();
  };

  const downloadAnswersTemplate = () => {
    const csvContent = `codigo_prova,id_turma,matricula_aluno,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10
PROVA2024_MAT_5,1,12345,A,C,B,D,A,E,C,B,A,D
PROVA2024_MAT_5,1,67890,B,C,A,D,C,A,B,D,E,A
PROVA2024_MAT_5,1,11111,A,C,B,D,E,C,B,A,D,C`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_respostas.csv";
    link.click();
  };

  if (loading && !answerKeyFile && !answersFile) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📤 Importação de Provas
          </h1>
          <p className="text-gray-600">
            Importe gabaritos de provas e respostas dos alunos via CSV/Excel
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("answer-key")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "answer-key"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Upload className="inline-block mr-2 h-5 w-5" />
                Upload Gabarito
              </button>
              <button
                onClick={() => setActiveTab("answers")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "answers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="inline-block mr-2 h-5 w-5" />
                Upload Respostas
              </button>
              <button
                onClick={() => setActiveTab("imported")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "imported"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <List className="inline-block mr-2 h-5 w-5" />
                Provas Importadas ({importedExams.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* TAB 1: Upload Gabarito */}
            {activeTab === "answer-key" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    ℹ️ Como funciona
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Faça upload de um CSV com o gabarito completo da prova</li>
                    <li>• O sistema criará automaticamente a prova, questões e alternativas</li>
                    <li>• Os descritores serão vinculados automaticamente pelo código</li>
                  </ul>
                  <button
                    onClick={downloadAnswerKeyTemplate}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar Template CSV
                  </button>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      Escolher arquivo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleAnswerKeyFileChange}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    CSV, XLSX ou XLS (max 10MB)
                  </p>
                  {answerKeyFile && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ {answerKeyFile.name}
                    </p>
                  )}
                </div>

                {/* Preview */}
                {answerKeyPreview && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Preview do arquivo:
                    </h4>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {answerKeyPreview}
                    </pre>
                  </div>
                )}

                {/* Buttons */}
                {answerKeyFile && !answerKeyResult && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAnswerKeyUpload}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          Importar Gabarito
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetAnswerKeyForm}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Result */}
                {answerKeyResult && (
                  <div
                    className={`rounded-lg p-6 ${
                      answerKeyResult.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {answerKeyResult.success ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-2 ${
                            answerKeyResult.success
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {answerKeyResult.success
                            ? "✓ Importação concluída!"
                            : "✗ Erro na importação"}
                        </h4>
                        <p
                          className={`text-sm ${
                            answerKeyResult.success
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {answerKeyResult.message || answerKeyResult.error}
                        </p>

                        {answerKeyResult.exams && (
                          <div className="mt-4 space-y-2">
                            {answerKeyResult.exams.map((exam, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded p-3 text-sm"
                              >
                                <div className="font-medium text-gray-800">
                                  {exam.nome}
                                </div>
                                <div className="text-gray-600">
                                  Código: {exam.codigo} | Questões: {exam.questoes}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {answerKeyResult.descriptors_not_found && (
                          <div className="mt-3 text-sm text-orange-700">
                            ⚠️ Descritores não encontrados:{" "}
                            {answerKeyResult.descriptors_not_found.join(", ")}
                          </div>
                        )}

                        {answerKeyResult.errors && answerKeyResult.errors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-red-800 mb-2">
                              Erros encontrados:
                            </p>
                            <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
                              {answerKeyResult.errors.map((error, idx) => (
                                <p key={idx} className="text-xs text-red-600 mb-1">
                                  • {error}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={resetAnswerKeyForm}
                      className="mt-4 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Importar outro arquivo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Upload Respostas */}
            {activeTab === "answers" && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    ℹ️ Como funciona
                  </h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• A prova já deve estar importada no sistema</li>
                    <li>• Os alunos devem estar cadastrados nas turmas correspondentes</li>
                    <li>• O sistema comparará com o gabarito e atribuirá descritores automaticamente</li>
                  </ul>
                  <button
                    onClick={downloadAnswersTemplate}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar Template CSV
                  </button>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-800 font-medium">
                      Escolher arquivo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleAnswersFileChange}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    CSV, XLSX ou XLS (max 10MB)
                  </p>
                  {answersFile && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ {answersFile.name}
                    </p>
                  )}
                </div>

                {/* Preview */}
                {answersPreview && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Preview do arquivo:
                    </h4>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {answersPreview}
                    </pre>
                  </div>
                )}

                {/* Buttons */}
                {answersFile && !answersResult && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAnswersUpload}
                      disabled={loading}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          Processar Respostas
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetAnswersForm}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Result */}
                {answersResult && (
                  <div
                    className={`rounded-lg p-6 ${
                      answersResult.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {answersResult.success ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-2 ${
                            answersResult.success
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {answersResult.success
                            ? "✓ Processamento concluído!"
                            : "✗ Erro no processamento"}
                        </h4>
                        <p
                          className={`text-sm ${
                            answersResult.success
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {answersResult.message || answersResult.error}
                        </p>

                        {answersResult.created_applications && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-gray-800">
                              Aplicações criadas:
                            </p>
                            {answersResult.created_applications.map((app, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded p-3 text-sm"
                              >
                                <div className="font-medium text-gray-800">
                                  {app.exam}
                                </div>
                                <div className="text-gray-600">
                                  Turma: {app.class}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {answersResult.errors && answersResult.errors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-orange-800 mb-2">
                              ⚠️ Avisos e erros:
                            </p>
                            <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
                              {answersResult.errors.map((error, idx) => (
                                <p key={idx} className="text-xs text-orange-600 mb-1">
                                  • {error}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={resetAnswersForm}
                      className="mt-4 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Processar outro arquivo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Provas Importadas */}
            {activeTab === "imported" && (
              <div className="space-y-4">
                {importedExams.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">Nenhuma prova importada ainda</p>
                    <p className="text-sm mt-2">
                      Use a aba "Upload Gabarito" para importar sua primeira prova
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {importedExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exam.exam_name}
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Código:</span>{" "}
                                {exam.exam_code}
                              </p>
                              <p>
                                <span className="font-medium">Disciplina:</span>{" "}
                                {exam.subject}
                              </p>
                              <p>
                                <span className="font-medium">Ano:</span>{" "}
                                {exam.school_year}
                              </p>
                              <p>
                                <span className="font-medium">Questões:</span>{" "}
                                {exam.questions_count || exam.total_questions || 0}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Importada
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamImport;
