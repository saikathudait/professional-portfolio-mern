import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBolt,
  FaBriefcase,
  FaChartLine,
  FaCheckCircle,
  FaProjectDiagram,
} from 'react-icons/fa';
import { HiAcademicCap, HiHeart } from 'react-icons/hi';
import api from '../utils/api';
import Loading from '../components/Loading';
import { getTotalExperienceLabel } from '../utils/experience';
import { fetchExperiences } from '../utils/experienceData';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [education, setEducation] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalExperienceLabel =
    getTotalExperienceLabel(experiences) || '0 mo';
  const projectsCountLabel = `${projectsCount}`;

  const stats = [
    {
      value: projectsCountLabel,
      label: 'Projects Delivered',
      detail: 'ML and analytics builds',
      icon: FaProjectDiagram,
    },
    {
      value: '95%',
      label: 'Model Accuracy',
      detail: 'Best performing models',
      icon: FaChartLine,
    },
    {
      value: totalExperienceLabel,
      label: 'Total Experience',
      detail: 'Industry practice',
      icon: FaBriefcase,
    },
    {
      value: 'Available',
      label: 'Open to Roles',
      detail: 'Remote or onsite',
      icon: FaBolt,
    },
  ];

  const focusAreas = [
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Data Visualization',
    'Python Development',
    'MLOps',
  ];

  const whatIDo = [
    'Build predictive models and data products',
    'Design analytics dashboards and pipelines',
    'Deploy ML systems with monitoring',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [aboutRes, educationRes, projectsRes, experienceRes] =
        await Promise.allSettled([
        api.get('/about', { params: { includeOwnerImage: true } }),
        api.get('/education'),
        api.get('/projects'),
        fetchExperiences(),
      ]);

      if (aboutRes.status === 'fulfilled') {
        setAboutData(aboutRes.value.data.data);
      } else {
        console.error('Error fetching about data:', aboutRes.reason);
      }

      if (educationRes.status === 'fulfilled') {
        setEducation(educationRes.value.data.data);
      } else {
        console.error('Error fetching education:', educationRes.reason);
      }

      if (projectsRes.status === 'fulfilled') {
        const count =
          projectsRes.value.data.count ??
          projectsRes.value.data.data?.length ??
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

  if (loading) return <Loading fullScreen />;

  const profileImage =
    aboutData?.profileImage || aboutData?.ownerProfileImage;
  const bioText =
    aboutData?.bio ||
    'Passionate Data Analyst and Machine Learning Engineer focused on building intelligent systems.';
  const missionText =
    aboutData?.missionStatement ||
    'My mission is to leverage data science and AI to solve real-world problems.';

  return (
    <div className="min-h-screen pt-16 about-page">
      <section className="about-hero">
        <div className="about-hero-pattern" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb-one" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb-two" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="about-hero-title"
          >
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="about-hero-subtitle"
          >
            Get to know more about my journey, focus areas, and mission.
          </motion.p>
        </div>
        <svg
          className="about-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0a1628"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-4"
          >
            {profileImage ? (
              <div className="about-profile-wrap">
                <div className="about-profile-orbit orbit-one" />
                <div className="about-profile-orbit orbit-two" />
                <div className="about-profile-glow" />
                <div className="about-profile-border">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="about-profile-image"
                  />
                </div>
              </div>
            ) : (
              <div className="about-profile-placeholder">
                Profile photo coming soon
              </div>
            )}
            <div className="about-glass-card">
              <h3 className="about-card-title">My Mission</h3>
              <p className="about-card-text text-justify">{missionText}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-4">
              <div className="about-glass-card">
                <h2 className="about-card-title">Who I Am</h2>
                <p className="about-card-text text-justify">{bioText}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="about-glass-card">
                  <h3 className="about-card-title">What I Do</h3>
                  <ul className="about-card-list">
                    {whatIDo.map((item) => (
                      <li key={item}>
                        <FaCheckCircle className="text-cyan-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="about-glass-card">
                  <h3 className="about-card-title">My Expertise</h3>
                  <div className="about-pill-list">
                    {focusAreas.map((item) => (
                      <span key={item} className="about-pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-title">Quick Stats</h2>
            <div className="about-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat-card">
                  <stat.icon className="about-stat-icon" />
                  <div>
                    <p className="about-stat-value">{stat.value}</p>
                    <p className="about-stat-label">{stat.label}</p>
                    <p className="about-stat-detail">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <HiAcademicCap className="text-cyan-300" size={30} />
              <h2 className="about-section-title">Education</h2>
            </div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-8 border-l-2 border-white/10"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-400 rounded-full" />
                  <div className="about-glass-card">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {edu.degree}
                      </h3>
                      <span className="text-sm text-slate-400">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-cyan-300 font-semibold mb-2">
                      {edu.institution}
                    </p>
                    {edu.location && (
                      <p className="text-slate-300 text-sm mb-2">
                        {edu.location}
                      </p>
                    )}
                    {edu.grade && (
                      <p className="text-slate-200 mb-2">
                        Grade: {edu.grade}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-slate-300">{edu.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {aboutData?.certifications && aboutData.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="about-section-title mb-8">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="about-glass-card card-hover"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-slate-300 mb-2">{cert.issuer}</p>
                  <p className="text-sm text-slate-400 mb-3">{cert.date}</p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline text-sm"
                    >
                      View Credential
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {aboutData?.volunteering && aboutData.volunteering.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-8">
              <HiHeart className="text-pink-400 mr-3" size={30} />
              <h2 className="about-section-title">Volunteering</h2>
            </div>

            <div className="space-y-6">
              {aboutData.volunteering.map((vol, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="about-glass-card"
                >
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {vol.role}
                    </h3>
                    <span className="text-sm text-slate-400">
                      {vol.startDate} - {vol.endDate}
                    </span>
                  </div>
                  <p className="text-cyan-300 font-semibold mb-2">
                    {vol.organization}
                  </p>
                  <p className="text-slate-300">{vol.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <section className="mt-20">
          <div className="about-cta">
            <div className="about-cta-card">
              <div>
                <h3 className="about-card-title">Ready to Collaborate?</h3>
                <p className="about-card-text">
                  Let&#39;s build something impactful together. Explore my
                  projects or reach out to discuss a new opportunity.
                </p>
              </div>
              <div className="about-cta-actions">
                <Link to="/projects" className="about-cta-primary">
                  View Projects
                </Link>
                <Link to="/contact" className="about-cta-secondary">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
