import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const ManageHome = () => {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    heroImage: '',
    heroVideo: '',
    cvLink: '',
    ctaText: '',
    ctaLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await api.get('/home');
      const data = response.data.data || {};
      setFormData({
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        heroDescription: data.heroDescription || '',
        heroImage: data.heroImage || '',
        heroVideo: data.heroVideo || '',
        cvLink: data.cvLink || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
      toast.error('Failed to fetch home content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put('/home', formData);
      toast.success('Home content updated successfully');
      fetchHomeData();
    } catch (error) {
      console.error('Error updating home content:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update home content';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Home Page</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update the hero section and main content of your homepage
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title *</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              required
              placeholder="Hi, I'm Saikat"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle *</label>
            <input
              type="text"
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleChange}
              required
              placeholder="Data Analyst & Machine Learning Engineer"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hero Description *
            </label>
            <textarea
              name="heroDescription"
              value={formData.heroDescription}
              onChange={handleChange}
              required
              rows="4"
              placeholder="I build intelligent systems, dashboards, and predictive models..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hero Image URL
            </label>
            <input
              type="text"
              name="heroImage"
              value={formData.heroImage}
              onChange={handleChange}
              placeholder="https://example.com/profile-image.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hero Video URL (optional)
            </label>
            <input
              type="text"
              name="heroVideo"
              value={formData.heroVideo}
              onChange={handleChange}
              placeholder="https://example.com/intro-video.mp4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CV/Resume Link</label>
            <input
              type="text"
              name="cvLink"
              value={formData.cvLink}
              onChange={handleChange}
              placeholder="https://example.com/cv.pdf"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
                placeholder="View My Work"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="/projects"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ManageHome;
