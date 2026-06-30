import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStudents } from '../../api/adminApi';
import Loading from '../../components/Loading';
import { Users, Search, Eye, ChevronRight } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Students</h1>
          <p className="admin-page-subtitle">{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {/* Search */}
      <div className="admin-search-bar">
        <Search size={16} className="admin-search-icon" />
        <input
          className="admin-search-input"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <Users size={36} />
          <h3>No students found</h3>
          <p>{search ? 'Try a different search term.' : 'No students have registered yet.'}</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Subjects</th>
                <th>Topics</th>
                <th>Quizzes</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="admin-student-cell">
                      <div className="admin-avatar">{s.name.charAt(0).toUpperCase()}</div>
                      <span className="admin-student-name">{s.name}</span>
                    </div>
                  </td>
                  <td className="admin-cell-muted">{s.email}</td>
                  <td>{s.gradeLevel || <span className="admin-cell-muted">—</span>}</td>
                  <td><span className="admin-count-badge">{s.subjects}</span></td>
                  <td><span className="admin-count-badge">{s.topics}</span></td>
                  <td><span className="admin-count-badge">{s.quizResults}</span></td>
                  <td className="admin-cell-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/students/${s._id}`} className="admin-view-btn">
                      <Eye size={14} /> View <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
