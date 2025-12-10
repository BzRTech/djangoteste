import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const UserProfile = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  // Dados simulados do usuário - em produção viriam da API
  const [user, setUser] = useState({
    name: "Maria Silva",
    email: "maria.silva@escola.edu.br",
    phone: "(11) 99999-9999",
    role: "Professor",
    school: "Escola Municipal São Paulo",
    city: "São Paulo, SP",
    joinDate: "2022-03-15",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reports: false,
  });

  const handleSave = () => {
    setUser({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meu Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 transition-colors duration-300">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Avatar and Basic Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Name and Role */}
              <div className="flex-1 text-center sm:text-left sm:pb-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{user.school}</span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Informações Pessoais
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Segurança
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "preferences"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Preferências
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    {/* Edit Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) =>
                            setEditData({ ...editData, city: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Display Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem
                        icon={User}
                        label="Nome Completo"
                        value={user.name}
                      />
                      <InfoItem
                        icon={Mail}
                        label="E-mail"
                        value={user.email}
                      />
                      <InfoItem
                        icon={Phone}
                        label="Telefone"
                        value={user.phone}
                      />
                      <InfoItem
                        icon={MapPin}
                        label="Cidade"
                        value={user.city}
                      />
                      <InfoItem
                        icon={Shield}
                        label="Função"
                        value={user.role}
                      />
                      <InfoItem
                        icon={Calendar}
                        label="Membro desde"
                        value={formatDate(user.joinDate)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    Alterar Senha
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Recomendamos que você altere sua senha periodicamente para
                    maior segurança.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha atual"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Digite sua nova senha"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Confirme sua nova senha"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Lock className="w-4 h-4" />
                  Atualizar Senha
                </button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações
                  </h3>
                  <div className="space-y-4">
                    <ToggleItem
                      label="Notificações por E-mail"
                      description="Receba atualizações importantes no seu e-mail"
                      checked={notifications.email}
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          email: !notifications.email,
                        })
                      }
                    />
                    <ToggleItem
                      label="Notificações Push"
                      description="Receba notificações em tempo real no navegador"
                      checked={notifications.push}
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          push: !notifications.push,
                        })
                      }
                    />
                    <ToggleItem
                      label="Relatórios Semanais"
                      description="Receba um resumo semanal das atividades"
                      checked={notifications.reports}
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          reports: !notifications.reports,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Theme */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                    Aparência
                  </h3>
                  <ToggleItem
                    label="Modo Escuro"
                    description="Alterne entre o tema claro e escuro"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// Toggle Item Component
const ToggleItem = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800 dark:text-white">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);

export default UserProfile;
