import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, LogOut,
  Shield, Menu, X, ChevronRight, GraduationCap,
} from 'lucide-react';

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen },
];

const AdminSidebarContent = ({ onLinkClick, user, onLogout }) => (
  <>
    <div className="admin-sidebar__brand">
      <div className="admin-sidebar__logo">
        <Shield size={18} color="#fff" />
      </div>
      <div className="admin-sidebar__brand-text">
        <span className="admin-sidebar__name">Admin Panel</span>
        <span className="admin-sidebar__sub">Study Coach AI</span>
      </div>
    </div>

    <nav className="admin-sidebar__nav">
      {adminNav.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
            }
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>

    <div className="admin-sidebar__footer">
      <NavLink to="/dashboard" className="admin-sidebar__student-link" onClick={onLinkClick}>
        <GraduationCap size={14} />
        <span>Student View</span>
        <ChevronRight size={12} />
      </NavLink>
      <div className="admin-sidebar__user">
        <div className="admin-sidebar__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="admin-sidebar__user-info">
          <span className="admin-sidebar__user-name">{user?.name}</span>
          <span className="admin-sidebar__user-role">Administrator</span>
        </div>
      </div>
      <button className="admin-sidebar__logout" onClick={onLogout}>
        <LogOut size={13} /> Sign Out
      </button>
    </div>
  </>
);

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <AdminSidebarContent user={user} onLinkClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-header__brand">
          <Shield size={18} color="#dc2626" />
          <span>Admin Panel</span>
        </div>
        <button className="admin-mobile-header__toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="admin-sidebar admin-sidebar--mobile">
            <AdminSidebarContent user={user} onLinkClick={() => setMobileOpen(false)} onLogout={handleLogout} />
          </aside>
        </>
      )}

      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
