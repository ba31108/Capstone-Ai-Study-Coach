import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Library, ChevronRight } from 'lucide-react';
import { RESOURCES, CATEGORIES, levelBadgeClass } from '../data/resourcesData';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = RESOURCES.filter((r) => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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

      <div className="resources-grid">
        {filtered.map((resource) => {
          const Icon = resource.icon;
          return (
            <div key={resource.id} className="resource-card">
              <div className="resource-card__top">
                <div className="resource-card__icon" style={{ background: resource.bg }}>
                  <Icon size={22} color={resource.color} />
                </div>
                <div className="resource-card__badges">
                  <span className="badge badge--gray">{resource.category}</span>
                  <span className={`badge ${levelBadgeClass(resource.level)}`}>{resource.level}</span>
                </div>
              </div>
              <h3 className="resource-card__title">{resource.title}</h3>
              <p className="resource-card__desc">{resource.desc}</p>
              <div className="resource-card__meta">
                <span className="resource-card__meta-item">
                  <Clock size={12} />
                  {resource.time}
                </span>
                <span className="resource-card__meta-item">
                  {resource.keyPoints?.length || 0} key points
                </span>
              </div>
              <div className="resource-card__action">
                <Link
                  to={`/resources/${resource.id}`}
                  className="btn btn--primary btn--sm"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Start Learning
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <Library size={28} />
          </div>
          <h3>No resources found</h3>
          <p>Try a different category or search term.</p>
          <button className="btn btn--ghost" onClick={() => { setActiveCategory('All'); setSearch(''); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Resources;
