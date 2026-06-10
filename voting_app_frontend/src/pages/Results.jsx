import { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart3, RefreshCw, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

function PartyColor(party) {
  const palette = ['#1D6FE8', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#14B8A6'];
  return palette[party.charCodeAt(0) % palette.length];
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/candidate/vote/count');
      setResults(res.data);
    } catch {
      toast.error('Failed to load results.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchResults(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const totalVotes = results.reduce((s, r) => s + (r.count || 0), 0);
  const winner = results[0];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-vote-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            Live Results
          </h1>
          <p className="text-ink-500 dark:text-paper-200 mt-1 text-sm">
            Auto-refreshes every 30 seconds · {totalVotes} total votes
          </p>
        </div>
        <button
          onClick={() => fetchResults(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Winner card */}
      {winner && winner.count > 0 && (
        <div className="card p-5 mb-6 bg-gradient-to-r from-vote-500/10 to-transparent border-vote-500/30">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-accent-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-ink-500 dark:text-paper-200 uppercase tracking-wider">Currently Leading</p>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-paper-50">{winner.party}</p>
              <p className="text-sm text-vote-500 font-semibold mt-0.5">
                {winner.count} votes · {totalVotes > 0 ? ((winner.count / totalVotes) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results list */}
      {results.length === 0 ? (
        <div className="card p-12 text-center">
          <BarChart3 size={40} className="mx-auto text-ink-500 mb-3" />
          <p className="text-ink-600 dark:text-paper-200 font-medium">No votes recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => {
            const pct = totalVotes > 0 ? (r.count / totalVotes) * 100 : 0;
            const color = PartyColor(r.party);
            return (
              <div key={r.party} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-ink-500 dark:text-paper-200 bg-paper-100 dark:bg-ink-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900 dark:text-paper-50">{r.party}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-ink-900 dark:text-paper-50">{r.count}</p>
                    <p className="text-xs text-ink-500 dark:text-paper-200">{pct.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="h-2.5 bg-paper-100 dark:bg-ink-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}