import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBolt,
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCloud,
  FaCode,
  FaDatabase,
  FaMapMarkerAlt,
  FaRobot,
  FaStar,
  FaTools,
  FaTrophy,
} from 'react-icons/fa';
import Loading from '../components/Loading';
import { getTotalExperienceLabel } from '../utils/experience';
import { fetchExperiences } from '../utils/experienceData';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadExperiences = async () => {
      const data = await fetchExperiences();
      setExperiences(data);
      setLoading(false);
    };

    loadExperiences();
  }, []);

  const sortedExperiences = useMemo(() => {
    if (!experiences.length) return [];
    return [...experiences].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [experiences]);

  const isCurrentRole = (endDate) =>
    typeof endDate === 'string' && /present|current/i.test(endDate);

  const sanitizeDateLabel = (value) =>
    value ? value.replace(/\s+/g, ' ').trim() : '';

  const parseDate = (value) => {
    if (!value || isCurrentRole(value)) return null;
    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) return direct;
    const sanitized = value.replace(',', '').trim();
    const [monthLabel, yearLabel] = sanitized.split(' ');
    if (!monthLabel || !yearLabel) return null;
    const month = monthLabel.toLowerCase().slice(0, 3);
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    if (months[month] === undefined) return null;
    const year = Number(yearLabel);
    if (Number.isNaN(year)) return null;
    return new Date(year, months[month], 1);
  };

  const formatDateRange = (startDate, endDate) => {
    const startLabel = sanitizeDateLabel(startDate);
    const endLabel = isCurrentRole(endDate)
      ? 'Present'
      : sanitizeDateLabel(endDate);
    return [startLabel, endLabel].filter(Boolean).join(' - ');
  };

  const getDurationLabel = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = isCurrentRole(endDate) ? new Date() : parseDate(endDate);
    if (!start || !end) return null;
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months <= 0) return null;
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    const parts = [];
    if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (remaining) parts.push(`${remaining} mo${remaining > 1 ? 's' : ''}`);
    return parts.join(' ');
  };

  const totalExperienceLabel = useMemo(() => {
    return getTotalExperienceLabel(sortedExperiences);
  }, [sortedExperiences]);

  const getTechMeta = (tech = '') => {
    const value = tech.toLowerCase();
    if (
      ['python', 'r', 'javascript', 'typescript', 'java', 'c++', 'c#'].some(
        (item) => value.includes(item)
      )
    ) {
      return { className: 'experience-pill--language', icon: FaCode };
    }
    if (
      ['sql', 'mysql', 'postgres', 'mongo', 'mongodb', 'database'].some(
        (item) => value.includes(item)
      )
    ) {
      return { className: 'experience-pill--database', icon: FaDatabase };
    }
    if (
      ['ml', 'machine', 'ai', 'nlp', 'deep', 'tensorflow', 'pytorch'].some(
        (item) => value.includes(item)
      )
    ) {
      return { className: 'experience-pill--ml', icon: FaRobot };
    }
    if (
      ['tableau', 'power bi', 'excel', 'looker', 'metabase'].some((item) =>
        value.includes(item)
      )
    ) {
      return { className: 'experience-pill--bi', icon: FaChartLine };
    }
    if (['aws', 'azure', 'gcp', 'cloud'].some((item) => value.includes(item))) {
      return { className: 'experience-pill--cloud', icon: FaCloud };
    }
    return { className: 'experience-pill--tool', icon: FaTools };
  };

  const getHighlightBadges = (responsibilities = []) => {
    const text = responsibilities.join(' ').toLowerCase();
    const badges = [];
    if (text.includes('lead')) {
      badges.push({ label: 'Team Lead', icon: FaStar });
    }
    if (text.includes('project')) {
      badges.push({ label: 'Project Delivery', icon: FaTrophy });
    }
    if (text.includes('model') || text.includes('analysis')) {
      badges.push({ label: 'Analytics Impact', icon: FaChartLine });
    }
    if (text.includes('automation') || text.includes('optimiz')) {
      badges.push({ label: 'Automation', icon: FaBolt });
    }
    return badges.slice(0, 3);
  };

  const getDotVariant = (index) => {
    if (index === 0) return 'experience-dot--primary';
    if (index === 1) return 'experience-dot--secondary';
    if (index === 2) return 'experience-dot--tertiary';
    return 'experience-dot--muted';
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="experience-page min-h-screen pt-16">
      <header className="experience-hero">
        <div className="experience-hero-spotlight" aria-hidden="true" />
        <div className="experience-hero-pattern" aria-hidden="true" />
        <div
          className="experience-hero-shape experience-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="experience-hero-shape experience-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="experience-hero-shape experience-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="experience-hero-title"
          >
            Work Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="experience-hero-subtitle"
          >
            My professional journey and the impact delivered across roles.
          </motion.p>
        </div>
        <svg
          className="experience-hero-wave"
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sortedExperiences.length > 0 && (
          <div className="experience-summary">
            <div className="experience-summary-card">
              <div className="experience-summary-icon">
                <FaClock />
              </div>
              <div className="experience-summary-content">
                <span className="experience-summary-label">
                  Total Experience
                </span>
                <span className="experience-summary-value">
                  {totalExperienceLabel}
                </span>
                
              </div>
            </div>
          </div>
        )}

        <div className="experience-section-header">
          <h2 className="experience-section-title">Experience Timeline</h2>
          <p className="experience-section-subtitle">
            Roles, responsibilities, and measurable outcomes over time.
          </p>
        </div>

        {sortedExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No experience data available yet.</p>
          </div>
        ) : (
          <div className="experience-timeline">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="experience-line"
            />

            <div className="space-y-12 md:space-y-16">
              {sortedExperiences.map((exp, index) => {
                const isCurrent = isCurrentRole(exp.endDate);
                const duration = getDurationLabel(exp.startDate, exp.endDate);
                const dateRange = formatDateRange(exp.startDate, exp.endDate);
                const responsibilities = exp.responsibilities || [];
                const technologies = exp.technologies || [];
                const badges = getHighlightBadges(responsibilities);
                const visibleResponsibilities =
                  expandedId === exp._id
                    ? responsibilities
                    : responsibilities.slice(0, 3);
                const initials = exp.company
                  ? exp.company
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'CO';

                return (
                  <div key={exp._id} className="experience-row">
                    <div className="experience-dot-wrap">
                      <span className="experience-connector" aria-hidden="true" />
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className={`experience-dot ${getDotVariant(index)}`}
                      >
                        <FaBriefcase className="experience-dot-icon" />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="experience-entry"
                    >
                      <div className="experience-logo-card">
                        <div className="experience-logo-inner">
                          <div className="experience-logo-wrap">
                            {exp.companyLogo ? (
                              <img
                                src={exp.companyLogo}
                                alt={exp.company}
                                className="experience-logo-image"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="experience-logo-fallback">
                                {initials}
                              </span>
                            )}
                          </div>
                          <p className="experience-logo-company">
                            {exp.company}
                          </p>
                          {isCurrent && (
                            <span className="experience-current-badge">
                              <span className="experience-current-dot" />
                              Current Role
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="experience-content-card">
                        <div className="experience-content-inner">
                          <div className="experience-header">
                            <div>
                              <div className="experience-title-row">
                                <FaBriefcase className="experience-title-icon" />
                                <h3 className="experience-title">
                                  {exp.position}
                                </h3>
                              </div>
                              <p className="experience-company">
                                {exp.company}
                              </p>
                            </div>
                            <div className="experience-date-wrap">
                              {dateRange && (
                                <span className="experience-date">
                                  <FaCalendarAlt />
                                  {dateRange}
                                </span>
                              )}
                              {duration && (
                                <span className="experience-duration">
                                  <FaClock />
                                  {duration}
                                </span>
                              )}
                            </div>
                          </div>

                          {exp.location && (
                            <div className="experience-location">
                              <FaMapMarkerAlt />
                              <span>{exp.location}</span>
                            </div>
                          )}

                          {badges.length > 0 && (
                            <div className="experience-badges">
                              {badges.map((badge) => (
                                <span
                                  key={badge.label}
                                  className="experience-badge"
                                >
                                  <badge.icon className="experience-badge-icon" />
                                  {badge.label}
                                </span>
                              ))}
                            </div>
                          )}

                          {responsibilities.length > 0 && (
                            <div className="experience-section">
                              <h4 className="experience-section-heading">
                                <FaCheckCircle />
                                Key Responsibilities
                              </h4>
                              <ul className="experience-responsibilities">
                                {visibleResponsibilities?.map((resp, i) => (
                                  <li key={i}>
                                    <span className="experience-bullet">
                                      <FaCheckCircle />
                                    </span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                              {responsibilities.length > 3 && (
                                <button
                                  type="button"
                                  className="experience-toggle"
                                  onClick={() =>
                                    setExpandedId(
                                      expandedId === exp._id ? null : exp._id
                                    )
                                  }
                                >
                                  {expandedId === exp._id
                                    ? 'Show Less'
                                    : 'Show More'}
                                </button>
                              )}
                            </div>
                          )}

                          {technologies.length > 0 && (
                            <div className="experience-section">
                              <h4 className="experience-section-heading">
                                <FaTools />
                                Technologies Used
                              </h4>
                              <div className="experience-tech-list">
                                {technologies.map((tech, i) => {
                                  const meta = getTechMeta(tech);
                                  const TechIcon = meta.icon;
                                  return (
                                    <motion.span
                                      key={`${tech}-${i}`}
                                      initial={{ opacity: 0, y: 6 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: i * 0.05,
                                      }}
                                      viewport={{ once: true }}
                                      className={`experience-tech-pill ${meta.className}`}
                                      title={tech}
                                    >
                                      <TechIcon />
                                      {tech}
                                    </motion.span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Experience;
