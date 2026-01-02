import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Loading from '../components/Loading';
import { formatDate, getReadingTime } from '../utils/helpers';
import {
  FaBook,
  FaChartLine,
  FaCode,
  FaLaptopCode,
  FaRobot,
  FaUser,
} from 'react-icons/fa';
import { HiArrowRight, HiCalendar, HiClock, HiEye } from 'react-icons/hi';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRes = await api.get('/blogs');
        setBlogs(blogsRes.data.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getCategoryMeta = (category = '') => {
    const value = category.toLowerCase();
    if (value.includes('machine') || value.includes('ai')) {
      return {
        label: category,
        icon: FaRobot,
        badgeClass: 'blog-category--ml',
        cardClass: 'blog-card--ml',
        filterClass: 'blog-filter-pill--ml',
      };
    }
    if (value.includes('data')) {
      return {
        label: category,
        icon: FaChartLine,
        badgeClass: 'blog-category--data',
        cardClass: 'blog-card--data',
        filterClass: 'blog-filter-pill--data',
      };
    }
    if (value.includes('tutorial')) {
      return {
        label: category,
        icon: FaBook,
        badgeClass: 'blog-category--tutorial',
        cardClass: 'blog-card--tutorial',
        filterClass: 'blog-filter-pill--tutorial',
      };
    }
    if (value.includes('web')) {
      return {
        label: category,
        icon: FaLaptopCode,
        badgeClass: 'blog-category--web',
        cardClass: 'blog-card--web',
        filterClass: 'blog-filter-pill--web',
      };
    }
    if (value.includes('personal')) {
      return {
        label: category,
        icon: FaUser,
        badgeClass: 'blog-category--personal',
        cardClass: 'blog-card--personal',
        filterClass: 'blog-filter-pill--personal',
      };
    }
    return {
      label: category || 'Technology',
      icon: FaCode,
      badgeClass: 'blog-category--tech',
      cardClass: 'blog-card--tech',
      filterClass: 'blog-filter-pill--tech',
    };
  };

  if (loading) return <Loading fullScreen />;

  const latestBlogs = [...blogs]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="blog-page min-h-screen pt-16">
      <header className="blog-hero">
        <div className="blog-hero-spotlight" aria-hidden="true" />
        <div className="blog-hero-pattern" aria-hidden="true" />
        <div className="blog-hero-shape blog-hero-shape-one" aria-hidden="true" />
        <div className="blog-hero-shape blog-hero-shape-two" aria-hidden="true" />
        <div className="blog-hero-shape blog-hero-shape-three" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="blog-hero-title"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="blog-hero-subtitle"
          >
            Thoughts, tutorials, and insights on data science and technology.
          </motion.p>
        </div>
        <svg
          className="blog-hero-wave"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No blog posts found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="blog-grid blog-grid--summary">
            {latestBlogs.map((blog, index) => {
              const meta = getCategoryMeta(blog.category);
              const CategoryIcon = meta.icon;
              return (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`blog-card ${meta.cardClass}`}
                >
                  <div className="blog-card-inner">
                    <div className="blog-card-media">
                      {blog.featuredImage ? (
                        <Link to={`/blog/${blog.slug}`}>
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="blog-card-image"
                          />
                        </Link>
                      ) : (
                        <div className="blog-card-placeholder">
                          <FaBook />
                        </div>
                      )}
                      <div className="blog-card-overlay">
                        <span className={`blog-category-badge ${meta.badgeClass}`}>
                          <CategoryIcon />
                          {meta.label}
                        </span>
                        <span className="blog-readtime-badge">
                          <HiClock />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>
                    </div>

                    <div className="blog-card-body">
                      <Link to={`/blog/${blog.slug}`}>
                        <h2 className="blog-card-title">{blog.title}</h2>
                      </Link>
                      <p className="blog-card-excerpt">{blog.excerpt}</p>

                      {blog.author && (
                        <div className="blog-author">
                          {blog.author.profileImage && (
                            <img
                              src={blog.author.profileImage}
                              alt={blog.author.name}
                              className="blog-author-avatar"
                            />
                          )}
                          <span>By {blog.author.name}</span>
                        </div>
                      )}

                      <div className="blog-meta">
                        <span className="blog-meta-pill blog-meta-pill--date">
                          <HiCalendar />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span className="blog-meta-pill blog-meta-pill--views">
                          <HiEye />
                          {blog.views || 0} views
                        </span>
                        <span className="blog-meta-pill blog-meta-pill--time">
                          <HiClock />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-tag-list">
                          {blog.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="blog-tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link to={`/blog/${blog.slug}`} className="blog-card-cta">
                        Read More
                        <HiArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            <Link to="/blog/all" className="blog-card blog-card--more">
              <div className="blog-card-inner blog-card-inner--more">
                <div className="blog-more-icon">
                  <FaBook />
                </div>
                <h3>More Blogs</h3>
                <p>Browse the complete list in a detailed table.</p>
                <span className="blog-more-button">
                  View all blogs
                  <HiArrowRight />
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
