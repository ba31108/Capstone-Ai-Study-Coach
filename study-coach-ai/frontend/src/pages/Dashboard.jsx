import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { BookOpen, FileText, ClipboardList, PenSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome__left">
          <h1 className="dashboard-welcome__greeting">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard-welcome__sub">
            Here's an overview of your learning progress today
          </p>
        </div>
        <div className="dashboard-welcome__actions">
          <Link to="/study-plans" className="btn dashboard-welcome__btn-main">
            Generate Study Plan
          </Link>
          <Link to="/quizzes" className="btn dashboard-welcome__btn-secondary">
            Take a Quiz
          </Link>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {stats && (
        <>
          {/* Progress Banner */}
          {stats.totalTopics > 0 && (
            <div className="progress-banner">
              <div>
                <div className="progress-banner__label">Overall Learning Progress</div>
                <div className="progress-banner__sub">
                  {stats.completedTopics} of {stats.totalTopics} topics completed
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${stats.overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="progress-banner__value">{stats.overallProgress}%</div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="stats-grid">
            <StatCard title="Total Subjects" value={stats.totalSubjects} color="blue" />
            <StatCard title="Total Topics" value={stats.totalTopics} color="purple" />
            <StatCard title="Completed" value={stats.completedTopics} color="green" subtitle="topics done" />
            <StatCard title="In Progress" value={stats.inProgressTopics} color="teal" subtitle={`${stats.notStartedTopics} not started`} />
            <StatCard title="Study Plans" value={stats.totalStudyPlans} color="orange" />
            <StatCard title="Quizzes Taken" value={stats.totalQuizResults} color="red" />
            <StatCard title="Avg Quiz Score" value={`${stats.averageQuizScore}%`} color="indigo" />
            <StatCard title="Progress" value={`${stats.overallProgress}%`} color="yellow" subtitle="overall completion" />
          </div>

          {/* Recent Results + Weak Areas */}
          <div className="dashboard-bottom">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Quiz Results</h2>
                <Link to="/quiz-results" className="btn btn--ghost btn--sm">
                  View All
                </Link>
              </div>
              {stats.latestQuizResults.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px 0' }}>
                  <p>No quiz results yet. Take a quiz to see your progress here.</p>
                  <Link to="/quizzes" className="btn btn--primary btn--sm" style={{ marginTop: '12px' }}>
                    Take a Quiz
                  </Link>
                </div>
              ) : (
                <div className="results-list">
                  {stats.latestQuizResults.map((result) => (
                    <div key={result._id} className="result-item">
                      <div className="result-item__info">
                        <span className="result-item__title">
                          {result.topicId?.title || 'Unknown Topic'}
                        </span>
                        <span className="result-item__subject">
                          {result.subjectId?.name || ''}
                        </span>
                      </div>
                      <div
                        className={`result-item__score ${
                          result.percentage >= 70 ? 'score--good' : 'score--poor'
                        }`}
                      >
                        {result.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Weak Areas</h2>
              </div>
              {stats.weakAreas.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px 0' }}>
                  <p>No weak areas identified yet. Take quizzes to see what you need to review.</p>
                </div>
              ) : (
                <ul className="weak-areas-list">
                  {stats.weakAreas.slice(0, 8).map((area, idx) => (
                    <li key={idx} className="weak-area-item">
                      <span className="weak-area-dot" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/subjects" className="quick-action-card">
                <div className="quick-action-icon">
                  <BookOpen size={20} />
                </div>
                <span>Add Subject</span>
              </Link>
              <Link to="/topics" className="quick-action-card">
                <div className="quick-action-icon">
                  <FileText size={20} />
                </div>
                <span>Add Topic</span>
              </Link>
              <Link to="/study-plans" className="quick-action-card">
                <div className="quick-action-icon">
                  <ClipboardList size={20} />
                </div>
                <span>Study Plan</span>
              </Link>
              <Link to="/quizzes" className="quick-action-card">
                <div className="quick-action-icon">
                  <PenSquare size={20} />
                </div>
                <span>Take a Quiz</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
