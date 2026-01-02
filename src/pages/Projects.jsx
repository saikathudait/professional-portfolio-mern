import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCode,
  FaExternalLinkAlt,
  FaFireAlt,
  FaGithub,
  FaSearch,
  FaStar,
  FaTags,
} from 'react-icons/fa';
import api from '../utils/api';
import Loading from '../components/Loading';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        const projectsData = response.data.data;
        setProjects(projectsData);
        setFilteredProjects(projectsData);

        const uniqueCategories = [
          'All',
          ...new Set(projectsData.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.technologies?.some((tech) => tech.toLowerCase().includes(term))
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, projects]);

  const getTechClass = (tech = '') => {
    const value = tech.toLowerCase();
    if (
      ['python', 'javascript', 'typescript', 'java', 'c++'].some((item) =>
        value.includes(item)
      )
    ) {
      return 'project-pill--language';
    }
    if (
      ['ml', 'machine', 'ai', 'nlp', 'deep'].some((item) =>
        value.includes(item)
      )
    ) {
      return 'project-pill--ml';
    }
    if (
      ['sql', 'mongo', 'database', 'postgres', 'mysql'].some((item) =>
        value.includes(item)
      )
    ) {
      return 'project-pill--database';
    }
    if (
      ['tableau', 'power bi', 'excel', 'dashboard'].some((item) =>
        value.includes(item)
      )
    ) {
      return 'project-pill--tools';
    }
    return 'project-pill--default';
  };

  const getProjectGradient = (category = '', index) => {
    const value = category.toLowerCase();
    if (
      value.includes('machine') ||
      value.includes('ai') ||
      value.includes('ml')
    ) {
      return 'project-image--ml';
    }
    if (
      value.includes('web') ||
      value.includes('frontend') ||
      value.includes('react')
    ) {
      return 'project-image--web';
    }
    if (value.includes('data') || value.includes('analysis')) {
      return 'project-image--data';
    }
    const presets = [
      'project-image--ml',
      'project-image--web',
      'project-image--data',
      'project-image--tools',
    ];
    return presets[index % presets.length];
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="projects-page min-h-screen pt-16">
      <header className="projects-hero">
        <div className="projects-hero-spotlight" aria-hidden="true" />
        <div className="projects-hero-pattern" aria-hidden="true" />
        <div
          className="projects-hero-shape projects-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="projects-hero-shape projects-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="projects-hero-shape projects-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="projects-hero-title"
          >
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="projects-hero-subtitle"
          >
            Explore my portfolio of data, ML, and full-stack builds.
          </motion.p>
        </div>
        <svg
          className="projects-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0f172a"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="projects-filter-bar">
          <div className="projects-search">
            <FaSearch className="projects-search-icon" />
            <input
              type="text"
              placeholder="Search projects by name, tech, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="projects-filters">
            <div className="projects-filter-label">
              <FaTags />
              Filter
            </div>
            <div className="projects-filter-pills">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-pill ${
                    selectedCategory === category ? 'filter-pill--active' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="projects-count">
          <span>
            Showing <strong>{filteredProjects.length}</strong> of{' '}
            <strong>{projects.length}</strong> projects
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No projects found matching your criteria.
            </p>
          </div>
        ) : (
          <section className="projects-section">
            <div className="projects-section-header">
              <div>
                <h2>All Projects</h2>
                <p>Explore the complete set of builds and case studies.</p>
              </div>
              <span className="projects-section-badge">
                <FaFireAlt />
                {filteredProjects.length} total
              </span>
            </div>

            <div className="projects-grid">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="project-card-inner">
                    <div className="project-image">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="project-image-img"
                        />
                      ) : (
                        <div
                          className={`project-image-placeholder ${getProjectGradient(
                            project.category,
                            index
                          )}`}
                        >
                          <FaCode />
                        </div>
                      )}
                      <div className="project-image-overlay">
                        {project.featured && (
                          <span className="project-status">
                            <FaStar />
                            Featured
                          </span>
                        )}
                        <div className="project-quick-actions">
                          <Link
                            to={`/projects/${project._id}`}
                            className="project-quick-btn"
                          >
                            View Details
                            <FaArrowRight />
                          </Link>
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-icon-btn"
                            >
                              <FaGithub />
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-icon-btn"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      {project.technologies?.length > 0 && (
                        <div className="project-tech-list">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={`${project._id}-${tech}-${i}`}
                              className={`project-pill ${getTechClass(tech)}`}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="project-pill project-pill--more">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="project-actions">
                        <Link
                          to={`/projects/${project._id}`}
                          className="project-cta"
                        >
                          View Details <FaArrowRight />
                        </Link>
                        <div className="project-links">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-icon-btn"
                            >
                              <FaGithub />
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-icon-btn"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Projects;
