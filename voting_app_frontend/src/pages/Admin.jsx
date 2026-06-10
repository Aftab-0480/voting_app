import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Pencil, Trash2, X, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', party: '', age: '' };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-50">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 dark:hover:text-paper-50 hover:bg-paper-100 dark:hover:bg-ink-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CandidateForm({ form, onChange, onSubmit, loading, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Candidate Name *</label>
        <input
          className="input-field"
          placeholder="e.g. Ehrmantraut Singh"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Party *</label>
        <input
          className="input-field"
          placeholder="e.g. Better call party"
          value={form.party}
          onChange={(e) => onChange({ ...form, party: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Age *</label>
        <input
          type="number"
          className="input-field"
          placeholder="e.g. 55"
          value={form.age}
          onChange={(e) => onChange({ ...form, age: e.target.value })}
          min="18"
          required
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function Admin() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // candidate object
  const [deleteTarget, setDeleteTarget] = useState(null); // candidate object
  const [form, setForm] = useState(EMPTY_FORM);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidate/vote/count');
      setCandidates(res.data);
    } catch {
      toast.error('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ADD
  const handleAdd = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/candidate', { ...form, age: String(form.age) });
      toast.success(`${form.name} added successfully.`);
      setShowAdd(false);
      setForm(EMPTY_FORM);
      fetchCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT
  const openEdit = (candidate) => {
    setEditTarget(candidate);
    setForm({ name: candidate.name || '', party: candidate.party || '', age: candidate.age || '' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/candidate/${editTarget._id}`, { ...form, age: String(form.age) });
      toast.success('Candidate updated.');
      setEditTarget(null);
      setForm(EMPTY_FORM);
      fetchCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/candidate/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name || deleteTarget.party} removed.`);
      setDeleteTarget(null);
      fetchCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  const totalVotes = candidates.reduce((s, c) => s + (c.count || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
            <Shield size={20} className="text-accent-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-ink-500 dark:text-paper-200">Manage election candidates</p>
          </div>
        </div>
        <button
          onClick={() => { setShowAdd(true); setForm(EMPTY_FORM); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-ink-500 dark:text-paper-200 font-medium uppercase tracking-wider">Candidates</p>
          <p className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50 mt-1">{candidates.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-500 dark:text-paper-200 font-medium uppercase tracking-wider">Total Votes</p>
          <p className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50 mt-1">{totalVotes}</p>
        </div>
        <div className="card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-ink-500 dark:text-paper-200 font-medium uppercase tracking-wider">Leading Party</p>
          <p className="font-display text-lg font-bold text-vote-500 mt-1 truncate">
            {candidates[0]?.party || '—'}
          </p>
        </div>
      </div>

      {/* Candidate table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-vote-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="mx-auto text-ink-500 mb-3" />
          <p className="font-medium text-ink-600 dark:text-paper-200">No candidates yet.</p>
          <p className="text-sm text-ink-500 dark:text-paper-200 mt-1">Click "Add Candidate" to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper-200 dark:border-ink-700 bg-paper-50 dark:bg-ink-800/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Party</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Age</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Votes</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Share</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => {
                  const pct = totalVotes > 0 ? ((c.count / totalVotes) * 100).toFixed(1) : '0.0';
                  return (
                    <tr
                      key={c._id || c.party}
                      className="border-b border-paper-100 dark:border-ink-700 last:border-0 hover:bg-paper-50 dark:hover:bg-ink-800/40 transition-colors"
                    >
                      <td className="px-5 py-4 text-ink-500 dark:text-paper-200 font-medium">{i + 1}</td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-ink-900 dark:text-paper-50">{c.name || '—'}</span>
                      </td>
                      <td className="px-5 py-4 text-ink-700 dark:text-paper-100">{c.party}</td>
                      <td className="px-5 py-4 text-ink-600 dark:text-paper-200">{c.age || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-vote-500">{c.count}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-paper-100 dark:bg-ink-700 rounded-full overflow-hidden">
                            <div className="h-full bg-vote-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-ink-500 dark:text-paper-200">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => openEdit(c)}
                            className="p-2 rounded-lg text-ink-500 hover:text-vote-500 hover:bg-vote-500/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="p-2 rounded-lg text-ink-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Candidate" onClose={() => setShowAdd(false)}>
          <CandidateForm
            form={form}
            onChange={setForm}
            onSubmit={handleAdd}
            loading={actionLoading}
            submitLabel="Add Candidate"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title="Edit Candidate" onClose={() => setEditTarget(null)}>
          <CandidateForm
            form={form}
            onChange={setForm}
            onSubmit={handleEdit}
            loading={actionLoading}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal title="Delete Candidate" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">
                Are you sure you want to remove <strong>{deleteTarget.name || deleteTarget.party}</strong> from the election?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="btn-danger flex-1"
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting…
                  </span>
                ) : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}