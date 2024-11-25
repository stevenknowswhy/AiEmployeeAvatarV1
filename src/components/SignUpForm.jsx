import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Lock, User } from 'lucide-react';

const SignUpForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-100 rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Welcome
        </h2>
        <p className="text-gray-500 mt-2">Connect with us</p>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 rounded-full transition-all duration-300 ${
            isLogin
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 rounded-full transition-all duration-300 ${
            !isLogin
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-full"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-full"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-full"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
        >
          {isLogin ? 'Log In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
