import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';
import { ClipboardList, Calendar } from 'lucide-react';

const StudyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ topicId: '', learningGoal: '', availableTime: '' });

  useEffect(() => {
    Promise.all([fetchPlans(), fetchTopics()]).finally(() => setLoading(false));
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/study-plans');
      setPlans(data);
    } catch {
      setError('Failed to load study plans.');
    }
  };

  const fetchTopics = async () => {
    try {
      const { data } = await api.get('/topics');
      setTopics(data);
    } catch {}
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.topicId) return setError('Please select a topic.');
    setError('');
    setSuccess('');
    setGenerating(true);
    try {
      await api.post('/study-plans/generate', form);
      setSuccess('Study plan generated successfully!');
      setShowForm(false);
      setForm({ topicId: '', learningGoal: '', availableTime: '' });
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study plan?')) return;
    try {
      await api.delete(`/study-plans/${id}`);
      setSuccess('Study plan deleted.');
      if (selectedPlan?._id === id) setSelectedPlan(null);
      fetchPlans();
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Plans</h1>
          <p className="page-subtitle">Generate personalized study plans for your topics</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
        >
          {showForm ? 'Cancel' : '+ Generate Plan'}
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      {showForm && (
        <div className="card form-card">
          <h2 className="card-title">Generate a Study Plan</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Select Topic *</label>
              <select
                className="form-input"
                value={form.topicId}
                onChange={(e) => setForm({ ...form, topicId: e.target.value })}
              >
                <option value="">Choose a topic</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} — {t.subjectId?.name || 'Unknown Subject'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Learning Goal <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. I want to understand this topic for a school test"
                value={form.learningGoal}
                onChange={(e) => setForm({ ...form, learningGoal: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Available Study Time <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 45 minutes, 1 hour"
                value={form.availableTime}
                onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={generating}>
                {generating ? 'Generating...' : 'Generate Study Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPlan && (
        <div className="card study-plan-view">
          <div className="card-header">
            <h2 className="card-title">{selectedPlan.title}</h2>
            <button className="btn btn--ghost btn--sm" onClick={() => setSelectedPlan(null)}>Close</button>
          </div>
          <div className="study-plan-meta">
            <span><strong>Topic:</strong> {selectedPlan.topicId?.title}</span>
            <span><strong>Subject:</strong> {selectedPlan.subjectId?.name}</span>
            {selectedPlan.availableTime && <span><strong>Time:</strong> {selectedPlan.availableTime}</span>}
            {selectedPlan.learningGoal && <span><strong>Goal:</strong> {selectedPlan.learningGoal}</span>}
          </div>
          <div className="study-plan-content">
            {selectedPlan.plan.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h2 key={i} className="plan-h1">{line.replace('# ', '')}</h2>;
              if (line.startsWith('## ')) return <h3 key={i} className="plan-h2">{line.replace('## ', '')}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} className="plan-h3">{line.replace('### ', '')}</h4>;
              if (line.startsWith('- ')) return <li key={i} className="plan-li">{line.replace('- ', '')}</li>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="plan-bold">{line.replace(/\*\*/g, '')}</p>;
              if (line.trim() === '---') return <hr key={i} className="plan-hr" />;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="plan-p">{line}</p>;
            })}
          </div>
          {selectedPlan.recommendations?.length > 0 && (
            <div className="recommendations">
              <h3 className="recommendations__title">Recommendations</h3>
              <ul>
                {selectedPlan.recommendations.map((rec, i) => (
                  <li key={i} className="recommendations__item">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <ClipboardList size={28} />
          </div>
          <h3>No study plans yet</h3>
          <p>Generate a personalized study plan for any of your topics to get started.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            Generate Study Plan
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="item-card">
              <div className="item-card__header">
                <div className="item-card__icon-wrap">
                  <ClipboardList size={20} color="#7c3aed" />
                </div>
                <div className="item-card__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => setSelectedPlan(plan)}>View</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(plan._id)}>Delete</button>
                </div>
              </div>
              <h3 className="item-card__title">{plan.topicId?.title || plan.title}</h3>
              <p className="item-card__desc">
                {plan.subjectId?.name && <span>Subject: {plan.subjectId.name}</span>}
                {plan.availableTime && <span> · {plan.availableTime}</span>}
              </p>
              {plan.learningGoal && (
                <p className="item-card__desc">{plan.learningGoal}</p>
              )}
              <div className="item-card__meta">
                <Calendar size={12} />
                {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlans;
