import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Lock, CheckCircle2, Eye, EyeOff, CreditCard, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-paper-100 dark:border-ink-700 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-paper-100 dark:bg-ink-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-ink-500 dark:text-paper-200" />
      </div>
      <div>
        <p className="text-xs text-ink-500 dark:text-paper-200 font-medium">{label}</p>
        <p className="text-sm font-semibold text-ink-900 dark:text-paper-50 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState('info');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const updatePw = (field) => (e) => setPwForm({ ...pwForm, [field]: e.target.value });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await api.put('/user/profile/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-vote-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
              {user?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                user?.role === 'admin'
                  ? 'bg-accent-500/10 text-accent-500 border border-accent-500/30'
                  : 'bg-vote-500/10 text-vote-500 border border-vote-500/30'
              }`}>
                {user?.role === 'admin' ? '⚡ Admin' : '🗳️ Voter'}
              </span>
              {user?.isVoted && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={11} />
                  Vote Cast
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-paper-100 dark:bg-ink-800 rounded-xl mb-6">
        {[
          { key: 'info', label: 'My Info', icon: User },
          { key: 'password', label: 'Change Password', icon: Lock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === key
                ? 'bg-white dark:bg-ink-700 text-ink-900 dark:text-paper-50 shadow-sm'
                : 'text-ink-500 dark:text-paper-200 hover:text-ink-900 dark:hover:text-paper-50'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Info tab */}
      {tab === 'info' && (
        <div className="card p-5">
          <h2 className="font-display font-bold text-lg text-ink-900 dark:text-paper-50 mb-1">
            Account Details
          </h2>
          <p className="text-sm text-ink-500 dark:text-paper-200 mb-4">
            Your registered information on CastVote.
          </p>
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Calendar} label="Age" value={user?.age ? `${user.age} years` : null} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow icon={Phone} label="Mobile Number" value={user?.mobile} />
          <InfoRow icon={MapPin} label="Address" value={user?.address} />
          <InfoRow
            icon={CreditCard}
            label="Aadhaar Card Number"
            value={user?.aadharCardNumber
              ? String(user.aadharCardNumber).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
              : null}
          />
        </div>
      )}

      {/* Password tab */}
      {tab === 'password' && (
        <div className="card p-5">
          <h2 className="font-display font-bold text-lg text-ink-900 dark:text-paper-50 mb-1">
            Change Password
          </h2>
          <p className="text-sm text-ink-500 dark:text-paper-200 mb-5">
            Keep your account secure with a strong password.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter current password"
                  value={pwForm.currentPassword}
                  onChange={updatePw('currentPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900 dark:hover:text-paper-50"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter new password"
                  value={pwForm.newPassword}
                  onChange={updatePw('newPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900 dark:hover:text-paper-50"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter new password"
                value={pwForm.confirm}
                onChange={updatePw('confirm')}
                required
              />
              {pwForm.confirm && pwForm.newPassword !== pwForm.confirm && (
                <p className="text-xs text-red-500 mt-1.5">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={pwLoading || (pwForm.confirm && pwForm.newPassword !== pwForm.confirm)}
            >
              {pwLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating…
                </span>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}