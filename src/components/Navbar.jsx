import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt } from 'react-icons/fa';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutImage, setAboutImage] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Education', path: '/education' },
    { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Books', path: '/books' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchBrandImage = async () => {
      try {
        const response = await api.get('/about', {
          params: { includeOwnerImage: true },
        });
        const data = response.data?.data;
        const image =
          data?.profileImage || data?.ownerProfileImage || '';
        if (isActive) {
          setAboutImage(image);
        }
      } catch (error) {
        if (isActive) {
          setAboutImage('');
        }
      }
    };

    fetchBrandImage();

    return () => {
      isActive = false;
    };
  }, []);

  const brandImage = user?.profileImage || aboutImage;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : 'navbar--top'}`}
    >
      <div className="navbar-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-row">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`navbar-brand-icon ${
                brandImage ? 'navbar-brand-icon--image' : ''
              }`}
            >
              {brandImage ? (
                <img
                  src={brandImage}
                  alt="Saikat Hudait profile"
                  className="navbar-brand-image"
                  loading="eager"
                />
              ) : (
                <FaBolt size={16} />
              )}
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="navbar-brand-text"
            >
              Saikat Hudait
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  isActive(link.path) ? 'nav-link--active' : ''
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle-icon">
                {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
              </span>
            </button>

            {/* Admin Link */}
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="nav-link nav-link--admin">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="navbar-mobile">
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle-icon">
                {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
              </span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="menu-toggle"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile-panel"
          >
            <div className="navbar-mobile-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`nav-link nav-link--mobile ${
                    isActive(link.path) ? 'nav-link--active' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="nav-link nav-link--mobile nav-link--admin"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
