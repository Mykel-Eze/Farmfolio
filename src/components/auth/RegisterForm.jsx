// File: src/components/auth/RegisterForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, User, Building2, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserCategories } from '../../api/userCategoriesApi';
import { ROUTES, VALIDATION_RULES } from '../../utils/constants';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userCategories, setUserCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch user categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getUserCategories();
        setUserCategories(categories);
      } catch (error) {
        toast.error('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'First name must be at least 2 characters')
      .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'First name is too long')
      .required('First name is required'),
    lastName: Yup.string()
      .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'Last name must be at least 2 characters')
      .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'Last name is too long')
      .required('Last name is required'),
    companyName: Yup.string()
      .required('Company name is required')
      .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'Company name must be at least 2 characters')
      .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'Company name is too long'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        'Password must include uppercase, lowercase, number, and special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    userCategoryId: Yup.number()
      .required('Please select a category'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userCategoryId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await register(values);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E6DC] px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/farmfolio.png" alt="Farmfolio Logo" className="w-[120px]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 mt-2">Join Farmfolio and share your story</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                First Name *
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`block w-full px-4 py-3 border-0 bg-gray-100 ${
                    formik.touched.firstName && formik.errors.firstName
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-2 focus:ring-[#8B9556]'
                  } rounded-lg focus:outline-none`}
                  placeholder="John"
                  {...formik.getFieldProps('firstName')}
                />
              </div>
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`block w-full px-4 py-3 border-0 bg-gray-100 ${
                    formik.touched.lastName && formik.errors.lastName
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-2 focus:ring-[#8B9556]'
                  } rounded-lg focus:outline-none`}
                  placeholder="Doe"
                  {...formik.getFieldProps('lastName')}
                />
              </div>
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
              Company Name *
            </label>
            <div className="relative">
              <input
                id="companyName"
                name="companyName"
                type="text"
                className={`block w-full px-4 py-3 border-0 bg-gray-100 ${
                  formik.touched.companyName && formik.errors.companyName
                    ? 'ring-2 ring-red-500'
                    : 'focus:ring-2 focus:ring-[#8B9556]'
                } rounded-lg focus:outline-none`}
                placeholder="Your Business Name"
                {...formik.getFieldProps('companyName')}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address *
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
                    : 'focus:ring-2 focus:ring-[#8B9556]'
                } rounded-lg focus:outline-none`}
                placeholder="you@example.com"
                {...formik.getFieldProps('email')}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* User Category */}
          <div>
            <label htmlFor="userCategoryId" className="block text-sm font-medium text-gray-900 mb-2">
              I am a *
            </label>
            <select
              id="userCategoryId"
              name="userCategoryId"
              className={`block w-full px-4 py-3 border-0 bg-gray-100 ${
                formik.touched.userCategoryId && formik.errors.userCategoryId
                  ? 'ring-2 ring-red-500'
                  : 'focus:ring-2 focus:ring-[#8B9556]'
              } rounded-lg focus:outline-none`}
              disabled={loadingCategories}
              {...formik.getFieldProps('userCategoryId')}
            >
              <option value="">Select a category</option>
              {userCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {formik.touched.userCategoryId && formik.errors.userCategoryId && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.userCategoryId}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`block w-full px-4 py-3 pr-12 border-0 bg-gray-100 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-2 focus:ring-[#8B9556]'
                  } rounded-lg focus:outline-none`}
                  placeholder="••••••••"
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formik.isValid || loadingCategories}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#83aa45] hover:bg-[#7A8449] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B9556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-[#8B9556] hover:text-[#7A8449] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;