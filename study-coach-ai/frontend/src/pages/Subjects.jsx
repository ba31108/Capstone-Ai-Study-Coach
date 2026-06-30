import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';
import { BookOpen, Calendar } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, form);
        setSuccess('Subject updated successfully.');
      } else {
        await api.post('/subjects', form);
        setSuccess('Subject created successfully.');
      }
      resetForm();
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setForm({ name: subject.name, description: subject.description });
    setEditingId(subject._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject? All related topics will still exist.')) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSuccess('Subject deleted.');
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">Organize your school subjects in one place</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Add Subject
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      {showForm && (
        <div className="card form-card">
          <h2 className="card-title">{editingId ? 'Edit Subject' : 'New Subject'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Biology, Mathematics, History"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                className="form-input form-textarea"
                placeholder="Brief description of this subject"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Subject' : 'Create Subject'}
              </button>
            </div>
          </form>
        </div>
      )}

      {subjects.length === 0 && !showForm ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <BookOpen size={28} />
          </div>
          <h3>No subjects yet</h3>
          <p>Add your first subject to get started with your learning journey.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            Add Subject
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {subjects.map((subject) => (
            <div key={subject._id} className="item-card">
              <div className="item-card__header">
                <div className="item-card__icon-wrap">
                  <BookOpen size={20} color="#4f46e5" />
                </div>
                <div className="item-card__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(subject)}>
                    Edit
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(subject._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <h3 className="item-card__title">{subject.name}</h3>
              {subject.description && (
                <p className="item-card__desc">{subject.description}</p>
              )}
              <div className="item-card__meta">
                <Calendar size={12} />
                Added {new Date(subject.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
