import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaArrowUp,
  FaBolt,
  FaEnvelope,
  FaGithub,
  FaHeart,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaGithub,
      url: 'https://github.com/saikathudait',
      label: 'GitHub',
      variant: 'github',
    },
    {
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/saikat-hudait/',
      label: 'LinkedIn',
      variant: 'linkedin',
    },
    {
      icon: FaEnvelope,
      url: 'mailto:saikathudait2001@gmail.com',
      label: 'Email',
      variant: 'email',
    },
  ];

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Resume', path: '/resume' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="footer-premium">
      <div className="footer-top-border" aria-hidden="true" />
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-pattern" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <div className="md:pr-8 lg:pr-12">
            <Link to="/" className="footer-brand" aria-label="Go to home">
              <FaBolt size={20} className="text-white/90" />
              <span>Portfolio</span>
            </Link>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-md">
              Data Analyst & Machine Learning Engineer focused on building
              intelligent systems and solving real-world problems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="footer-badge">Available for Hire</span>
              <span className="footer-badge">Based in India</span>
              <span className="footer-badge">Python</span>
              <span className="footer-badge">TensorFlow</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social ${social.variant}`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:border-l md:border-white/10 md:pl-8 lg:pl-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {footerLinks.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link">
                        <FaArrowRight size={12} className="text-cyan-300" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="footer-heading">Stay Connected</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Get updates on projects, blog posts, and new case studies.
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>Email: saikathudait2001@gmail.com</p>
                  <p>Phone: +91 7479309346</p>
                  <p>Location: Kolkata, India</p>
                </div>
                <div className="mt-5">
                  <Link to="/contact" className="footer-cta">
                    <span>Let's Connect</span>
                    <FaEnvelope size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <p>(c) {currentYear} Saikat Hudait. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                Made with
                by Saikat Hudait
              </span>
              <Link
                to="/admin/login"
                className="text-xs text-slate-500 hover:text-cyan-300 transition-colors"
              >
                AL
              </Link>
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="text-xs text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1"
                aria-label="Back to top"
              >
                Top
                <FaArrowUp size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
