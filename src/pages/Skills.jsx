import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBolt,
  FaBrain,
  FaChartLine,
  FaCode,
  FaDatabase,
  FaLayerGroup,
  FaTools,
  FaUserTie,
} from 'react-icons/fa';
import api from '../utils/api';
import Loading from '../components/Loading';

const Skills = () => {
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills/category');
        setSkillsByCategory(response.data.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = Object.keys(skillsByCategory);

  const allSkills = useMemo(
    () =>
      categories.flatMap((category) => skillsByCategory[category] || []),
    [categories, skillsByCategory]
  );

  const averageLevel = useMemo(() => {
    if (allSkills.length === 0) return null;
    const total = allSkills.reduce(
      (sum, skill) => sum + (skill.level || 0),
      0
    );
    return Math.round(total / allSkills.length);
  }, [allSkills]);

  const getCategoryMeta = (category) => {
    const value = category.toLowerCase();
    if (value.includes('program')) {
      return {
        icon: FaCode,
        start: '#3b82f6',
        end: '#06b6d4',
        glow: 'rgba(59, 130, 246, 0.45)',
      };
    }
    const isAiCategory =
      value.includes('ml') ||
      value.includes('machine') ||
      value.includes('deep') ||
      value.includes('nlp') ||
      value === 'ai' ||
      value.includes('ai/');

    if (isAiCategory) {
      return {
        icon: FaBrain,
        start: '#8b5cf6',
        end: '#ec4899',
        glow: 'rgba(139, 92, 246, 0.45)',
      };
    }
    if (value.includes('tool') || value.includes('platform')) {
      return {
        icon: FaTools,
        start: '#f97316',
        end: '#fbbf24',
        glow: 'rgba(249, 115, 22, 0.45)',
        dense: true,
      };
    }
    if (value.includes('database') || value.includes('sql')) {
      return {
        icon: FaDatabase,
        start: '#10b981',
        end: '#14b8a6',
        glow: 'rgba(16, 185, 129, 0.45)',
      };
    }
    if (value.includes('soft')) {
      return {
        icon: FaUserTie,
        start: '#6366f1',
        end: '#3b82f6',
        glow: 'rgba(99, 102, 241, 0.45)',
      };
    }
    return {
      icon: FaLayerGroup,
      start: '#06b6d4',
      end: '#8b5cf6',
      glow: 'rgba(6, 182, 212, 0.45)',
    };
  };

  const getLevelMeta = (level) => {
    if (level >= 90) return { label: 'Expert', className: 'skill-level--expert' };
    if (level >= 75)
      return { label: 'Advanced', className: 'skill-level--advanced' };
    if (level >= 60)
      return { label: 'Intermediate', className: 'skill-level--intermediate' };
    return { label: 'Learning', className: 'skill-level--learning' };
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="skills-page min-h-screen pt-16">
      <header className="skills-hero">
        <div className="skills-hero-spotlight" aria-hidden="true" />
        <div className="skills-hero-pattern" aria-hidden="true" />
        <div
          className="skills-hero-shape skills-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="skills-hero-shape skills-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="skills-hero-shape skills-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="skills-hero-title"
          >
            Skills & Expertise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="skills-hero-subtitle"
          >
            Technologies, tools, and frameworks that power my work.
          </motion.p>
        </div>
        <svg
          className="skills-hero-wave"
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
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No skills data available yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category, categoryIndex) => {
              const meta = getCategoryMeta(category);
              const skills = skillsByCategory[category] || [];
              const accentStyle = {
                '--accent-start': meta.start,
                '--accent-end': meta.end,
                '--accent-glow': meta.glow,
              };
              const gridClass = meta.dense
                ? 'skills-grid skills-grid--dense'
                : 'skills-grid';
              const CategoryIcon = meta.icon;

              return (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="skills-category"
                  style={accentStyle}
                >
                  <div className="skills-category-header">
                    <div className="skills-category-title">
                      <span className="skills-category-icon">
                        <CategoryIcon size={18} />
                      </span>
                      <h2>{category}</h2>
                    </div>
                    <span className="skills-category-count">
                      {skills.length} skills
                    </span>
                  </div>
                  <div className="skills-category-divider" aria-hidden="true" />

                  <div className={gridClass}>
                    {skills.map((skill, index) => {
                      const levelMeta = getLevelMeta(skill.level || 0);
                      const initials = skill.name
                        ? skill.name.slice(0, 1).toUpperCase()
                        : '?';
                      const isFeatured = (skill.level || 0) >= 90;

                      return (
                        <motion.div
                          key={skill._id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          className={`skill-card ${
                            isFeatured ? 'skill-card--featured' : ''
                          }`}
                          style={accentStyle}
                        >
                          <div className="skill-card-inner">
                            <div className="skill-card-header">
                              <div className="skill-icon-wrap">
                                {skill.icon ? (
                                  <img
                                    src={skill.icon}
                                    alt={`${skill.name} icon`}
                                    className="skill-icon-image"
                                    loading="lazy"
                                    onError={(event) => {
                                      event.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="skill-icon-fallback">
                                    {initials}
                                  </span>
                                )}
                              </div>
                              <div className="skill-title">
                                <h3 className="skill-name">{skill.name}</h3>
                                <span
                                  className={`skill-level ${levelMeta.className}`}
                                >
                                  {levelMeta.label}
                                </span>
                              </div>
                              <span className="skill-percent">
                                {skill.level}%
                              </span>
                            </div>

                            <div className="skill-bar">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1.2, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="skill-bar-fill"
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="skills-summary-card"
          >
            <div className="skills-summary-inner">
              <div className="skills-summary-header">
                <span className="skills-summary-icon">
                  <FaBolt />
                </span>
                <div>
                  <h2>Continuous Learning</h2>
                  <p>
                    I stay current with modern tooling, frameworks, and data
                    practices to deliver reliable outcomes.
                  </p>
                </div>
              </div>
              <div className="skills-summary-grid">
                <div className="skills-summary-stat">
                  <FaLayerGroup />
                  <div>
                    <p className="skills-summary-value">
                      {allSkills.length}
                    </p>
                    <p className="skills-summary-label">Total Skills</p>
                  </div>
                </div>
                <div className="skills-summary-stat">
                  <FaChartLine />
                  <div>
                    <p className="skills-summary-value">
                      {averageLevel ? `${averageLevel}%` : 'N/A'}
                    </p>
                    <p className="skills-summary-label">Average Proficiency</p>
                  </div>
                </div>
                <div className="skills-summary-stat">
                  <FaBolt />
                  <div>
                    <p className="skills-summary-value">Always</p>
                    <p className="skills-summary-label">Learning Mindset</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Skills;
