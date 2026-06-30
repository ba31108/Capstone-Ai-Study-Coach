import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList,
  PenSquare, TrendingUp, Library, User, LogOut, Menu, X, GraduationCap, Brain,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/topics', label: 'Topics', icon: FileText },
  { to: '/study-plans', label: 'Study Plans', icon: ClipboardList },
  { to: '/quizzes', label: 'Quizzes', icon: PenSquare },
  { to: '/quiz-results', label: 'Quiz Results', icon: TrendingUp },
  { to: '/smart-lecture', label: 'Smart Lecture', icon: Brain },
  { to: '/resources', label: 'Resources', icon: Library },
  { to: '/profile', label: 'Profile', icon: User },
];

const SidebarContent = ({ onLinkClick, user, onLogout }) => (
  <>
    <div className="sidebar__brand">
      <div className="sidebar__logo">
        <GraduationCap size={20} color="#fff" />
      </div>
      <div className="sidebar__brand-text">
        <span className="sidebar__name">Study Coach AI</span>
        <span className="sidebar__tagline">Learning Assistant</span>
      </div>
    </div>

    <nav className="sidebar__nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">
              <Icon size={16} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>

    <div className="sidebar__footer">
      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{user?.name}</span>
          <span className="sidebar__user-grade">{user?.gradeLevel || 'Student'}</span>
        </div>
      </div>
      <button className="sidebar__logout" onClick={onLogout}>
        <LogOut size={13} />
        Sign Out
      </button>
    </div>
  </>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <>
      <aside className="sidebar">
        <SidebarContent
          user={user}
          onLinkClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      <header className="mobile-header">
        <div className="mobile-header__brand">
          <GraduationCap size={20} color="#4f46e5" />
          <span>Study Coach AI</span>
        </div>
        <button
          className="mobile-header__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar sidebar--mobile">
            <SidebarContent
              user={user}
              onLinkClick={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
