import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Enter the access password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      if (res.ok) {
        navigate('/');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="govuk-width-container govuk-main-wrapper">
      <div className="govuk-grid-row govuk-clearfix">
        <div className="govuk-grid-column-one-half">
          <h1 className="govuk-heading-xl">Access this service</h1>

          <p className="govuk-body">
            This is a restricted prototype. Enter the access password to continue.
          </p>

          {error && (
            <div className="border-4 border-[#d4351c] p-4 mb-6" role="alert">
              <p className="govuk-body font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-1 font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full max-w-xs px-2 py-1 border-2 border-[#0b0c0c] focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-block px-5 py-2 bg-[#00703c] text-white font-bold hover:bg-[#005a30] focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-[0_2px_0_#002d18] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
