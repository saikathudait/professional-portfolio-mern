import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import api from '../utils/api';
import Loading from '../components/Loading';
import { formatDate } from '../utils/helpers';

const PAGE_SIZE = 10;

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setBlogs(response.data.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const sortedBlogs = useMemo(() => {
    const list = [...blogs];
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  }, [blogs]);

  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedBlogs.slice(start, start + PAGE_SIZE);
  }, [sortedBlogs, page]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="blog-table-page min-h-screen pt-16">
      <header className="blog-table-hero">
        <div className="blog-table-hero-spotlight" aria-hidden="true" />
        <div className="blog-table-hero-pattern" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="blog-table-title"
          >
            All Blogs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="blog-table-subtitle"
          >
            Every article in one place with quick access.
          </motion.p>
        </div>
        <svg
          className="blog-table-hero-wave"
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

      <section className="blog-table-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="blog-table-card">
            <div className="blog-table-header">
              <div>
                <h2>Blog Table</h2>
                <p>All blog entries are fetched live from the database.</p>
              </div>
              <span className="blog-table-count">{blogs.length} total</span>
            </div>

            {sortedBlogs.length === 0 ? (
              <div className="blog-table-empty">
                <p>No blogs are available yet.</p>
                <Link to="/blog" className="blog-table-back-link">
                  Back to Blog
                </Link>
              </div>
            ) : (
              <>
                <div className="blog-table-wrapper">
                  <table className="blog-table">
                    <thead>
                      <tr>
                        <th>SL No</th>
                        <th>Topic</th>
                        <th>Written By</th>
                        <th>Date</th>
                        <th>Read More</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBlogs.map((blog, index) => {
                        const serial =
                          (page - 1) * PAGE_SIZE + index + 1;
                        return (
                          <tr key={blog._id}>
                            <td>{serial}</td>
                            <td className="blog-table-topic">{blog.title}</td>
                            <td>{blog.author?.name || 'Admin'}</td>
                            <td>{formatDate(blog.createdAt)}</td>
                            <td>
                              <Link
                                to={`/blog/${blog.slug}`}
                                className="blog-table-read"
                              >
                                Read More
                                <HiArrowRight />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="blog-table-footer">
                  <div className="blog-table-total">
                    Total rows: {sortedBlogs.length}
                  </div>
                  <div className="blog-pagination">
                    <button
                      type="button"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        type="button"
                        onClick={() => goToPage(i + 1)}
                        className={page === i + 1 ? 'is-active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogTable;
