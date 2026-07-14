import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiDocumentText,
  HiEye,
  HiOutlineCloudUpload,
  HiOutlineDownload,
  HiOutlineExclamation,
  HiX,
} from 'react-icons/hi';
import api from '../../utils/api';
import { normalizeResumeAssetUrl } from '../../utils/resumeUrl';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${Math.max(bytes / 1024, 1).toFixed(0)} KB`;
};

const isPdfFile = (file) =>
  file &&
  (file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf'));

const ManageResume = () => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/home', { cache: false });
        setCurrentUrl(normalizeResumeAssetUrl(response.data.data?.cvLink || ''));
      } catch (error) {
        toast.error('Failed to load resume info');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!isPdfFile(file)) {
      toast.error('Please select a PDF file only.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`PDF must be ${MAX_FILE_SIZE_MB}MB or smaller.`);
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndSetFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please choose a PDF resume first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await api.post('/home/cv', formData, {
        cache: false,
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      const nextUrl = normalizeResumeAssetUrl(
        response.data.url || response.data.data?.cvLink || ''
      );
      setCurrentUrl(nextUrl);
      setSelectedFile(null);
      setUploadProgress(100);
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
          Upload a PDF resume that will appear on the public resume page.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current resume
          </p>
          {currentUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-600 dark:bg-aqua-500/10 dark:text-aqua-400">
                  <HiDocumentText size={22} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Resume PDF
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {currentUrl}
                  </p>
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-3">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-navy-500 text-navy-600 rounded-lg hover:bg-navy-500 hover:text-white dark:border-aqua-500 dark:text-aqua-400 dark:hover:bg-aqua-500 dark:hover:text-white transition-colors text-sm font-semibold"
                >
                  <HiEye />
                  View
                </a>
                <a
                  href={currentUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors text-sm font-semibold"
                >
                  <HiOutlineDownload />
                  Download
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-gray-500 dark:text-gray-400">
              <HiOutlineExclamation size={22} />
              No resume uploaded yet.
            </div>
          )}
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? 'border-navy-500 bg-navy-50 dark:border-aqua-500 dark:bg-aqua-500/10'
                : 'border-gray-300 bg-gray-50 hover:border-navy-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-aqua-500'
            }`}
          >
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-navy-600 dark:bg-aqua-500/10 dark:text-aqua-400">
              <HiOutlineCloudUpload size={30} />
            </span>
            <span className="mt-4 block text-lg font-semibold text-gray-900 dark:text-white">
              Choose PDF resume
            </span>
            <span className="mt-1 block text-sm text-gray-600 dark:text-gray-400">
              Drag and drop a PDF here, or click to browse. Max {MAX_FILE_SIZE_MB}MB.
            </span>
          </label>

          {selectedFile && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    <HiCheckCircle size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white break-all">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(selectedFile.size)} PDF
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  disabled={uploading}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label="Remove selected file"
                >
                  <HiX size={20} />
                </button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-navy-500 transition-all dark:bg-aqua-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Resume PDF'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ManageResume;
