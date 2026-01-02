import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const ManageResume = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/home');
        setCurrentUrl(response.data.data?.cvLink || '');
      } catch (error) {
        toast.error('Failed to load resume info');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Only PDF files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const response = await api.post('/home/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const nextUrl = response.data.url || response.data.data?.cvLink || '';
      setCurrentUrl(nextUrl);
      setSelectedFile(null);
      setInputKey(Date.now());
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload CV</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload the latest resume to display on the homepage.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current resume:
          </p>
          {currentUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 break-all">
                {currentUrl}
              </span>
              <div className="flex gap-3">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-navy-500 text-navy-600 rounded-lg hover:bg-navy-500 hover:text-white dark:border-aqua-500 dark:text-aqua-400 dark:hover:bg-aqua-500 dark:hover:text-white transition-colors text-sm font-semibold"
                >
                  View
                </a>
                <a
                  href={currentUrl}
                  download
                  className="px-4 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors text-sm font-semibold"
                >
                  Download
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No resume uploaded yet.
            </p>
          )}
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload PDF
            </label>
            <input
              key={inputKey}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ManageResume;
