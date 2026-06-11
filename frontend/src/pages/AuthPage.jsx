import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitting) {
    return <Loader fullScreen label="Signing you in..." />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_24%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <p className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-sky-300">
            Real-time systems engineering
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Chat like a product, not a demo.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Private messages, room collaboration, live presence, typing indicators, delivery status, and responsive design, all backed by JWT, Socket.io, and MongoDB.
          </p>
          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ['JWT Auth', 'Secure sessions and protected endpoints'],
              ['Live sockets', 'Private chat and rooms without refresh'],
              ['MongoDB', 'History, presence, and room membership'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur">
                <div className="font-medium text-white">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-sky-400">Welcome back</div>
              <h2 className="mt-1 text-2xl font-semibold text-white">{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h2>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400"
            >
              {mode === 'login' ? 'Switch to register' : 'Switch to login'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' ? (
              <input
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                placeholder="Username"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500"
              />
            ) : null}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500"
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500"
            />
            {mode === 'register' ? (
              <input
                value={form.avatar}
                onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                placeholder="Avatar URL (optional)"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500"
              />
            ) : null}
            {error ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
