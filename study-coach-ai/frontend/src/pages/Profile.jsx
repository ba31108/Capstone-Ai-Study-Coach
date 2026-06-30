import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Mail, GraduationCap, Shield, LogOut, BookOpen, TrendingUp, ClipboardList } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your account information and learning summary</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* LEFT — Profile card */}
        <div className="card profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-role">{user?.gradeLevel || 'Student'}</p>

          <ul className="profile-info-list">
            <li className="profile-info-item">
              <Mail size={15} className="profile-info-item__icon" />
              <span className="profile-info-item__label">Email</span>
              <span className="profile-info-item__value">{user?.email}</span>
            </li>
            <li className="profile-info-item">
              <GraduationCap size={15} className="profile-info-item__icon" />
              <span className="profile-info-item__label">Level</span>
              <span className="profile-info-item__value">{user?.gradeLevel || '—'}</span>
            </li>
            <li className="profile-info-item">
              <Shield size={15} className="profile-info-item__icon" />
              <span className="profile-info-item__label">Role</span>
              <span className="profile-info-item__value" style={{ textTransform: 'capitalize' }}>{user?.role || 'student'}</span>
            </li>
          </ul>

          <button
            className="btn btn--danger btn--full"
            style={{ marginTop: '20px', justifyContent: 'center' }}
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* RIGHT — Details */}
        <div className="profile-details">
          {/* Stats */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Learning Summary</h2>
            </div>
            {stats ? (
              <div className="profile-stats-row">
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.totalSubjects}</div>
                  <div className="profile-stat__label">Subjects</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.completedTopics}</div>
                  <div className="profile-stat__label">Topics Done</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.averageQuizScore}%</div>
                  <div className="profile-stat__label">Avg Score</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.totalStudyPlans}</div>
                  <div className="profile-stat__label">Study Plans</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.totalQuizResults}</div>
                  <div className="profile-stat__label">Quizzes Taken</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat__value">{stats.overallProgress}%</div>
                  <div className="profile-stat__label">Progress</div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--gray-400)', fontSize: '14px', padding: '16px 0' }}>
                Loading stats...
              </div>
            )}
          </div>

          {/* Overall Progress */}
          {stats && stats.totalTopics > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Overall Progress</h2>
                <span className="badge badge--blue">{stats.overallProgress}%</span>
              </div>
              <div className="progress-bar" style={{ height: '10px', marginBottom: '10px' }}>
                <div
                  className="progress-bar__fill"
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                {stats.completedTopics} of {stats.totalTopics} topics completed ·{' '}
                {stats.inProgressTopics} in progress · {stats.notStartedTopics} not started
              </p>
            </div>
          )}

          {/* Quick navigation */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Navigation</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: BookOpen, label: 'My Subjects', to: '/subjects', color: '#4f46e5' },
                { icon: ClipboardList, label: 'Study Plans', to: '/study-plans', color: '#7c3aed' },
                { icon: TrendingUp, label: 'Quiz Results', to: '/quiz-results', color: '#059669' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--gray-100)',
                      textDecoration: 'none',
                      color: 'var(--gray-700)',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = item.color;
                      e.currentTarget.style.color = item.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--gray-100)';
                      e.currentTarget.style.color = 'var(--gray-700)';
                    }}
                  >
                    <Icon size={16} color={item.color} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
