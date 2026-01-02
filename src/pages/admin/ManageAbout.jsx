import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import { HiPlus, HiX, HiTrash } from 'react-icons/hi';

const ManageAbout = () => {
  const [formData, setFormData] = useState({
    bio: '',
    missionStatement: '',
    profileImage: '',
    certifications: [],
    volunteering: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialUrl: '',
  });
  const [newVolunteer, setNewVolunteer] = useState({
    organization: '',
    role: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [showCertModal, setShowCertModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchAboutData();
  }, []);

  useEffect(() => {
    if (location.hash !== '#certifications') return;
    const section = document.getElementById('certifications');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const fetchAboutData = async () => {
    try {
      const response = await api.get('/about');
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast.error('Failed to fetch about content');
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
      await api.put('/about', formData);
      toast.success('About content updated successfully');
      fetchAboutData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update about content'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const saveAboutData = async (nextData, successMessage) => {
    try {
      const response = await api.put('/about', nextData);
      if (response?.data?.data) {
        setFormData(response.data.data);
      }
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      toast.error(error.response?.data?.message || 'Auto-save failed');
    }
  };

  // Certifications
  const handleAddCert = async () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error('Please fill in required fields');
      return;
    }

    const updatedData = {
      ...formData,
      certifications: [...(formData.certifications || []), newCert],
    };
    setFormData(updatedData);
    setNewCert({ name: '', issuer: '', date: '', credentialUrl: '' });
    setShowCertModal(false);
    await saveAboutData(updatedData, 'Certification saved');
  };

  const handleRemoveCert = async (index) => {
    const updated = (formData.certifications || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, certifications: updated };
    setFormData(updatedData);
    await saveAboutData(updatedData, 'Certification removed');
  };

  // Volunteering
  const handleAddVolunteer = async () => {
    if (!newVolunteer.organization || !newVolunteer.role) {
      toast.error('Please fill in required fields');
      return;
    }

    const updatedData = {
      ...formData,
      volunteering: [...(formData.volunteering || []), newVolunteer],
    };
    setFormData(updatedData);
    setNewVolunteer({
      organization: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setShowVolunteerModal(false);
    await saveAboutData(updatedData, 'Volunteering saved');
  };

  const handleRemoveVolunteer = async (index) => {
    const updated = (formData.volunteering || []).filter((_, i) => i !== index);
    const updatedData = { ...formData, volunteering: updated };
    setFormData(updatedData);
    await saveAboutData(updatedData, 'Volunteering removed');
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage About Page</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your biography and professional information
        </p>
      </div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Biography *</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Tell your story..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mission Statement *
            </label>
            <textarea
              name="missionStatement"
              value={formData.missionStatement}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Your professional mission..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Image URL
            </label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
            />
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

      {/* Certifications Section */}
      <motion.div
        id="certifications"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Certifications</h2>
          <button
            onClick={() => setShowCertModal(true)}
            className="flex items-center px-4 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors text-sm font-semibold"
          >
            <HiPlus className="mr-2" />
            Add Certification
          </button>
        </div>

        {formData.certifications && formData.certifications.length > 0 ? (
          <div className="space-y-3">
            {formData.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cert.issuer}
                  </p>
                  {cert.date && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {cert.date}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-navy-500 dark:text-aqua-500 hover:underline"
                    >
                      View Credential
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveCert(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No certifications added yet.
          </p>
        )}
      </motion.div>

      {/* Volunteering Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Volunteering</h2>
          <button
            onClick={() => setShowVolunteerModal(true)}
            className="flex items-center px-4 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors text-sm font-semibold"
          >
            <HiPlus className="mr-2" />
            Add Volunteering
          </button>
        </div>

        {formData.volunteering && formData.volunteering.length > 0 ? (
          <div className="space-y-3">
            {formData.volunteering.map((vol, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{vol.role}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {vol.organization}
                  </p>
                  {vol.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {vol.description}
                    </p>
                  )}
                  {vol.startDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {vol.startDate} - {vol.endDate || 'Present'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveVolunteer(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No volunteering experience added yet.
          </p>
        )}
      </motion.div>

      {/* Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Add Certification</h2>
              <button
                onClick={() => setShowCertModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) =>
                    setNewCert({ ...newCert, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issuer *</label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="text"
                  value={newCert.date}
                  onChange={(e) =>
                    setNewCert({ ...newCert, date: e.target.value })
                  }
                  placeholder="e.g., Jan 2024"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Credential URL
                </label>
                <input
                  type="text"
                  value={newCert.credentialUrl}
                  onChange={(e) =>
                    setNewCert({ ...newCert, credentialUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <button
                onClick={handleAddCert}
                className="w-full px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
              >
                Add Certification
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Volunteering Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Add Volunteering</h2>
              <button
                onClick={() => setShowVolunteerModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  value={newVolunteer.organization}
                  onChange={(e) =>
                    setNewVolunteer({
                      ...newVolunteer,
                      organization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <input
                  type="text"
                  value={newVolunteer.role}
                  onChange={(e) =>
                    setNewVolunteer({ ...newVolunteer, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newVolunteer.description}
                  onChange={(e) =>
                    setNewVolunteer({
                      ...newVolunteer,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={newVolunteer.startDate}
                    onChange={(e) =>
                      setNewVolunteer({
                        ...newVolunteer,
                        startDate: e.target.value,
                      })
                    }
                    placeholder="Jan 2023"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={newVolunteer.endDate}
                    onChange={(e) =>
                      setNewVolunteer({
                        ...newVolunteer,
                        endDate: e.target.value,
                      })
                    }
                    placeholder="Present"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <button
                onClick={handleAddVolunteer}
                className="w-full px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
              >
                Add Volunteering
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageAbout;
