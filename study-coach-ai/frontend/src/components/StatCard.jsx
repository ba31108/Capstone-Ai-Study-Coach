const StatCard = ({ title, value, subtitle, color }) => {
  return (
    <div className={`stat-card stat-card--${color || 'blue'}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__title">{title}</div>
      {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
