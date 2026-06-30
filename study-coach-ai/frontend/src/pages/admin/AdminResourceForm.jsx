import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  createAdminResource,
  updateAdminResource,
  getAdminResources,
} from '../../api/adminApi';
import Loading from '../../components/Loading';
import { ArrowLeft, Plus, Trash2, Save, Loader } from 'lucide-react';

const CATEGORIES = ['Mathematics', 'Biology', 'English', 'Computer Science', 'Science', 'History', 'Elementary Basics'];
const LEVELS = ['Elementary', 'Beginner', 'High School', 'Intermediate', 'University', 'Advanced', 'All Levels'];
const STATUSES = ['draft', 'published', 'archived'];

const empty = {
  title: '',
  category: 'Mathematics',
  level: 'High School',
  description: '',
  content: '',
  estimatedReadingTime: '~20 min',
  status: 'draft',
  keyPoints: [''],
  recommendedPractice: [''],
};

const AdminResourceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    // Fetch single resource via admin list with no filter then find by id
    // We use the admin resources list and find the matching one
    getAdminResources({})
      .then(({ data }) => {
        const res = data.find((r) => r._id === id);
        if (!res) { setError('Resource not found.'); return; }
        setForm({
          title: res.title,
          category: res.category,
          level: res.level,
          description: res.description,
          content: res.content || '',
          estimatedReadingTime: res.estimatedReadingTime || '~20 min',
          status: res.status,
          keyPoints: res.keyPoints?.length ? res.keyPoints : [''],
          recommendedPractice: res.recommendedPractice?.length ? res.recommendedPractice : [''],
        });
      })
      .catch(() => setError('Failed to load resource.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const setListItem = (field, index, value) => {
    const arr = [...form[field]];
    arr[index] = value;
    setField(field, arr);
  };

  const addListItem = (field) => setField(field, [...form[field], '']);

  const removeListItem = (field, index) =>
    setField(field, form[field].filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      keyPoints: form.keyPoints.filter((k) => k.trim() !== ''),
      recommendedPractice: form.recommendedPractice.filter((p) => p.trim() !== ''),
    };

    try {
      if (isEdit) {
        await updateAdminResource(id, payload);
      } else {
        await createAdminResource(payload);
      }
      navigate('/admin/resources');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">
        <Link to="/admin/resources" className="admin-breadcrumb__link">
          <ArrowLeft size={14} /> Resources
        </Link>
        <span>›</span>
        <span>{isEdit ? 'Edit Resource' : 'New Resource'}</span>
      </div>

      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Edit Resource' : 'Add New Resource'}</h1>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Basic info */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Introduction to Algebra"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category} onChange={(e) => setField('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Level *</label>
              <select className="form-input" value={form.level} onChange={(e) => setField('level', e.target.value)}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated Reading Time</label>
              <input
                className="form-input"
                type="text"
                value={form.estimatedReadingTime}
                onChange={(e) => setField('estimatedReadingTime', e.target.value)}
                placeholder="~20 min"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description * <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: 12 }}>(short summary shown on resource cards)</span></label>
            <textarea
              className="form-input form-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Brief description shown to students on the resources page"
              required
            />
          </div>
        </div>

        {/* Content */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Learning Content</h3>
          <p className="admin-form-hint">Write full learning material here. Supports Markdown: ## Heading, **bold**, - list item</p>
          <textarea
            className="form-input admin-content-textarea"
            rows={18}
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            placeholder="## Introduction&#10;&#10;Write the full learning content here...&#10;&#10;## Key Concepts&#10;&#10;- Concept 1&#10;- Concept 2"
          />
        </div>

        {/* Key Points */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Key Points</h3>
          <p className="admin-form-hint">Summary bullets shown in the "Key Points to Remember" section</p>
          {form.keyPoints.map((kp, i) => (
            <div key={i} className="admin-list-row">
              <input
                className="form-input"
                type="text"
                value={kp}
                onChange={(e) => setListItem('keyPoints', i, e.target.value)}
                placeholder={`Key point ${i + 1}`}
              />
              <button
                type="button"
                className="admin-remove-btn"
                onClick={() => removeListItem('keyPoints', i)}
                disabled={form.keyPoints.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" className="admin-add-list-btn" onClick={() => addListItem('keyPoints')}>
            <Plus size={14} /> Add Key Point
          </button>
        </div>

        {/* Recommended Practice */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Recommended Practice</h3>
          <p className="admin-form-hint">Tasks students should do after reading the resource</p>
          {form.recommendedPractice.map((rp, i) => (
            <div key={i} className="admin-list-row">
              <input
                className="form-input"
                type="text"
                value={rp}
                onChange={(e) => setListItem('recommendedPractice', i, e.target.value)}
                placeholder={`Practice task ${i + 1}`}
              />
              <button
                type="button"
                className="admin-remove-btn"
                onClick={() => removeListItem('recommendedPractice', i)}
                disabled={form.recommendedPractice.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" className="admin-add-list-btn" onClick={() => addListItem('recommendedPractice')}>
            <Plus size={14} /> Add Practice Task
          </button>
        </div>

        {/* Submit */}
        <div className="admin-form-actions">
          <Link to="/admin/resources" className="btn btn--ghost">Cancel</Link>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving
              ? <><Loader size={15} className="spin" /> Saving...</>
              : <><Save size={15} /> {isEdit ? 'Update Resource' : 'Create Resource'}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminResourceForm;
