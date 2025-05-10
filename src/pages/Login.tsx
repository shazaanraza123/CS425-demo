import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // For demo purposes, fill form with demo credentials
  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <Layout requiresAuth={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <DollarSign className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">CS425 Personal Finance Manager Project Demo</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                fullWidth
              />

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                fullWidth
              />
              
              <div>
                <Button type="submit" isLoading={isLoading} fullWidth>
                  Sign in
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={fillDemoCredentials}
                fullWidth
              >
                Use demo credentials
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;