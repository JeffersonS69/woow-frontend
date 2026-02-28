import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMe, updateMe } from '../services/user.service';
import type { User } from '../types';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

type Feedback = { type: 'success' | 'error'; message: string } | null;

export default function Profile() {
  const { user: ctxUser, login, token } = useAuth();

  const [user, setUser] = useState<User | null>(ctxUser);
  const [loadingProfile, setLoadingProfile] = useState(!ctxUser);
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState(ctxUser?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    getMe()
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setNameInput(data.name);
        }
      })
      .catch(() => {
        // keep the context user as fallback
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayUser = user ?? ctxUser;

  const initials = displayUser?.name
    ? displayUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleEdit = () => {
    setNameInput(displayUser?.name ?? '');
    setNameError('');
    setFeedback(null);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setNameError('');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameError('El nombre no puede estar vacío');
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await updateMe({ name: nameInput.trim() });
      setUser(updated);
      setEditMode(false);
      setFeedback({ type: 'success', message: 'Perfil actualizado correctamente' });
      // Sync context so Navbar reflects the new name
      if (token) {
        login({ token, user: updated });
      }
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Error al actualizar el perfil';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi perfil</h1>

        {/* Feedback toast */}
        {feedback && (
          <div
            className={`mb-5 flex items-center gap-3 p-3 rounded-xl text-sm border ${
              feedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {feedback.message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          {/* Profile header */}
          <div className="bg-indigo-600 px-8 py-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {initials}
              </div>
              <div>
                {loadingProfile ? (
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-white/30 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white">{displayUser?.name}</h2>
                    <p className="text-indigo-200 text-sm">{displayUser?.email}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="px-8 py-6 space-y-6">
            {loadingProfile ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                {/* Name field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Nombre
                  </label>
                  {editMode ? (
                    <form onSubmit={handleSave} className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            setNameError('');
                          }}
                          autoFocus
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            nameError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {nameError && (
                          <p className="mt-1 text-xs text-red-600">{nameError}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        {saving && <LoadingSpinner size="sm" />}
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 font-medium">{displayUser?.name}</p>
                      <button
                        onClick={handleEdit}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar perfil
                      </button>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Correo electrónico
                  </label>
                  <p className="text-gray-900">{displayUser?.email}</p>
                </div>

                <hr className="border-gray-100" />

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Rol
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      displayUser?.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {displayUser?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </span>
                </div>

                <hr className="border-gray-100" />

                {/* Member since */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Miembro desde
                  </label>
                  <p className="text-gray-900">
                    {displayUser?.createdAt ? formatDate(displayUser.createdAt) : '—'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
