import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', age: '', email: '', mobile: '',
    address: '', aadharCardNumber: '', password: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ ...form, age: Number(form.age), aadharCardNumber: Number(form.aadharCardNumber) });
      toast.success('Account created! Welcome.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-vote-500 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={26} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            Create your account
          </h1>
          <p className="text-ink-500 dark:text-paper-200 mt-2 text-sm">
            Register as a voter to participate in the election
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={update('name')} required />
              </div>
              <div>
                <label className="label">Age *</label>
                <input type="number" className="input-field" placeholder="25" value={form.age} onChange={update('age')} min="18" required />
              </div>
            </div>

            {/* Email + Mobile */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={update('email')} />
              </div>
              <div>
                <label className="label">Mobile</label>
                <input type="tel" className="input-field" placeholder="9876543210" value={form.mobile} onChange={update('mobile')} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="label">Address *</label>
              <input className="input-field" placeholder="123, Main Street, Mumbai" value={form.address} onChange={update('address')} required />
            </div>

            {/* Aadhaar */}
            <div>
              <label className="label">Aadhaar Card Number *</label>
              <input
                type="number"
                className="input-field"
                placeholder="12-digit Aadhaar number"
                value={form.aadharCardNumber}
                onChange={update('aadharCardNumber')}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={update('password')}
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

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 dark:text-paper-200 mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-vote-500 hover:text-vote-600 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}