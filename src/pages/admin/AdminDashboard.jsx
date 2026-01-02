import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import {
  HiViewGrid,
  HiNewspaper,
  HiLightningBolt,
  HiMail,
  HiEye,
  HiUsers,
} from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setStats(response.data.data.stats);
        setRecentBlogs(response.data.data.recentBlogs);
        setRecentContacts(response.data.data.recentContacts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading fullScreen />;

  const statCards = [
    {
      icon: HiViewGrid,
      title: 'Total Projects',
      value: stats?.projects || 0,
      color: 'bg-blue-500',
    },
    {
      icon: HiNewspaper,
      title: 'Blog Posts',
      value: stats?.blogs || 0,
      color: 'bg-green-500',
    },
    {
      icon: HiLightningBolt,
      title: 'Skills',
      value: stats?.skills || 0,
      color: 'bg-yellow-500',
    },
    {
      icon: HiMail,
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      color: 'bg-red-500',
    },
    {
      icon: HiEye,
      title: 'Total Page Views',
      value: stats?.totalPageViews || 0,
      color: 'bg-purple-500',
    },
    {
      icon: HiUsers,
      title: 'Unique Visitors',
      value: stats?.totalUniqueVisitors || 0,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="text-white" size={32} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Recent Blog Posts</h2>
          {recentBlogs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h3 className="font-semibold mb-1">{blog.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span className="flex items-center">
                      <HiEye className="mr-1" />
                      {blog.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Contact Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
          {recentContacts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </p>
                    </div>
                    {!contact.read && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {contact.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;