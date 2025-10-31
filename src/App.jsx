// File: src/App.jsx

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import PrivateRoute from './components/auth/PrivateRoute'
import { ROUTES } from './utils/constants'

// Auth Pages
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

// Pages
import DashboardPage from './pages/DashboardPage'
import MarketplacePage from './pages/MarketplacePage'
import ProducerProfilePage from './pages/ProducerProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import { AdminTemplateUpload } from './pages/SimpleAdminPage'

// Story Components
import TemplateSelector from './components/story/TemplateSelector'
import StoryEditor from './components/story/StoryEditor'
import QRCodeGenerator from './components/story/QRCodeGenerator'
import StoryViewer from './components/story-viewer/StoryViewer'

function App() {
  const { isAuthenticated, loading, user, token } = useAuth()

  // Debug logging
  React.useEffect(() => {
    console.log('App Auth State:', { isAuthenticated, loading, hasUser: !!user, hasToken: !!token });
  }, [isAuthenticated, loading, user, token]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#83aa45]"></div>
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

        {/* Admin page for uploading template */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <PrivateRoute>
              <AdminTemplateUpload />
            </PrivateRoute>
          }
        />
        
        {/* Public Story View - No auth required */}
        <Route 
          path={ROUTES.VIEW_STORY} 
          element={<StoryViewer />} 
        />

        {/* Public Marketplace - No auth required */}
        <Route 
          path={ROUTES.MARKETPLACE} 
          element={<MarketplacePage />} 
        />

        {/* Public Producer Profile - No auth required */}
        <Route 
          path={ROUTES.PRODUCER_PROFILE} 
          element={
            <ProducerProfilePage />
          } 
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.CREATE_STORY}
          element={
            <PrivateRoute>
              <TemplateSelector />
            </PrivateRoute>
          }
        />

        <Route
          path="/story/create/editor"
          element={
            <PrivateRoute>
              <StoryEditor />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_STORY}
          element={
            <PrivateRoute>
              <StoryEditor />
            </PrivateRoute>
          }
        />

        <Route
          path="/story/:id/qr"
          element={
            <PrivateRoute>
              <QRCodeGenerator />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_PROFILE}
          element={
            <PrivateRoute>
              <EditProfilePage />
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
                  className="mt-6 inline-block px-6 py-3 bg-[#83aa45] text-white rounded-lg hover:bg-[#7da143] transition-colors"
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