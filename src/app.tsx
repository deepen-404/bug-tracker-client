import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/auth-context'
import { Layout } from '@/components/layout/layout'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { CreateBugPage } from '@/pages/create-bug-page'
import { EditBugPage } from '@/pages/edit-bug-page'
import { MyBugsPage } from '@/pages/my-bugs-page'
import { AssignedBugsPage } from '@/pages/assigned-bugs-page'
import { UnassignedBugsPage } from '@/pages/unassigned-bugs-page'
import { BugDetailPage } from '@/pages/bug-detail-page'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="bugs/create"
              element={
                <ProtectedRoute allowedRoles={['User', 'Developer']}>
                  <CreateBugPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="bugs/:id"
              element={
                <ProtectedRoute>
                  <BugDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="bugs/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['User', 'Developer']}>
                  <EditBugPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="my-bugs"
              element={
                <ProtectedRoute allowedRoles={['User', 'Developer']}>
                  <MyBugsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="assigned-bugs"
              element={
                <ProtectedRoute allowedRoles={['Developer']}>
                  <AssignedBugsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="unassigned-bugs"
              element={
                <ProtectedRoute allowedRoles={['Developer']}>
                  <UnassignedBugsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
