import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaBrain,
  FaCalendarAlt,
  FaCertificate,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaGraduationCap,
  FaLaptopCode,
  FaMapMarkerAlt,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';
import api from '../utils/api';
import Loading from '../components/Loading';

const DESCRIPTION_LIMIT = 200;

const Education = () => {
  const [education, setEducation] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const [educationRes, aboutRes, skillsRes] =
          await Promise.allSettled([
            api.get('/education'),
            api.get('/about'),
            api.get('/skills'),
          ]);

        if (educationRes.status === 'fulfilled') {
          setEducation(educationRes.value.data.data || []);
        } else {
          console.error('Error fetching education data:', educationRes.reason);
        }

        if (aboutRes.status === 'fulfilled') {
          setAboutData(aboutRes.value.data.data || null);
        } else {
          console.error('Error fetching about data:', aboutRes.reason);
        }

        if (skillsRes.status === 'fulfilled') {
          setSkills(skillsRes.value.data.data || []);
        } else {
          console.error('Error fetching skills data:', skillsRes.reason);
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const timelineEntries = useMemo(() => {
    if (!education || education.length === 0) return [];
    const list = [...education];
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return list;
  }, [education]);

  const skillHighlights = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    const list = [...skills];
    list.sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
    return list.slice(0, 8);
  }, [skills]);

  const extractYear = (value) => {
    if (!value) return null;
    const match = value.match(/\b(19|20)\d{2}\b/);
    return match ? Number(match[0]) : null;
  };

  const formatYear = (value) => {
    const year = extractYear(value);
    return year ? `${year}` : value;
  };

  const isCurrentEnd = (endDate) =>
    typeof endDate === 'string' && /present|current/i.test(endDate);

  const formatDateRange = (startDate, endDate) => {
    const startLabel = formatYear(startDate);
    const endLabel = isCurrentEnd(endDate) ? 'Present' : formatYear(endDate);
    return [startLabel, endLabel].filter(Boolean).join(' - ');
  };

  const getTotalYears = () => {
    if (!timelineEntries.length) return null;
    const years = timelineEntries.flatMap((entry) => {
      const startYear = extractYear(entry.startDate);
      const endYear = isCurrentEnd(entry.endDate)
        ? new Date().getFullYear()
        : extractYear(entry.endDate);
      return [startYear, endYear].filter(Boolean);
    });

    if (years.length === 0) return null;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const span = maxYear - minYear + 1;
    return span > 0 ? span : null;
  };

  const latestEntry = useMemo(() => {
    if (!timelineEntries.length) return null;
    const list = [...timelineEntries];
    list.sort((a, b) => {
      const endA = isCurrentEnd(a.endDate)
        ? Number.MAX_SAFE_INTEGER
        : extractYear(a.endDate) ?? extractYear(a.startDate) ?? 0;
      const endB = isCurrentEnd(b.endDate)
        ? Number.MAX_SAFE_INTEGER
        : extractYear(b.endDate) ?? extractYear(b.startDate) ?? 0;
      if (endA !== endB) return endB - endA;
      const startA = extractYear(a.startDate) ?? 0;
      const startB = extractYear(b.startDate) ?? 0;
      return startB - startA;
    });
    return list[0];
  }, [timelineEntries]);

  const getHighestDegree = () => latestEntry?.degree || 'N/A';

  const getGrade = () => latestEntry?.grade || 'N/A';

  const getFieldIcon = (degree = '') => {
    const value = degree.toLowerCase();
    if (value.includes('data') || value.includes('analytics')) {
      return FaChartLine;
    }
    if (value.includes('machine') || value.includes('ai') || value.includes('ml')) {
      return FaBrain;
    }
    if (
      value.includes('computer') ||
      value.includes('software') ||
      value.includes('engineering')
    ) {
      return FaLaptopCode;
    }
    return FaBook;
  };

  const getDotIcon = (index) => {
    if (index === 0) return FaGraduationCap;
    if (index === 1) return FaBook;
    if (index === 2) return FaTrophy;
    return FaGraduationCap;
  };

  const getDotVariant = (index) => {
    if (index === 0) return 'education-dot--primary';
    if (index === 1) return 'education-dot--secondary';
    if (index === 2) return 'education-dot--tertiary';
    return 'education-dot--muted';
  };

  const getAchievementBadges = (grade = '') => {
    const badges = [];
    const normalized = grade.toLowerCase();
    if (
      normalized.includes('distinction') ||
      normalized.includes('honor') ||
      normalized.includes('first')
    ) {
      badges.push({
        label: 'Honors',
        variant: 'education-badge--honors',
        icon: FaTrophy,
      });
    }
    if (normalized.includes('dean')) {
      badges.push({
        label: 'Dean List',
        variant: 'education-badge--dean',
        icon: FaStar,
      });
    }
    return badges;
  };

  const totalYears = getTotalYears();
  const highestDegree = getHighestDegree();
  const grade = getGrade();
  const certificationCount = aboutData?.certifications?.length ?? 0;

  const stats = [
    {
      label: 'Years of Study',
      value: totalYears ? `${totalYears}+` : 'N/A',
      icon: FaCalendarAlt,
    },
    {
      label: 'Highest Degree',
      value: highestDegree,
      icon: FaGraduationCap,
    },
    {
      label: 'Grade',
      value: grade,
      icon: FaStar,
    },
    {
      label: 'Certifications',
      value: certificationCount,
      icon: FaCertificate,
    },
  ];

  if (loading) return <Loading fullScreen />;

  return (
    <div className="education-page min-h-screen pt-16">
      <header className="education-hero">
        <div className="education-hero-spotlight" aria-hidden="true" />
        <div className="education-hero-pattern" aria-hidden="true" />
        <div
          className="education-hero-shape education-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="education-hero-shape education-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="education-hero-shape education-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="education-hero-title"
          >
            Education
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="education-hero-subtitle"
          >
            My academic journey, milestones, and continuous learning.
          </motion.p>
        </div>
        <svg
          className="education-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0f172a"
            d="M0,48L80,58.7C160,69,320,91,480,96C640,101,800,91,960,74.7C1120,59,1280,37,1360,26.7L1440,16L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="education-stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="education-stat-card"
            >
              <div className="education-stat-icon">
                <stat.icon size={18} />
              </div>
              <div>
                <p className="education-stat-value">{stat.value}</p>
                <p className="education-stat-label">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="education-section-header">
          <h2 className="education-section-title">Academic Timeline</h2>
          <p className="education-section-subtitle">
            A visual timeline of my education, achievements, and growth.
          </p>
        </div>

        {timelineEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No education data available yet.</p>
          </div>
        ) : (
          <div className="education-timeline">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="education-line"
            />

            <div className="space-y-12 md:space-y-16">
              {timelineEntries.map((edu, index) => {
                const isRight = index % 2 === 0;
                const isCurrent = isCurrentEnd(edu.endDate);
                const dateRange = formatDateRange(edu.startDate, edu.endDate);
                const DotIcon = getDotIcon(index);
                const FieldIcon = getFieldIcon(edu.degree);
                const badges = edu.grade ? getAchievementBadges(edu.grade) : [];
                const hasLongDescription =
                  edu.description && edu.description.length > DESCRIPTION_LIMIT;
                const isExpanded = expandedId === edu._id;
                const description =
                  hasLongDescription && !isExpanded
                    ? `${edu.description.slice(0, DESCRIPTION_LIMIT)}...`
                    : edu.description;
                const logo = edu.logo || edu.institutionLogo;
                const initials = edu.institution
                  ? edu.institution
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'U';

                return (
                  <div
                    key={edu._id}
                    className={`education-row ${
                      index % 2 === 1 ? 'md:mt-10' : ''
                    }`}
                  >
                    <div className="education-dot-wrap">
                      <span
                        className={`education-connector ${
                          isRight
                            ? 'education-connector--right'
                            : 'education-connector--left'
                        }`}
                        aria-hidden="true"
                      />
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className={`education-dot ${getDotVariant(index)}`}
                      >
                        <DotIcon className="education-dot-icon" />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className={`education-card-wrap col-start-2 ${
                        isRight
                          ? 'md:col-start-3 md:justify-self-start'
                          : 'md:col-start-1 md:justify-self-end'
                      }`}
                    >
                      <div
                        className={`education-card ${
                          isCurrent ? 'education-card--current' : ''
                        } ${index === 0 ? 'education-card--featured' : ''}`}
                      >
                        <div className="education-card-inner">
                          <div className="education-card-header">
                            <div className="education-title-group">
                              <div className="education-title-icon">
                                <FieldIcon />
                              </div>
                              <h3 className="education-title">{edu.degree}</h3>
                            </div>
                            {dateRange && (
                              <div className="education-date">
                                <FaCalendarAlt />
                                <span>{dateRange}</span>
                              </div>
                            )}
                          </div>

                          <div className="education-institution-row">
                            {logo ? (
                              <img
                                src={logo}
                                alt={`${edu.institution} logo`}
                                className="education-institution-logo"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="education-institution-logo education-institution-logo--fallback">
                                {initials}
                              </div>
                            )}
                            <p className="education-institution">
                              {edu.institution}
                            </p>
                          </div>

                          <div className="education-meta">
                            {edu.location && (
                              <span>
                                <FaMapMarkerAlt />
                                {edu.location}
                              </span>
                            )}
                          </div>

                          <div className="education-badges">
                            {isCurrent && (
                              <span className="education-badge education-badge--current">
                                <span className="education-badge-dot" />
                                Currently Enrolled
                              </span>
                            )}
                            {edu.grade && (
                              <span className="education-badge education-badge--grade">
                                <FaStar className="education-badge-icon" />
                                <span>{edu.grade}</span>
                              </span>
                            )}
                            {badges.map((badge) => (
                              <span
                                key={badge.label}
                                className={`education-badge ${badge.variant}`}
                              >
                                <badge.icon className="education-badge-icon" />
                                <span>{badge.label}</span>
                              </span>
                            ))}
                          </div>

                          {edu.description && (
                            <div className="education-description">
                              <p>{description}</p>
                              {hasLongDescription && (
                                <button
                                  type="button"
                                  className="education-toggle"
                                  onClick={() =>
                                    setExpandedId(
                                      isExpanded ? null : edu._id
                                    )
                                  }
                                >
                                  {isExpanded ? (
                                    <>
                                      Show Less <FaChevronUp />
                                    </>
                                  ) : (
                                    <>
                                      Read More <FaChevronDown />
                                    </>
                                  )}
                                </button>
                              )}
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

      {aboutData?.certifications && aboutData.certifications.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="education-section-header">
            <h2 className="education-section-title">Certifications</h2>
            <p className="education-section-subtitle">
              Industry credentials and certifications earned over time.
            </p>
          </div>

          <div className="education-cert-grid">
            {aboutData.certifications.map((cert, index) => (
              <motion.div
                key={`${cert.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="education-cert-card"
              >
                <h3 className="education-cert-title">{cert.name}</h3>
                <p className="education-cert-issuer">{cert.issuer}</p>
                {cert.date && (
                  <p className="education-cert-date">{cert.date}</p>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="education-cert-link"
                  >
                    View Credential
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {skillHighlights.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="education-section-header">
            <h2 className="education-section-title">Skills Acquired</h2>
            <p className="education-section-subtitle">
              Skills refined and strengthened through my education path.
            </p>
          </div>

          <div className="education-skills-grid">
            {skillHighlights.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="education-skill-card"
              >
                <div className="education-skill-header">
                  <div className="education-skill-title">
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        className="education-skill-icon"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <h3>{skill.name}</h3>
                  </div>
                  <span className="education-skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="skill-bar-fill"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="education-cta">
          <div>
            <h3 className="education-cta-title">Explore More Details</h3>
            <p className="education-cta-text">
              Download academic documents, browse certifications, or connect
              education milestones to real projects.
            </p>
          </div>
          <div className="education-cta-actions">
            <Link to="/resume" className="education-cta-primary">
              Download Transcript
            </Link>
            <Link to="/about" className="education-cta-secondary">
              View Certifications
            </Link>
            <Link to="/projects" className="education-cta-outline">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
