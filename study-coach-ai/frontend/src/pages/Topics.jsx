import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import { FileText } from 'lucide-react';

const statusOptions = ['not_started', 'in_progress', 'completed'];
const difficultyOptions = ['easy', 'medium', 'hard'];

const statusLabel = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' };
const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

const getStatusClass = (status) =>
  ({ not_started: 'badge--gray', in_progress: 'badge--blue', completed: 'badge--green' }[status] || '');

const getDifficultyClass = (d) =>
  ({ easy: 'badge--green', medium: 'badge--yellow', hard: 'badge--red' }[d] || '');

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', status: 'not_started',
    difficulty: 'medium', subjectId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    Promise.all([fetchTopics(), fetchSubjects()]).finally(() => setLoading(false));
  }, []);

  const fetchTopics = async () => {
    try {
      const { data } = await api.get('/topics');
      setTopics(data);
    } catch {
      setError('Failed to load topics.');
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch {}
  };

  const resetForm = () => {
    setForm({ title: '', description: '', status: 'not_started', difficulty: 'medium', subjectId: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.subjectId) return setError('Please select a subject.');
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/topics/${editingId}`, {
          title: form.title,
          description: form.description,
          status: form.status,
          difficulty: form.difficulty,
        });
        setSuccess('Topic updated.');
      } else {
        await api.post('/topics', form);
        setSuccess('Topic created.');
      }
      resetForm();
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (topic) => {
    setForm({
      title: topic.title, description: topic.description,
      status: topic.status, difficulty: topic.difficulty,
      subjectId: topic.subjectId?._id || topic.subjectId,
    });
    setEditingId(topic._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await api.delete(`/topics/${id}`);
      setSuccess('Topic deleted.');
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredTopics = filterStatus === 'all'
    ? topics
    : topics.filter((t) => t.status === filterStatus);

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Topics</h1>
          <p className="page-subtitle">Manage topics inside your subjects</p>
        </div>
        <button className="btn btn--primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Topic
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      {showForm && (
        <div className="card form-card">
          <h2 className="card-title">{editingId ? 'Edit Topic' : 'New Topic'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Topic Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Photosynthesis, Newton's Laws"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              {!editingId && (
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select
                    className="form-input"
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Description <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                className="form-input form-textarea"
                placeholder="Describe what this topic covers"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-input"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                >
                  {difficultyOptions.map((d) => (
                    <option key={d} value={d}>{difficultyLabel[d]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Topic' : 'Create Topic'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by status */}
      {topics.length > 0 && (
        <div className="resources-filter" style={{ marginBottom: '16px' }}>
          {['all', ...statusOptions].map((s) => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All Topics' : statusLabel[s]}
            </button>
          ))}
        </div>
      )}

      {topics.length === 0 && !showForm ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <FileText size={28} />
          </div>
          <h3>No topics yet</h3>
          <p>Add topics to your subjects to start generating study plans and quizzes.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>Add Topic</button>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon"><FileText size={28} /></div>
          <h3>No topics with this status</h3>
          <p>Try a different filter or add more topics.</p>
        </div>
      ) : (
        <div className="topics-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic._id}>
                  <td>
                    <div className="topic-cell__title">{topic.title}</div>
                    {topic.description && (
                      <div className="topic-cell__desc">{topic.description}</div>
                    )}
                  </td>
                  <td>{topic.subjectId?.name || '—'}</td>
                  <td>
                    <span className={`badge ${getStatusClass(topic.status)}`}>
                      {statusLabel[topic.status]}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getDifficultyClass(topic.difficulty)}`}>
                      {difficultyLabel[topic.difficulty]}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link className="btn btn--primary btn--sm" to={`/topics/${topic._id}`}>Open</Link>
                      <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(topic)}>Edit</button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(topic._id)}>Delete</button>
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

export default Topics;
