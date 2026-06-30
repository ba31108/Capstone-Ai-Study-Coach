import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import Loading from '../../components/Loading';
import {
  Users, BookOpen, Brain, ClipboardList, FileText,
  TrendingUp, Plus, Eye, CheckCircle, Archive, Edit3,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-card__icon" style={{ background: bg, color }}>
      <Icon size={20} />
    </div>
    <div className="admin-stat-card__body">
      <div className="admin-stat-card__value">{value ?? '—'}</div>
      <div className="admin-stat-card__label">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Platform overview and quick management</p>
        </div>
        <Link to="/admin/resources/new" className="btn btn--primary">
          <Plus size={15} /> Add Resource
        </Link>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {stats && (
        <>
          {/* Main stats */}
          <div className="admin-stats-grid">
            <StatCard label="Total Students" value={stats.totalStudents} icon={Users} color="#4f46e5" bg="#eef2ff" />
            <StatCard label="Total Resources" value={stats.totalResources} icon={BookOpen} color="#059669" bg="#ecfdf5" />
            <StatCard label="Published Resources" value={stats.publishedResources} icon={CheckCircle} color="#059669" bg="#d1fae5" />
            <StatCard label="Draft Resources" value={stats.draftResources} icon={Edit3} color="#d97706" bg="#fef3c7" />
            <StatCard label="Archived Resources" value={stats.archivedResources} icon={Archive} color="#6b7280" bg="#f3f4f6" />
            <StatCard label="Total Quizzes" value={stats.totalQuizzes} icon={Brain} color="#7c3aed" bg="#f5f3ff" />
            <StatCard label="Quiz Results" value={stats.totalQuizResults} icon={TrendingUp} color="#0891b2" bg="#ecfeff" />
            <StatCard label="Study Plans" value={stats.totalStudyPlans} icon={ClipboardList} color="#dc2626" bg="#fee2e2" />
            <StatCard label="PDF Lectures" value={stats.totalLectures} icon={FileText} color="#b45309" bg="#fef3c7" />
          </div>

          {/* Quick actions */}
          <div className="admin-section">
            <h2 className="admin-section-title">Quick Actions</h2>
            <div className="admin-actions-row">
              <Link to="/admin/resources/new" className="admin-quick-btn admin-quick-btn--green">
                <Plus size={18} /> Add Resource
              </Link>
              <Link to="/admin/students" className="admin-quick-btn admin-quick-btn--indigo">
                <Eye size={18} /> View Students
              </Link>
              <Link to="/admin/resources" className="admin-quick-btn admin-quick-btn--purple">
                <BookOpen size={18} /> Manage Resources
              </Link>
            </div>
          </div>

          {/* Recent students */}
          {stats.recentStudents?.length > 0 && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2 className="admin-section-title">Recent Students</h2>
                <Link to="/admin/students" className="admin-section-link">View all →</Link>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Grade Level</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentStudents.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="admin-student-cell">
                            <div className="admin-avatar">{s.name.charAt(0).toUpperCase()}</div>
                            {s.name}
                          </div>
                        </td>
                        <td>{s.email}</td>
                        <td>{s.gradeLevel || '—'}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
