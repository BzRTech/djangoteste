import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit2, Trash2, CheckCircle, Circle,
  Filter, BookOpen, Target, AlertCircle, Save, X
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const QuestionBankManager = ({ examId, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [descriptors, setDescriptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar questões
      const questionsRes = await fetch(`${API_BASE_URL}/questions/?id_exam=${examId}`);
      if (!questionsRes.ok) throw new Error('Erro ao buscar questões');
      const questionsData = await questionsRes.json();
      setQuestions(Array.isArray(questionsData) ? questionsData : questionsData.results || []);

      // Buscar TODOS os descritores (sem paginação)
      let allDescriptors = [];
      let nextUrl = `${API_BASE_URL}/descriptors/?page_size=1000`; // Buscar muitos de uma vez

      while (nextUrl) {
        const descriptorsRes = await fetch(nextUrl);
        if (!descriptorsRes.ok) throw new Error('Erro ao buscar descritores');

        const descriptorsData = await descriptorsRes.json();

        if (Array.isArray(descriptorsData)) {
          allDescriptors = [...allDescriptors, ...descriptorsData];
          nextUrl = null;
        } else {
          allDescriptors = [...allDescriptors, ...(descriptorsData.results || [])];
          nextUrl = descriptorsData.next;
        }
      }

      setDescriptors(allDescriptors);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar questões e descritores. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta questão?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        alert('Erro ao deletar questão');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar questão');
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || q.descriptor_name?.includes(filterSubject);
    const matchesDifficulty = !filterDifficulty || q.difficulty_level === filterDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjects = Array.isArray(descriptors) && descriptors.length > 0
    ? [...new Set(descriptors.map(d => d.subject).filter(Boolean))]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Banco de Questões</h2>
          <p className="text-gray-600">Gerencie as questões desta prova</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingQuestion(null);
              setShowQuestionForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nova Questão
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>

      {!showQuestionForm ? (
        <>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar questões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as disciplinas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as dificuldades</option>
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          {/* Lista de Questões */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma questão encontrada</p>
                <p className="text-sm mt-2">Clique em "Nova Questão" para adicionar</p>
              </div>
            ) : (
              filteredQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onEdit={(q) => {
                    setEditingQuestion(q);
                    setShowQuestionForm(true);
                  }}
                  onDelete={handleDeleteQuestion}
                  descriptors={descriptors}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <QuestionForm
          examId={examId}
          question={editingQuestion}
          descriptors={descriptors}
          onSave={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
            fetchData();
          }}
          onCancel={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
};

// ============================================
// QUESTION CARD
// ============================================
const QuestionCard = ({ question, index, onEdit, onDelete, descriptors }) => {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Questão {question.question_number}
            </span>
            {question.difficulty_level && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[question.difficulty_level]}`}>
                {difficultyLabels[question.difficulty_level] || question.difficulty_level}
              </span>
            )}
            <span className="text-sm text-gray-600">
              {question.points} {question.points === 1 ? 'ponto' : 'pontos'}
            </span>
          </div>

          <p className="text-gray-800 font-medium mb-2">{question.question_text}</p>

          {question.descriptor_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{question.descriptor_name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(question)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alternativas */}
      {question.alternatives && question.alternatives.length > 0 && (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? 'Ocultar alternativas' : `Ver ${question.alternatives.length} alternativas`}
          </button>

          {expanded && (
            <div className="space-y-2 mt-2">
              {question.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alt.is_correct
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {alt.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700">{alt.alternative_letter})</span>
                    <span className="ml-2 text-gray-800">{alt.alternative_text}</span>
                    {alt.is_correct && (
                      <span className="ml-2 text-xs text-green-700 font-semibold">(CORRETA)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// QUESTION FORM
// ============================================
const QuestionForm = ({ examId, question, descriptors, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id_exam: examId,
    question_number: question?.question_number || 1,
    question_text: question?.question_text || '',
    question_type: question?.question_type || 'multiple_choice',
    difficulty_level: question?.difficulty_level || 'medium',
    points: question?.points || 1.0,
    id_descriptor: question?.id_descriptor || '',
    skill_assessed: question?.skill_assessed || '',
  });

  const [alternatives, setAlternatives] = useState(
    question?.alternatives || [
      { alternative_letter: 'A', alternative_text: '', is_correct: false },
      { alternative_letter: 'B', alternative_text: '', is_correct: false },
      { alternative_letter: 'C', alternative_text: '', is_correct: false },
      { alternative_letter: 'D', alternative_text: '', is_correct: false },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [descriptorSearch, setDescriptorSearch] = useState('');
  const [showDescriptorDropdown, setShowDescriptorDropdown] = useState(false);

  // Filtrar descritores baseado na busca
  const filteredDescriptors = descriptors.filter(desc => {
    if (!descriptorSearch) return true;
    const search = descriptorSearch.toLowerCase();
    return (
      desc.descriptor_code?.toLowerCase().includes(search) ||
      desc.descriptor_name?.toLowerCase().includes(search) ||
      desc.subject?.toLowerCase().includes(search) ||
      desc.grade?.toLowerCase().includes(search)
    );
  });

  // Encontrar o descritor selecionado
  const selectedDescriptor = descriptors.find(desc => desc.id === formData.id_descriptor);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDescriptorDropdown && !event.target.closest('.descriptor-search-container')) {
        setShowDescriptorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDescriptorDropdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validações
    const correctAnswers = alternatives.filter(a => a.is_correct && a.alternative_text.trim());
    if (correctAnswers.length === 0) {
      setError('Marque pelo menos uma alternativa como correta');
      return;
    }

    const emptyAlternatives = alternatives.filter(a => !a.alternative_text.trim());
    if (emptyAlternatives.length > 0) {
      setError('Preencha todas as alternativas');
      return;
    }

    if (!formData.question_text.trim()) {
      setError('O enunciado da questão é obrigatório');
      return;
    }

    setSaving(true);

    try {
      // 1. Criar/atualizar questão
      const questionData = {
        ...formData,
        id_descriptor: formData.id_descriptor || null,
        alternatives: alternatives.map((alt, index) => ({
          alternative_order: index + 1,  // Converter para número (1, 2, 3, 4)
          alternative_text: alt.alternative_text.trim(),
          is_correct: alt.is_correct
        }))
      };

      console.log('Enviando dados para API:', questionData);

      const url = question
        ? `${API_BASE_URL}/questions/${question.id}/`
        : `${API_BASE_URL}/questions/`;

      const method = question ? 'PUT' : 'POST';

      console.log(`${method} ${url}`);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        // Tentar pegar o erro como JSON, se falhar pegar como texto
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Erro da API (JSON):', errorData);

          // Mensagens de erro mais amigáveis
          if (response.status === 400) {
            const errorMessages = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n');
            errorMessage = errorMessages || 'Dados inválidos';
          } else if (response.status === 404) {
            errorMessage = 'Prova não encontrada';
          } else {
            errorMessage = `Erro ${response.status}: ${JSON.stringify(errorData)}`;
          }
        } catch (jsonError) {
          // Se não conseguiu parsear como JSON, pegar como texto
          const errorText = await response.text();
          console.error('Erro da API (Texto):', errorText);

          // Tentar extrair mensagem de erro do HTML
          const match = errorText.match(/<pre>(.*?)<\/pre>/s);
          if (match) {
            errorMessage = `Erro ${response.status}: ${match[1].substring(0, 500)}`;
          } else {
            errorMessage = `Erro ${response.status}: Erro no servidor. Verifique os logs do Django.`;
          }
        }

        throw new Error(errorMessage);
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setError('Erro ao salvar questão: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAlternativeChange = (index, field, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index][field] = value;

    // Se marcar como correta, desmarcar outras (apenas para múltipla escolha simples)
    if (field === 'is_correct' && value && formData.question_type === 'multiple_choice') {
      newAlternatives.forEach((alt, i) => {
        if (i !== index) alt.is_correct = false;
      });
    }

    setAlternatives(newAlternatives);
  };

  const addAlternative = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLetter = letters[alternatives.length];
    setAlternatives([
      ...alternatives,
      { alternative_letter: nextLetter, alternative_text: '', is_correct: false }
    ]);
  };

  const removeAlternative = (index) => {
    if (alternatives.length <= 2) {
      alert('Deve haver pelo menos 2 alternativas');
      return;
    }
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {question ? 'Editar Questão' : 'Nova Questão'}
        </h3>
        <p className="text-sm text-gray-600">
          Preencha todos os campos e marque a alternativa correta
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Dados básicos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número da Questão *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.question_number}
            onChange={(e) => setFormData({ ...formData, question_number: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pontos *
          </label>
          <input
            type="number"
            required
            min="0.1"
            step="0.1"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dificuldade *
          </label>
          <select
            required
            value={formData.difficulty_level}
            onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div className="descriptor-search-container">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descritor (Competência)
          </label>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={descriptorSearch}
                onChange={(e) => {
                  setDescriptorSearch(e.target.value);
                  setShowDescriptorDropdown(true);
                }}
                onFocus={() => setShowDescriptorDropdown(true)}
                placeholder="Buscar descritor (código, nome, disciplina)..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown de resultados */}
            {showDescriptorDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredDescriptors.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum descritor encontrado
                  </div>
                ) : (
                  filteredDescriptors.slice(0, 50).map(desc => (
                    <button
                      key={desc.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, id_descriptor: desc.id });
                        setDescriptorSearch(`${desc.descriptor_code} - ${desc.descriptor_name}`);
                        setShowDescriptorDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 transition-colors ${
                        formData.id_descriptor === desc.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-semibold text-gray-800">
                        {desc.descriptor_code} - {desc.descriptor_name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {desc.subject && <span className="mr-3">📚 {desc.subject}</span>}
                        {desc.grade && <span>🎓 {desc.grade}</span>}
                      </div>
                    </button>
                  ))
                )}
                {filteredDescriptors.length > 50 && (
                  <div className="p-2 text-center text-sm text-gray-600 bg-gray-50">
                    Mostrando 50 de {filteredDescriptors.length} resultados. Continue digitando para refinar.
                  </div>
                )}
              </div>
            )}

            {/* Botão para limpar seleção */}
            {formData.id_descriptor && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, id_descriptor: '' });
                  setDescriptorSearch('');
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Exibir descrição do descritor selecionado */}
          {selectedDescriptor && selectedDescriptor.descriptor_description && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Descrição do Descritor:</div>
                  <p className="text-sm text-blue-800">{selectedDescriptor.descriptor_description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enunciado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enunciado da Questão *
        </label>
        <textarea
          required
          rows="4"
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o enunciado completo da questão..."
        />
      </div>

      {/* Alternativas */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800">Alternativas</h4>
          <button
            type="button"
            onClick={addAlternative}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            <Plus className="w-4 h-4" />
            Adicionar Alternativa
          </button>
        </div>

        <div className="space-y-3">
          {alternatives.map((alt, index) => (
            <div key={index} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => handleAlternativeChange(index, 'is_correct', !alt.is_correct)}
                className={`mt-2 p-2 rounded-lg border-2 transition-colors ${
                  alt.is_correct
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                {alt.is_correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-700 w-8">{alt.alternative_letter})</span>
                  {alt.is_correct && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      CORRETA
                    </span>
                  )}
                </div>
                <textarea
                  value={alt.alternative_text}
                  onChange={(e) => handleAlternativeChange(index, 'alternative_text', e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`Digite a alternativa ${alt.alternative_letter}`}
                />
              </div>

              {alternatives.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAlternative(index)}
                  className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Questão
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default QuestionBankManager;
