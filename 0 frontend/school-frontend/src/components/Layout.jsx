import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/descriptors', label: 'Descritores' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">
                  Sistema Escolar
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Sistema de Gestão Escolar. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;