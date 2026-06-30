import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel — visible on desktop */}
      <div className="auth-left">
        <div className="auth-left__brand">
          <div className="auth-left__logo">
            <GraduationCap size={20} color="#fff" />
          </div>
          Study Coach AI
        </div>

        <div className="auth-left__content">
          <h1 className="auth-left__title">
            Your personal<br />
            <span>learning coach</span><br />
            is waiting.
          </h1>
          <p className="auth-left__sub">
            Sign in to access your subjects, study plans, quizzes, and progress tracking — all in one place.
          </p>
          <ul className="auth-left__features">
            {[
              'Personalized AI study plans',
              'Interactive quiz generation',
              'Progress & weak area tracking',
              'Curated learning resources',
            ].map((f) => (
              <li key={f} className="auth-left__feature">
                <span className="auth-left__feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ color: '#475569', fontSize: '13px', position: 'relative', zIndex: 1 }}>
          © 2024 Study Coach AI
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-header__mobile-brand">
              <GraduationCap size={22} color="#4f46e5" />
              Study Coach AI
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue your learning journey</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="auth-btn-wrapper">
              <button
                type="submit"
                className="btn btn--primary btn--full"
                style={{ padding: '11px', fontSize: '15px' }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
