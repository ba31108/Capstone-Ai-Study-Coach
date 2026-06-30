import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', gradeLevel: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.gradeLevel);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left__brand">
          <div className="auth-left__logo">
            <GraduationCap size={20} color="#fff" />
          </div>
          Study Coach AI
        </div>

        <div className="auth-left__content">
          <h1 className="auth-left__title">
            Start your<br />
            <span>learning journey</span><br />
            today.
          </h1>
          <p className="auth-left__sub">
            Create your free account and get instant access to study plans, quizzes, and progress tracking.
          </p>
          <ul className="auth-left__features">
            {[
              'Works for all grade levels',
              'Personalized study plans',
              'Track weak areas & improve',
              'Free to use, no credit card',
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
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Free forever — no credit card required</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grade Level <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                name="gradeLevel"
                className="form-input"
                placeholder="e.g. High School, University Year 2"
                value={form.gradeLevel}
                onChange={handleChange}
              />
            </div>

            <div className="auth-btn-wrapper">
              <button
                type="submit"
                className="btn btn--primary btn--full"
                style={{ padding: '11px', fontSize: '15px' }}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
