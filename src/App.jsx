import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import ViewSubmissions from './pages/ViewSubmissions';
import TakeExam from './pages/TakeExam';
import Results from './pages/Results';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam/:examId"
              element={
                <ProtectedRoute>
                  <TakeExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/create-exam"
              element={
                <ProtectedRoute adminOnly>
                  <CreateExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/exam/:examId"
              element={
                <ProtectedRoute adminOnly>
                  <EditExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/submissions/:examId"
              element={
                <ProtectedRoute adminOnly>
                  <ViewSubmissions />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
   
      <AuthProvider>
        <AppContent />
      </AuthProvider>
   
  );
}

export default App;
