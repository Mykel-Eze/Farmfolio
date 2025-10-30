// File: src/components/auth/LoginForm.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting login form...');
      const result = await login(values);
      
      console.log('Login result:', result);
      
      if (result.success) {
        toast.success('Successfully logged in!');
        // Small delay to ensure state is updated
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          navigate(ROUTES.DASHBOARD, { replace: true });
        }, 100);
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E6DC] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/farmfolio.png" alt="Farmfolio Logo" className="w-[120px]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Hello, welcome</h2>
          <p className="text-gray-600 mt-2">Let's create something beautiful</p>
        </div>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`block w-full px-4 py-3 border-0 bg-gray-100 ${
                  formik.touched.email && formik.errors.email
                    ? 'ring-2 ring-red-500'
                    : 'focus:ring-2 focus:ring-[#83aa45]'
                } rounded-lg focus:outline-none`}
                placeholder="seandike@gmail.com"
                {...formik.getFieldProps('email')}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={`block w-full px-4 py-3 pr-12 border-0 bg-gray-100 ${
                  formik.touched.password && formik.errors.password
                    ? 'ring-2 ring-red-500'
                    : 'focus:ring-2 focus:ring-[#8B9556]'
                } rounded-lg focus:outline-none`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#8B9556] hover:bg-[#7A8449] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B9556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-[#83aa45] hover:text-[#7A8449] transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-[#83aa45] hover:text-[#7A8449] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;