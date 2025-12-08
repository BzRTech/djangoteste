import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Settings,
  FileText,
  Upload,
  ClipboardList,
  User,
  PenTool,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/descriptors", label: "Descritores", icon: BookOpen },
    { to: "/admin", label: "Administração", icon: Settings },
    { to: "/exams", label: "Provas", icon: FileText },
    { to: "/exam-import", label: "Importar", icon: Upload },
    { to: "/student-answers", label: "Respostas", icon: ClipboardList },
    { to: "/take-exam", label: "Aplicar Prova", icon: PenTool },
    { to: "/profile", label: "Meu Perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white shadow-xl transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I+</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-2xl font-bold text-gray-800">IDEB+</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                } ${sidebarCollapsed ? "justify-center" : ""}`
              }
              title={sidebarCollapsed ? link.label : ""}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I+</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">IDEB+</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white max-h-[70vh] overflow-y-auto">
            <nav className="py-2 px-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 md:pt-0 pt-16">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2024 Sistema de Gestão Escolar. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
