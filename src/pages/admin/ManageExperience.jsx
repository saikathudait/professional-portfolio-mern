import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    technologies: '',
    companyLogo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experience');
      setExperiences(response.data.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to fetch experiences');
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
      const data = {
        ...formData,
        responsibilities: formData.responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingExperience) {
        await api.put(`/experience/${editingExperience._id}`, data);
        toast.success('Experience updated successfully');
      } else {
        await api.post('/experience', data);
        toast.success('Experience created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchExperiences();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save experience'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      location: experience.location || '',
      startDate: experience.startDate,
      endDate: experience.endDate || '',
      responsibilities: experience.responsibilities?.join('\n') || '',
      technologies: experience.technologies?.join(', ') || '',
      companyLogo: experience.companyLogo || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?'))
      return;

    try {
      await api.delete(`/experience/${id}`);
      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      technologies: '',
      companyLogo: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Experience</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage your work experience
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
        >
          <HiPlus className="mr-2" />
          Add Experience
        </button>
      </div>

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">
            No experience yet. Add your first work experience!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                  <p className="text-navy-600 dark:text-aqua-400 font-semibold mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.startDate} - {exp.endDate || 'Present'}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <HiPencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Responsibilities:</h4>
                  <ul className="space-y-1">
                    {exp.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        className="flex items-start text-gray-700 dark:text-gray-300 text-sm"
                      >
                        <span className="text-navy-500 dark:text-aqua-500 mr-2">
                          •
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-navy-100 dark:bg-navy-900 text-navy-600 dark:text-aqua-400 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., London, UK"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Jan 2023"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date (Leave empty for current)
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    placeholder="e.g., Dec 2024 or Present"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Responsibilities (one per line)
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Led development team&#10;Implemented new features&#10;Improved performance"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="e.g., Python, Django, PostgreSQL"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Logo URL (optional)
                </label>
                <input
                  type="text"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingExperience
                    ? 'Update Experience'
                    : 'Create Experience'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageExperience;
