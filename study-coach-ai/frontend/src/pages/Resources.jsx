import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import { Clock, Library, ChevronRight, Calculator, Microscope, BookOpen, Code, Star, Globe } from 'lucide-react';

const CATEGORIES = ['All', 'Mathematics', 'Biology', 'English', 'Computer Science', 'Science', 'History', 'Elementary Basics'];

const ICON_MAP = {
  Mathematics: Calculator,
  Biology: Microscope,
  English: BookOpen,
  'Computer Science': Code,
  Science: Star,
  History: Globe,
  'Elementary Basics': Star,
};

const COLOR_MAP = {
  Mathematics: { color: '#4f46e5', bg: '#eef2ff' },
  Biology: { color: '#059669', bg: '#ecfdf5' },
  English: { color: '#7c3aed', bg: '#f5f3ff' },
  'Computer Science': { color: '#0891b2', bg: '#ecfeff' },
  Science: { color: '#d97706', bg: '#fffbeb' },
  History: { color: '#dc2626', bg: '#fee2e2' },
  'Elementary Basics': { color: '#f59e0b', bg: '#fffbeb' },
};

const levelBadgeClass = (level) => ({
  'All Levels': 'badge--blue',
  'Elementary': 'badge--green',
  'Beginner': 'badge--green',
  'High School': 'badge--yellow',
  'Intermediate': 'badge--yellow',
  'University': 'badge--purple',
  'Advanced': 'badge--purple',
}[level] || 'badge--gray');

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/resources')
      .then(({ data }) => setResources(data))
      .catch(() => setError('Failed to load resources. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning Resources</h1>
          <p className="page-subtitle">Curated study materials — click any card to start learning</p>
        </div>
        <div className="resources-search-wrap">
          <input
            type="text"
            className="form-input"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="resources-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !error ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon"><Library size={28} /></div>
          <h3>No resources found</h3>
          <p>Try a different category or search term.</p>
          <button className="btn btn--ghost" onClick={() => { setActiveCategory('All'); setSearch(''); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="resources-grid">
          {filtered.map((resource) => {
            const Icon = ICON_MAP[resource.category] || BookOpen;
            const colors = COLOR_MAP[resource.category] || { color: '#4f46e5', bg: '#eef2ff' };
            return (
              <div key={resource._id} className="resource-card">
                <div className="resource-card__top">
                  <div className="resource-card__icon" style={{ background: colors.bg }}>
                    <Icon size={22} color={colors.color} />
                  </div>
                  <div className="resource-card__badges">
                    <span className="badge badge--gray">{resource.category}</span>
                    <span className={`badge ${levelBadgeClass(resource.level)}`}>{resource.level}</span>
                  </div>
                </div>
                <h3 className="resource-card__title">{resource.title}</h3>
                <p className="resource-card__desc">{resource.description}</p>
                <div className="resource-card__meta">
                  <span className="resource-card__meta-item">
                    <Clock size={12} /> {resource.estimatedReadingTime}
                  </span>
                  {resource.keyPoints?.length > 0 && (
                    <span className="resource-card__meta-item">{resource.keyPoints.length} key points</span>
                  )}
                </div>
                <div className="resource-card__action">
                  <Link
                    to={`/resources/${resource._id}`}
                    className="btn btn--primary btn--sm"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    Start Learning <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;
