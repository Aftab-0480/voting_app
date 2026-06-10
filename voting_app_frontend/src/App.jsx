import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Candidates from './pages/Candidates';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <main>
              <Routes>
                {/* Guest only */}
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                {/* Public */}
                <Route path="/results" element={<Results />} />

                {/* Protected */}
                <Route path="/" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin only */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'text-sm font-medium',
              style: { borderRadius: '10px' },
              duration: 3500,
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}