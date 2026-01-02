import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiCode,
  HiChip,
  HiLightningBolt,
  HiChartBar,
  HiPresentationChartBar,
  HiTranslate,
  HiCheckCircle,
  HiLocationMarker,
  HiMail,
} from 'react-icons/hi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import api from '../utils/api';
import Loading from '../components/Loading';
import { getTotalExperienceLabel } from '../utils/experience';
import { fetchExperiences } from '../utils/experienceData';

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typedSubtitle, setTypedSubtitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [homeRes, featuredRes, projectsCountRes, experienceRes] =
        await Promise.allSettled([
        api.get('/home', { params: { includeOwnerImage: true } }),
        api.get('/projects?featured=true'),
        api.get('/projects'),
        fetchExperiences(),
      ]);

      if (homeRes.status === 'fulfilled') {
        setHomeData(homeRes.value.data.data);
      } else {
        console.error('Error fetching home data:', homeRes.reason);
      }

      if (featuredRes.status === 'fulfilled') {
        setFeaturedProjects(featuredRes.value.data.data.slice(0, 3));
      } else {
        console.error('Error fetching projects:', featuredRes.reason);
      }

      if (projectsCountRes.status === 'fulfilled') {
        const count =
          projectsCountRes.value.data.count ??
          projectsCountRes.value.data.data?.length ??
          0;
        setProjectsCount(count);
      }

      if (experienceRes.status === 'fulfilled') {
        setExperiences(experienceRes.value);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const defaultSubtitle =
      'Data Analyst | Data visualization | AI/ML Specialist';
    const subtitleText = homeData?.heroSubtitle || defaultSubtitle;
    if (!subtitleText) return;

    let index = 0;
    setTypedSubtitle('');
    const interval = setInterval(() => {
      index += 1;
      setTypedSubtitle(subtitleText.slice(0, index));
      if (index >= subtitleText.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [homeData?.heroSubtitle]);

  if (loading) return <Loading fullScreen />;

  const features = [
    {
      icon: HiLightningBolt,
      title: 'Machine Learning',
      description: 'Building intelligent systems with modern ML algorithms',
      iconGradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      glow: 'rgba(59, 130, 246, 0.35)',
      accent: '#06b6d4',
      badges: ['TensorFlow', 'Scikit-learn'],
      stat: '95% accuracy',
      level: 'Expert',
    },
    {
      icon: HiChip,
      title: 'Deep Learning',
      description: 'Training neural networks for complex predictions',
      iconGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      glow: 'rgba(139, 92, 246, 0.35)',
      accent: '#ec4899',
      badges: ['CNN', 'PyTorch'],
      stat: '20+ models',
      level: 'Advanced',
    },
    {
      icon: HiChartBar,
      title: 'Data Analysis',
      description: 'Transforming data into actionable insights',
      iconGradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16, 185, 129, 0.35)',
      accent: '#10b981',
      badges: ['Pandas', 'SQL'],
      stat: '50+ reports',
      level: 'Expert',
    },
    {
      icon: HiPresentationChartBar,
      title: 'Data Visualization',
      description: 'Creating clear dashboards and visual storytelling',
      iconGradient: 'linear-gradient(135deg, #f97316, #fbbf24)',
      glow: 'rgba(249, 115, 22, 0.35)',
      accent: '#fbbf24',
      badges: ['Power BI', 'Tableau'],
      stat: '20+ dashboards',
      level: 'Advanced',
    },
    {
      icon: HiTranslate,
      title: 'Natural Language Processing',
      description: 'Extracting insights from text with NLP techniques',
      iconGradient: 'linear-gradient(135deg, #ef4444, #f43f5e)',
      glow: 'rgba(239, 68, 68, 0.35)',
      accent: '#f43f5e',
      badges: ['NLP', 'Transformers'],
      stat: '10+ pipelines',
      level: 'Advanced',
    },
    {
      icon: HiCode,
      title: 'Python Developer',
      description: 'Developing scalable Python solutions and automation',
      iconGradient: 'linear-gradient(135deg, #6366f1, #3b82f6)',
      glow: 'rgba(99, 102, 241, 0.35)',
      accent: '#6366f1',
      badges: ['FastAPI', 'Automation'],
      stat: '30+ scripts',
      level: 'Expert',
    },
  ];

  const heroImage = homeData?.heroImage || homeData?.ownerProfileImage;
  const defaultTitle = "Hi, I'm Saikat Hudait";
  const heroTitle = homeData?.heroTitle || defaultTitle;
  const titleParts = heroTitle.split("I'm");
  const hasSplitTitle = titleParts.length > 1;
  const heroIntro = hasSplitTitle ? `${titleParts[0]}I'm` : '';
  const heroName = hasSplitTitle
    ? titleParts.slice(1).join("I'm").trim()
    : heroTitle;
  const heroDescription =
    homeData?.heroDescription ||
    'I build intelligent systems, dashboards, and predictive models. Explore my work.';
  const shortDescription =
    heroDescription.length > 220
      ? `${heroDescription.slice(0, 220).trim()}...`
      : heroDescription;
  const heroInitials = heroName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const highlights = [
    'AI/ML solutions focused on real business impact',
    'Interactive dashboards and data storytelling',
    'Python, TensorFlow, and analytics pipelines',
  ];

  const totalExperienceLabel =
    getTotalExperienceLabel(experiences) || '0 mo';

  const stats = [
    { label: 'Accuracy', value: '95%', detail: 'Model performance' },
    {
      label: 'Total Projects',
      value: `${projectsCount}`,
      detail: '',
    },
    {
      label: 'Total Experience',
      value: totalExperienceLabel,
      detail: 'Across roles',
    },
  ];

  const techPills = ['Python', 'TensorFlow', 'Power BI', 'NLP'];
  const floatingBadges = [
    { label: 'Python', className: '-left-6 top-6' },
    { label: 'TensorFlow', className: '-right-8 top-16' },
    { label: 'Power BI', className: 'left-6 -bottom-6' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen hero-gradient overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0">
          <div className="hero-shape circle" style={{ top: '-60px', left: '-40px' }} />
          <div
            className="hero-shape triangle"
            style={{ top: '10%', right: '8%', animationDelay: '1s' }}
          />
          <div
            className="hero-shape square"
            style={{ bottom: '15%', left: '18%', animationDelay: '2s' }}
          />
          <span
            className="hero-dot"
            style={{ top: '18%', left: '14%', animationDelay: '0s' }}
          />
          <span
            className="hero-dot"
            style={{ top: '62%', left: '8%', animationDelay: '1.5s' }}
          />
          <span
            className="hero-dot"
            style={{ top: '28%', right: '18%', animationDelay: '0.8s' }}
          />
          <span
            className="hero-dot"
            style={{ bottom: '22%', right: '12%', animationDelay: '2s' }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/5 -skew-y-2 origin-bottom" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[0.45fr_0.55fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center lg:items-start gap-6"
            >
              <div className="relative">
                <div className="absolute -inset-12 bg-cyan-400/20 rounded-full blur-3xl opacity-40" />
                <div className="relative hero-float">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="hero-orbit" />
                    <div className="hero-avatar shadow-2xl">
                      <div className="hero-avatar-inner">
                        {heroImage ? (
                          <img
                            src={heroImage}
                            alt={heroName || 'Profile'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                            {heroInitials}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {floatingBadges.map((badge, index) => (
                  <span
                    key={badge.label}
                    className={`hero-pill hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white/80 absolute ${badge.className}`}
                    style={{ animationDelay: `${index * 0.6}s` }}
                  >
                    <HiCheckCircle className="text-cyan-300" size={14} />
                    {badge.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {techPills.map((pill) => (
                  <span
                    key={pill}
                    className="hero-pill px-3 py-1 rounded-full text-xs text-white/80"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="hero-glass rounded-3xl p-8 lg:p-10 text-center lg:text-left"
            >
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-6">
                <span className="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Hire
                </span>
                <span className="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white/80">
                  <HiLocationMarker className="text-cyan-300" size={14} />
                  Kolkata, India
                </span>
                <span className="hero-pill inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white/80">
                  <HiMail className="text-cyan-300" size={14} />
                  saikathudait2001@gmail.com
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
              >
                {heroIntro && (
                  <span className="block text-white/80">{heroIntro}</span>
                )}
                <span
                  className={`block ${
                    heroIntro ? 'hero-text-gradient hero-underline' : 'text-white'
                  }`}
                >
                  {heroName}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-4 text-lg md:text-xl text-white/90 font-medium"
              >
                {typedSubtitle || homeData?.heroSubtitle}
                <span className="inline-block w-2 h-5 bg-white/70 ml-1 align-middle animate-pulse" />
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 text-base md:text-lg text-white/75 leading-relaxed max-w-2xl"
              >
                {shortDescription}
              </motion.p>

              <div className="mt-6 grid gap-3 text-sm text-white/80">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <HiCheckCircle className="text-cyan-300 mt-0.5" size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <Link
                  to={homeData?.ctaLink || '/projects'}
                  className="hero-btn hero-btn-primary group px-7 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
                >
                  {homeData?.ctaText || 'View My Work'}
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="hero-btn hero-btn-outline px-6 py-3 rounded-xl font-semibold"
                >
                  Get In Touch
                </Link>
                <Link
                  to="/resume"
                  className="hero-btn hero-btn-outline px-6 py-3 rounded-xl font-semibold"
                >
                  Resume
                </Link>
              </motion.div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="hero-stats rounded-xl px-4 py-3"
                  >
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      {stat.label}
                    </p>
                    <p className="text-xs text-white/60">{stat.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
                <a
                  href="https://github.com/saikathudait"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-pill w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/saikat-hudait/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-pill w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={18} />
                </a>
                <a
                  href="mailto:saikathudait2001@gmail.com"
                  className="hero-pill w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <HiMail size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <svg
          className="hero-wave"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,96L80,101.3C160,107,320,117,480,101.3C640,85,800,43,960,42.7C1120,43,1280,85,1360,106.7L1440,128L1440,160L1360,160C1280,160,1120,160,960,160C800,160,640,160,480,160C320,160,160,160,80,160L0,160Z"
          />
        </svg>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-7 h-11 border border-white/70 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="whatido-section py-28 text-white">
        <div className="whatido-pattern" />
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <span className="whatido-particle" style={{ top: '18%', left: '12%' }} />
        <span className="whatido-particle" style={{ top: '30%', right: '14%' }} />
        <span className="whatido-particle" style={{ bottom: '22%', left: '20%' }} />
        <span className="whatido-particle" style={{ bottom: '18%', right: '18%' }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 whatido-title">
              What I Do
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Specialized in building data-driven solutions and intelligent applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`whatido-card ${index % 3 === 1 ? 'lg:translate-y-6' : ''} ${index % 3 === 2 ? 'lg:-translate-y-4' : ''}`}
                style={{ '--glow': feature.glow }}
              >
                <div
                  className="whatido-card-inner"
                  style={{ '--accent': feature.accent }}
                >
                  <span className="whatido-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="whatido-icon"
                    style={{
                      background: feature.iconGradient,
                      '--icon-glow': feature.glow,
                    }}
                  >
                    <feature.icon size={30} />
                  </div>
                  <h3 className="whatido-card-title">{feature.title}</h3>
                  <p className="whatido-card-desc">{feature.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {feature.badges.map((badge) => (
                      <span key={badge} className="whatido-pill">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase tracking-wide">
                      {feature.level}
                    </span>
                    <span>{feature.stat}</span>
                  </div>
                  <Link to="/projects" className="whatido-link">
                    Learn more
                    <HiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Check out some of my recent work
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg card-hover"
                >
                  {project.images?.[0] && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-navy-100 dark:bg-navy-900 text-navy-600 dark:text-aqua-400 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-navy-500 dark:text-aqua-500 font-semibold hover:underline flex items-center"
                    >
                      View Details
                      <HiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/projects"
                className="inline-block px-8 py-4 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
              >
                View All Projects
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-600 to-aqua-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Have a project in mind? Let's create something amazing together.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-navy-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
            >
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
