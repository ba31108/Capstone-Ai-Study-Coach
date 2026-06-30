import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminResources,
  deleteAdminResource,
  patchResourceStatus,
} from '../../api/adminApi';
import Loading from '../../components/Loading';
import {
  BookOpen, Plus, Search, Edit, Trash2, Eye, EyeOff,
  Archive, CheckCircle, FileText,
} from 'lucide-react';

const CATEGORIES = ['All', 'Mathematics', 'Biology', 'English', 'Computer Science', 'Science', 'History', 'Elementary Basics'];
const STATUSES = ['All', 'published', 'draft', 'archived'];

const statusBadge = {
  published: 'badge--green',
  draft: 'badge--yellow',
  archived: 'badge--gray',
};

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [actionLoading, setActionLoading] = useState('');

  const fetchResources = () => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (status !== 'All') params.status = status;
    if (search) params.search = search;
    getAdminResources(params)
      .then(({ data }) => setResources(data))
      .catch(() => setError('Failed to load resources.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, [category, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete resource "${title}"? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await deleteAdminResource(id);
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError('Failed to delete resource.');
    } finally {
      setActionLoading('');
    }
  };

  const handleStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      const { data } = await patchResourceStatus(id, newStatus);
      setResources((prev) => prev.map((r) => (r._id === id ? data : r)));
    } catch {
      setError('Failed to update status.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Resources</h1>
          <p className="admin-page-subtitle">Manage learning content for students</p>
        </div>
        <Link to="/admin/resources/new" className="btn btn--primary">
          <Plus size={15} /> Add Resource
        </Link>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {/* Filters */}
      <div className="admin-filters">
        <form onSubmit={handleSearch} className="admin-search-bar">
          <Search size={16} className="admin-search-icon" />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn--ghost btn--sm">Search</button>
        </form>
        <div className="admin-filter-group">
          <select className="form-input admin-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-input admin-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Loading /> : resources.length === 0 ? (
        <div className="admin-empty">
          <BookOpen size={36} />
          <h3>No resources found</h3>
          <p>Try different filters or add a new resource.</p>
          <Link to="/admin/resources/new" className="btn btn--primary" style={{ marginTop: 12 }}>
            <Plus size={14} /> Add First Resource
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Status</th>
                <th>Reading Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="admin-resource-title-cell">
                      <FileText size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
                      <span>{r.title}</span>
                    </div>
                  </td>
                  <td><span className="badge badge--gray">{r.category}</span></td>
                  <td><span className="badge badge--blue">{r.level}</span></td>
                  <td>
                    <span className={`badge ${statusBadge[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="admin-cell-muted">{r.estimatedReadingTime}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link
                        to={`/admin/resources/${r._id}/edit`}
                        className="admin-action-btn admin-action-btn--edit"
                        title="Edit"
                      >
                        <Edit size={13} />
                      </Link>

                      {r.status !== 'published' && (
                        <button
                          className="admin-action-btn admin-action-btn--publish"
                          title="Publish"
                          disabled={actionLoading === r._id}
                          onClick={() => handleStatus(r._id, 'published')}
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}

                      {r.status !== 'archived' && (
                        <button
                          className="admin-action-btn admin-action-btn--archive"
                          title="Archive"
                          disabled={actionLoading === r._id}
                          onClick={() => handleStatus(r._id, 'archived')}
                        >
                          <Archive size={13} />
                        </button>
                      )}

                      {r.status !== 'draft' && (
                        <button
                          className="admin-action-btn admin-action-btn--draft"
                          title="Set to Draft"
                          disabled={actionLoading === r._id}
                          onClick={() => handleStatus(r._id, 'draft')}
                        >
                          <EyeOff size={13} />
                        </button>
                      )}

                      <button
                        className="admin-action-btn admin-action-btn--delete"
                        title="Delete"
                        disabled={actionLoading === r._id}
                        onClick={() => handleDelete(r._id, r.title)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
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

export default AdminResources;
