import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiDocumentText,
  HiOutlinePencilAlt,
  HiOutlineRefresh,
  HiOutlineTrash,
} from 'react-icons/hi';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const MAX_COVER_LETTER_LENGTH = 12000;

const defaultFormData = {
  title: 'Cover Letter',
  content: '',
};

const formatDate = (date) => {
  if (!date) return 'Not saved yet';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not saved yet';
  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const ManageCoverLetter = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const wordCount = useMemo(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [formData.content]);

  const previewParagraphs = useMemo(
    () =>
      formData.content
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    [formData.content]
  );

  const loadCoverLetter = async () => {
    try {
      const response = await api.get('/cover-letter', { cache: false });
      const coverLetter = response.data.data;
      if (coverLetter?.content) {
        setFormData({
          title: coverLetter.title || 'Cover Letter',
          content: coverLetter.content || '',
        });
        setLastUpdated(coverLetter.updatedAt || coverLetter.createdAt || '');
      } else {
        setFormData(defaultFormData);
        setLastUpdated('');
      }
    } catch (error) {
      toast.error('Failed to load cover letter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoverLetter();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.content.trim()) {
      toast.error('Please write the cover letter text first.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.put('/cover-letter', {
        title: formData.title.trim() || 'Cover Letter',
        content: formData.content.trim(),
      });
      const coverLetter = response.data.data;
      setFormData({
        title: coverLetter.title || 'Cover Letter',
        content: coverLetter.content || '',
      });
      setLastUpdated(coverLetter.updatedAt || coverLetter.createdAt || '');
      toast.success('Cover letter updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update cover letter'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.content.trim() || deleting) return;

    try {
      setDeleting(true);
      await api.delete('/cover-letter');
      setFormData(defaultFormData);
      setLastUpdated('');
      toast.success('Cover letter deleted successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete cover letter'
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cover Letter Manage</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write the latest cover letter shown on the public resume page.
            Saving a new letter automatically removes older records.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCoverLetter}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <HiOutlineRefresh />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-aqua-500/10 dark:text-aqua-400">
                <HiOutlinePencilAlt size={24} />
              </span>
              <div>
                <h2 className="text-xl font-bold">Letter Editor</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatDate(lastUpdated)}
                </p>
              </div>
            </div>
            {lastUpdated && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <HiCheckCircle />
                Live on resume page
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Section Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                placeholder="Cover Letter"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-aqua-500"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium">
                  Cover Letter Text *
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.content.length}/{MAX_COVER_LETTER_LENGTH} chars
                </span>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="18"
                maxLength={MAX_COVER_LETTER_LENGTH}
                placeholder={`Dear Hiring Manager,\n\nI am excited to apply for data analyst and AI/ML focused opportunities...\n\nSincerely,\nSaikat Hudait`}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 leading-relaxed focus:ring-2 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-aqua-500"
              />
            </div>

            <div className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400 sm:grid-cols-3">
              <div>
                <span className="block font-semibold text-gray-900 dark:text-white">
                  {wordCount}
                </span>
                Words
              </div>
              <div>
                <span className="block font-semibold text-gray-900 dark:text-white">
                  {previewParagraphs.length}
                </span>
                Paragraphs
              </div>
              <div>
                <span className="block font-semibold text-gray-900 dark:text-white">
                  Latest only
                </span>
                Storage mode
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-navy-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-aqua-500 dark:hover:bg-aqua-600"
              >
                {submitting ? 'Saving...' : 'Save Latest Cover Letter'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || !formData.content.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <HiOutlineTrash />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-2xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20">
              <HiDocumentText size={24} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
                Public Preview
              </p>
              <h2 className="text-2xl font-bold">
                {formData.title || 'Cover Letter'}
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/8 p-5 shadow-inner">
            {previewParagraphs.length > 0 ? (
              <div className="space-y-4 text-sm leading-7 text-slate-200">
                {previewParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 20)}-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-slate-300">
                Your cover letter preview will appear here while you write.
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default ManageCoverLetter;
