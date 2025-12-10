import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import { ThemeProvider } from './context/theme.context';
import { ProtectedRoute } from './components/common';
import { MainLayout } from './components/layout';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  AcceptInvitePage,
} from './pages/auth';
import { DashboardPage, TeamPage } from './pages/dashboard';
import './App.css';

// Placeholder pages for future modules
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-foreground-muted">This module is coming soon in a future phase.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />

          {/* Protected Routes with MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dashboard/team" element={<TeamPage />} />

            {/* CRM Module (Placeholder) */}
            <Route path="crm" element={<PlaceholderPage title="CRM" />} />
            <Route path="crm/*" element={<PlaceholderPage title="CRM" />} />

            {/* Inventory Module (Placeholder) */}
            <Route path="inventory" element={<PlaceholderPage title="Inventory" />} />
            <Route path="inventory/*" element={<PlaceholderPage title="Inventory" />} />

            {/* Sales Module (Placeholder) */}
            <Route path="sales" element={<PlaceholderPage title="Sales" />} />
            <Route path="sales/*" element={<PlaceholderPage title="Sales" />} />

            {/* Projects Module (Placeholder) */}
            <Route path="projects" element={<PlaceholderPage title="Projects" />} />
            <Route path="projects/*" element={<PlaceholderPage title="Projects" />} />

            {/* HR Module (Placeholder) */}
            <Route path="hr" element={<PlaceholderPage title="HR" />} />
            <Route path="hr/*" element={<PlaceholderPage title="HR" />} />

            {/* Accounting Module (Placeholder) */}
            <Route path="accounting" element={<PlaceholderPage title="Accounting" />} />
            <Route path="accounting/*" element={<PlaceholderPage title="Accounting" />} />

            {/* Settings & Profile */}
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="profile" element={<PlaceholderPage title="Profile" />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;