import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CheckCircle2, Vote, Users, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function PartyInitial({ party }) {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-orange-500', 'bg-rose-500', 'bg-teal-500',
  ];
  const idx = party.charCodeAt(0) % colors.length;
  return (
    <div className={`w-12 h-12 rounded-xl ${colors[idx]} flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-display font-bold text-lg">{party[0]?.toUpperCase()}</span>
    </div>
  );
}

export default function Candidates() {
  const { user, fetchProfile } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null); // candidateID being voted

  const fetchCandidates = async () => {
    try {
      // Using vote/count to get candidates with vote counts
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

  const handleVote = async (candidateId, candidateName) => {
    setVoting(candidateId);
    try {
      await api.post(`/candidate/vote/${candidateId}`);
      toast.success(`Vote cast for ${candidateName}!`);
      await fetchProfile(); // refresh isVoted status
      await fetchCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cast vote.');
    } finally {
      setVoting(null);
    }
  };

  const isAdmin = user?.role === 'admin';
  const hasVoted = user?.isVoted;
  const totalVotes = candidates.reduce((s, c) => s + (c.count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-vote-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
          Election Candidates
        </h1>
        <p className="text-ink-500 dark:text-paper-200 mt-1">
          {isAdmin
            ? 'Viewing as administrator — manage candidates in the Admin panel.'
            : hasVoted
            ? 'Your vote has been recorded. Thank you for participating.'
            : 'Review the candidates below and cast your vote.'}
        </p>
      </div>

      {/* Status banners */}
      {hasVoted && !isAdmin && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">You have successfully cast your vote in this election.</span>
        </div>
      )}

      {isAdmin && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Administrators cannot cast votes. Use the Admin panel to manage candidates.</span>
        </div>
      )}

      {/* Stats row */}
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
          <p className="text-xs text-ink-500 dark:text-paper-200 font-medium uppercase tracking-wider">Your Status</p>
          <p className={`font-display text-lg font-bold mt-1 ${hasVoted ? 'text-emerald-500' : 'text-vote-500'}`}>
            {isAdmin ? 'Admin' : hasVoted ? 'Voted ✓' : 'Not Voted'}
          </p>
        </div>
      </div>

      {/* Candidates grid */}
      {candidates.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="mx-auto text-ink-500 dark:text-paper-200 mb-3" />
          <p className="text-ink-600 dark:text-paper-200 font-medium">No candidates registered yet.</p>
          <p className="text-ink-500 dark:text-paper-200 text-sm mt-1">Check back later or contact the administrator.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate, i) => {
            const pct = totalVotes > 0 ? ((candidate.count / totalVotes) * 100).toFixed(1) : 0;
            const isLeading = i === 0 && candidate.count > 0;
            return (
              <div key={candidate._id || candidate.party} className={`card p-5 flex flex-col gap-4 relative ${isLeading ? 'ring-2 ring-vote-500' : ''}`}>
                {isLeading && (
                  <span className="absolute top-3 right-3 text-xs bg-vote-500 text-white px-2 py-0.5 rounded-full font-semibold">
                    Leading
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <PartyInitial party={candidate.party} />
                  <div>
                    <p className="font-display font-bold text-ink-900 dark:text-paper-50">{candidate.name || candidate.party}</p>
                    <p className="text-sm text-ink-500 dark:text-paper-200">{candidate.party}</p>
                  </div>
                </div>

                {/* Vote bar */}
                <div>
                  <div className="flex justify-between text-xs text-ink-500 dark:text-paper-200 mb-1.5">
                    <span>{candidate.count} votes</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-paper-100 dark:bg-ink-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-vote-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Vote button */}
                {!isAdmin && !hasVoted && (
                  <button
                    onClick={() => handleVote(candidate._id, candidate.name || candidate.party)}
                    disabled={voting === candidate._id}
                    className="btn-primary flex items-center justify-center gap-2 mt-auto"
                  >
                    {voting === candidate._id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Vote size={15} />
                    )}
                    {voting === candidate._id ? 'Casting…' : 'Cast Vote'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}