// File: src/App.jsx

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/auth/PrivateRoute'
import { ROUTES } from './utils/constants'

// Auth Pages
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

// Pages (to be created)
// import HomePage from './pages/HomePage'
// import DashboardPage from './pages/DashboardPage'
// import CreateStoryPage from './pages/CreateStoryPage'
// import EditStoryPage from './pages/EditStoryPage'
// import StoryViewPage from './pages/StoryViewPage'
// import MarketplacePage from './pages/MarketplacePage'
// import ProducerProfilePage from './pages/ProducerProfilePage'
// import EditProfilePage from './pages/EditProfilePage'
// import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { isAuthenticated, loading } = useAuth()

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path={ROUTES.LOGIN} 
          element={
            isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginForm />
          } 
        />
        <Route 
          path={ROUTES.REGISTER} 
          element={
            isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <RegisterForm />
          } 
        />
        
        {/* Public Story View - No auth required */}
        <Route 
          path={ROUTES.VIEW_STORY} 
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Story View Page</h1>
              <p className="text-gray-600 mt-2">Public story viewing (to be implemented)</p>
            </div>
          } 
        />

        {/* Public Marketplace - No auth required */}
        <Route 
          path={ROUTES.MARKETPLACE} 
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Marketplace Page</h1>
              <p className="text-gray-600 mt-2">Public marketplace (to be implemented)</p>
            </div>
          } 
        />

        {/* Public Producer Profile - No auth required */}
        <Route 
          path={ROUTES.PRODUCER_PROFILE} 
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Producer Profile Page</h1>
              <p className="text-gray-600 mt-2">Public producer profile (to be implemented)</p>
            </div>
          } 
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-2">Producer dashboard (to be implemented)</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.CREATE_STORY}
          element={
            <PrivateRoute>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Create Story</h1>
                <p className="text-gray-600 mt-2">Story creation page (to be implemented)</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_STORY}
          element={
            <PrivateRoute>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Edit Story</h1>
                <p className="text-gray-600 mt-2">Story editing page (to be implemented)</p>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_PROFILE}
          element={
            <PrivateRoute>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <p className="text-gray-600 mt-2">Profile editing page (to be implemented)</p>
              </div>
            </PrivateRoute>
          }
        />

        {/* Home Route - Redirect based on auth */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.DASHBOARD} replace />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* 404 Not Found */}
        <Route
          path={ROUTES.NOT_FOUND}
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
                <a
                  href={ROUTES.HOME}
                  className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App