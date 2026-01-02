import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import { HiMail, HiMailOpen, HiTrash, HiCheck, HiX } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      const query =
        filter === 'all' ? '' : filter === 'unread' ? '?read=false' : '?read=true';
      const response = await api.get(`/contact${query}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      toast.success('Message marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAsReplied = async (id) => {
    try {
      await api.put(`/contact/${id}/replied`);
      toast.success('Message marked as replied');
      fetchMessages();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to mark as replied');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?'))
      return;

    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted successfully');
      fetchMessages();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read when viewing
    if (!message.read) {
      await handleMarkAsRead(message._id);
    }
  };

  if (loading) return <Loading fullScreen />;

  const filteredMessages =
    filter === 'all'
      ? messages
      : filter === 'unread'
      ? messages.filter((m) => !m.read)
      : messages.filter((m) => m.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage contact form submissions
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-navy-500 text-white dark:bg-aqua-500'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-navy-500 text-white dark:bg-aqua-500'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Unread ({messages.filter((m) => !m.read).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'read'
                ? 'bg-navy-500 text-white dark:bg-aqua-500'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Read ({messages.filter((m) => m.read).length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleViewMessage(message)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow ${
                !message.read ? 'border-l-4 border-navy-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!message.read ? (
                      <HiMail className="text-navy-500 dark:text-aqua-500" size={20} />
                    ) : (
                      <HiMailOpen className="text-gray-400" size={20} />
                    )}
                    <h3 className="text-lg font-bold">{message.name}</h3>
                    {message.replied && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                        Replied
                      </span>
                    )}
                    {!message.read && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {message.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Sender Info */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  From:
                </label>
                <p className="text-lg font-semibold">{selectedMessage.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email:
                </label>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-lg text-navy-500 dark:text-aqua-500 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date:
                </label>
                <p className="text-lg">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Message:
                </label>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-2">
                {!selectedMessage.read && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    Unread
                  </span>
                )}
                {selectedMessage.replied && (
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    Replied
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="w-full sm:flex-1 px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold text-center"
                >
                  Reply via Email
                </a>
                {!selectedMessage.replied && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage._id)}
                    className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center"
                  >
                    <HiCheck className="mr-2" />
                    Mark as Replied
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center"
                >
                  <HiTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
