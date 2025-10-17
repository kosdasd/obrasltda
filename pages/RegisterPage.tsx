import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const result = await registerUser(name, password);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message);
        }
    } catch (err) {
        setError('Ocorreu um erro. Tente novamente.');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Conta Criada!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Sua conta foi criada com sucesso e agora está aguardando a aprovação de um administrador.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Voltar para o Login
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Criar Conta</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sua conta precisará ser aprovada por um admin.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Nome de Usuário
            </label>
            <input
              className="appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500"
              id="name"
              type="text"
              placeholder="Escolha seu nome de usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              className="appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-500"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-brand-300"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </div>
            <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Já tem uma conta? <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Faça login.</Link></p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;