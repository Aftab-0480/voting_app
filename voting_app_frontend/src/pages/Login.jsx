import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ aadharCardNumber: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(Number(form.aadharCardNumber), form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-vote-500 flex items-center justify-center mx-auto mb-4">
            <Vote size={26} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            Log in to vote
          </h1>
          <p className="text-ink-500 dark:text-paper-200 mt-2 text-sm">
            Use your Aadhaar number to access your ballot
          </p>
        </div>

        {/* Form */}
        <div className="card p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Aadhaar Card Number</label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter 12-digit Aadhaar number"
                value={form.aadharCardNumber}
                onChange={(e) => setForm({ ...form, aadharCardNumber: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900 dark:hover:text-paper-50"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 dark:text-paper-200">
            Don't have an account?{' '}
            <Link to="/signup" className="text-vote-500 hover:text-vote-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}