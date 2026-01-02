import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaCopy,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaSpinner,
  FaTwitter,
  FaUserAlt,
} from 'react-icons/fa';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyToClipboard = async (value) => {
    if (!value) return false;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(textArea);
    return copied;
  };

  const handleCopy = async (value, label) => {
    try {
      const copied = await copyToClipboard(value);
      if (copied) {
        toast.success(`${label} copied to clipboard`);
      } else {
        toast.error('Unable to copy at the moment');
      }
    } catch (error) {
      toast.error('Unable to copy at the moment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to send message';
      toast.error(message);
      setStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'saikathudait2001@gmail.com',
      link: 'mailto:saikathudait2001@gmail.com',
      copy: 'saikathudait2001@gmail.com',
      accent: {
        start: '#3b82f6',
        end: '#06b6d4',
        glow: 'rgba(59, 130, 246, 0.45)',
      },
    },
    {
      icon: FaPhoneAlt,
      title: 'Phone',
      content: '+91 7479309346',
      link: 'tel:+917479309346',
      copy: '+91 7479309346',
      accent: {
        start: '#10b981',
        end: '#14b8a6',
        glow: 'rgba(16, 185, 129, 0.45)',
      },
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      content: 'Kolkata, India',
      link: 'https://maps.google.com/?q=Kolkata,+India',
      accent: {
        start: '#8b5cf6',
        end: '#ec4899',
        glow: 'rgba(139, 92, 246, 0.45)',
      },
    },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      url: 'https://github.com/saikathudait',
      label: 'GitHub',
      className: 'social-circle--github',
    },
    {
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/saikat-hudait/',
      label: 'LinkedIn',
      className: 'social-circle--linkedin',
    },
    {
      icon: FaTwitter,
      url: 'https://twitter.com',
      label: 'Twitter',
      className: 'social-circle--twitter',
    },
  ];

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const buttonLabel = isLoading
    ? 'Sending...'
    : isSuccess
    ? 'Message Sent'
    : 'Send Message';

  return (
    <div className="contact-page min-h-screen pt-16">
      <header className="contact-hero">
        <div className="contact-hero-spotlight" aria-hidden="true" />
        <div className="contact-hero-pattern" aria-hidden="true" />
        <div
          className="contact-hero-shape contact-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="contact-hero-shape contact-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="contact-hero-shape contact-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-hero-title"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="contact-hero-subtitle"
          >
            Let&#39;s discuss your next project or just say hello.
          </motion.p>
        </div>
        <svg
          className="contact-hero-wave"
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
        <div className="contact-layout">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="contact-info-panel"
          >
            <div className="contact-info-header">
              <h2>Contact Information</h2>
              <span className="contact-availability">
                <span className="contact-availability-dot" />
                Available for Projects
              </span>
            </div>
            <p className="contact-info-text">
              Feel free to reach out through any of these channels. I&#39;m
              always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>

            <div className="contact-card-list">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const cardStyle = {
                  '--contact-start': info.accent.start,
                  '--contact-end': info.accent.end,
                  '--contact-glow': info.accent.glow,
                };

                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="contact-card"
                    style={cardStyle}
                  >
                    <div className="contact-card-inner">
                      <span className="contact-card-icon">
                        <Icon />
                      </span>
                      <div className="contact-card-body">
                        <div className="contact-card-top">
                          <h3>{info.title}</h3>
                          {info.copy && (
                            <button
                              type="button"
                              className="contact-copy"
                              onClick={() =>
                                handleCopy(info.copy, info.title)
                              }
                            >
                              <FaCopy />
                              Copy
                            </button>
                          )}
                        </div>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="contact-card-value"
                            target={
                              info.link.startsWith('http')
                                ? '_blank'
                                : undefined
                            }
                            rel={
                              info.link.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="contact-card-value">{info.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="contact-social">
              <h3>Connect With Me</h3>
              <div className="contact-social-list">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className={`social-circle ${social.className}`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="contact-response">
              <FaClock />
              <span>I typically respond within 24 hours.</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="contact-form-card"
          >
            <div className="contact-form-inner">
              <h2>Send Me a Message</h2>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-field">
                  <div className="contact-input">
                    <span className="contact-input-icon">
                      <FaUserAlt />
                    </span>
                    <div className="contact-input-control">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="name">Your Name *</label>
                    </div>
                  </div>
                  <span className="contact-input-hint">e.g., John Doe</span>
                </div>

                <div className="contact-field">
                  <div className="contact-input">
                    <span className="contact-input-icon">
                      <FaEnvelope />
                    </span>
                    <div className="contact-input-control">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="email">Your Email *</label>
                    </div>
                  </div>
                  <span className="contact-input-hint">
                    e.g., john@example.com
                  </span>
                </div>

                <div className="contact-field">
                  <div className="contact-input">
                    <span className="contact-input-icon">
                      <FaCommentDots />
                    </span>
                    <div className="contact-input-control">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder=" "
                      />
                      <label htmlFor="message">Your Message *</label>
                    </div>
                  </div>
                  <span className="contact-input-hint">
                    Tell me about your project...
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`contact-submit ${
                    isSuccess ? 'contact-submit--success' : ''
                  } ${isError ? 'contact-submit--error' : ''}`}
                >
                  <span className="contact-submit-icon">
                    {isLoading ? (
                      <FaSpinner className="contact-spinner" />
                    ) : isSuccess ? (
                      <FaCheckCircle />
                    ) : (
                      <FaPaperPlane />
                    )}
                  </span>
                  {buttonLabel}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
