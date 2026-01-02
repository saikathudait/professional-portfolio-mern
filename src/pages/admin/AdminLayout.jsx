import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  HiHome,
  HiViewGrid,
  HiNewspaper,
  HiLightningBolt,
  HiBriefcase,
  HiAcademicCap,
  HiBookOpen,
  HiMail,
  HiCog,
  HiDocumentText,
  HiLogout,
  HiMenu,
  HiX,
  HiMoon,
  HiSun,
  HiUser,
} from 'react-icons/hi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: HiHome, label: 'Dashboard', path: '/admin' },
    { icon: HiUser, label: 'Home Content', path: '/admin/home' },
    { icon: HiUser, label: 'About', path: '/admin/about' },
    { icon: HiViewGrid, label: 'Projects', path: '/admin/projects' },
    { icon: HiNewspaper, label: 'Blog', path: '/admin/blog' },
    { icon: HiLightningBolt, label: 'Skills', path: '/admin/skills' },
    { icon: HiBriefcase, label: 'Experience', path: '/admin/experience' },
    { icon: HiAcademicCap, label: 'Education', path: '/admin/education' },
    { icon: HiBookOpen, label: 'Books', path: '/admin/books' },
    { icon: HiMail, label: 'Messages', path: '/admin/messages' },
    { icon: HiDocumentText, label: 'Upload CV', path: '/admin/cv' },
    { icon: HiCog, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-navy-600 to-aqua-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <HiX size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-navy-500 to-aqua-500 flex items-center justify-center text-white font-bold ring-2 ring-navy-500/20 dark:ring-aqua-500/20">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@portfolio.com'}
                </p>
                <span className="mt-1 inline-flex items-center rounded-full bg-navy-100 text-navy-700 dark:bg-navy-900/40 dark:text-aqua-400 px-2 py-0.5 text-[10px] font-semibold">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-navy-500 text-white dark:bg-aqua-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          >
            <HiLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <HiMenu size={24} />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/"
                target="_blank"
                className="px-4 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors text-sm font-semibold"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
