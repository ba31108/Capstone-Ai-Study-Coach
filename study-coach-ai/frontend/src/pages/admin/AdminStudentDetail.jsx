import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminStudentById } from '../../api/adminApi';
import Loading from '../../components/Loading';
import {
  ArrowLeft, User, BookOpen, FileText, Brain,
  ClipboardList, TrendingUp, AlertCircle, ChevronRight,
} from 'lucide-react';

const StatPill = ({ label, value, color }) => (
  <div className="admin-detail-stat">
    <div className="admin-detail-stat__value" style={{ color }}>{value ?? '—'}</div>
    <div className="admin-detail-stat__label">{label}</div>
  </div>
);

const AdminStudentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStudentById(id)
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load student details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return (
    <div className="admin-page">
      <div className="alert alert--error">{error}</div>
      <Link to="/admin/students" className="btn btn--ghost" style={{ marginTop: 16 }}>
        <ArrowLeft size={14} /> Back to Students
      </Link>
    </div>
  );

  const { student, stats, recentQuizResults } = data;

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">
        <Link to="/admin/students" className="admin-breadcrumb__link">
          <ArrowLeft size={14} /> Students
        </Link>
        <ChevronRight size={14} />
        <span>{student.name}</span>
      </div>

      {/* Profile card */}
      <div className="admin-profile-card">
        <div className="admin-profile-avatar">{student.name.charAt(0).toUpperCase()}</div>
        <div className="admin-profile-info">
          <h2 className="admin-profile-name">{student.name}</h2>
          <p className="admin-profile-email">{student.email}</p>
          <div className="admin-profile-meta">
            <span className="badge badge--blue">{student.gradeLevel || 'No Grade Set'}</span>
            <span className="badge badge--gray">Student</span>
            <span className="admin-cell-muted">Joined {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Learning stats */}
      <div className="admin-section">
        <h3 className="admin-section-title">Learning Statistics</h3>
        <div className="admin-detail-stats">
          <StatPill label="Subjects" value={stats.subjects} color="#4f46e5" />
          <StatPill label="Topics" value={stats.topics} color="#059669" />
          <StatPill label="Lectures" value={stats.lectures} color="#b45309" />
          <StatPill label="Quizzes Taken" value={stats.quizResultsCount} color="#7c3aed" />
          <StatPill label="Study Plans" value={stats.studyPlans} color="#dc2626" />
          <StatPill
            label="Avg. Quiz Score"
            value={stats.avgScore !== null ? `${stats.avgScore}%` : 'N/A'}
            color={stats.avgScore >= 70 ? '#059669' : '#d97706'}
          />
        </div>
      </div>

      {/* Weak areas */}
      {stats.weakAreas?.length > 0 && (
        <div className="admin-section">
          <h3 className="admin-section-title">
            <AlertCircle size={15} style={{ color: '#d97706', marginRight: 6 }} />
            Identified Weak Areas
          </h3>
          <div className="admin-weak-areas">
            {stats.weakAreas.map((area, i) => (
              <span key={i} className="admin-weak-badge">{area}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recent quiz results */}
      {recentQuizResults?.length > 0 && (
        <div className="admin-section">
          <h3 className="admin-section-title">Recent Quiz Activity</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {recentQuizResults.map((r) => (
                  <tr key={r._id}>
                    <td className="admin-cell-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><strong>{r.percentage}%</strong></td>
                    <td>
                      <span className={`badge ${r.percentage >= 70 ? 'badge--green' : 'badge--red'}`}>
                        {r.percentage >= 70 ? 'Passed' : 'Needs Work'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentDetail;
