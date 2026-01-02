import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Loading from '../components/Loading';
import { formatDate, getReadingTime } from '../utils/helpers';
import { HiArrowLeft, HiClock, HiEye, HiCalendar } from 'react-icons/hi';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/slug/${slug}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <Loading fullScreen />;

  if (!blog) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Link
            to="/blog"
            className="text-navy-500 dark:text-aqua-500 hover:underline"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-navy-500 dark:text-aqua-500 hover:underline mb-8"
        >
          <HiArrowLeft className="mr-2" />
          Back to Blog
        </button>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Category */}
          <span className="inline-block px-4 py-2 bg-navy-100 dark:bg-navy-900 text-navy-600 dark:text-aqua-400 rounded-full text-sm font-semibold mb-4">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <HiCalendar className="mr-2" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <HiClock className="mr-2" />
              <span>{getReadingTime(blog.content)}</span>
            </div>
            <div className="flex items-center">
              <HiEye className="mr-2" />
              <span>{blog.views} views</span>
            </div>
          </div>

          {/* Author */}
          {blog.author && (
            <div className="flex items-center mb-6">
              {blog.author.profileImage && (
                <img
                  src={blog.author.profileImage}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{blog.author.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {blog.author.email}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="blog-content prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
          >
            ← Back to All Posts
          </Link>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;