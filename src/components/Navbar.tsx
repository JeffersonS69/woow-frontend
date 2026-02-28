import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/profile" className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600 tracking-tight">Woow</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Mi Perfil
            </Link>

            {/* User info */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 leading-tight">{user?.name}</p>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      isAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-3 space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Mi Perfil
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Dashboard Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
