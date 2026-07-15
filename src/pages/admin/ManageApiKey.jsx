import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiKey,
  HiLockClosed,
  HiOutlineExclamation,
  HiRefresh,
  HiShieldCheck,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Loading from '../../components/Loading';

const formatDateTime = (date) => {
  if (!date) return 'Not saved in database yet';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

const ManageApiKey = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({
    configured: false,
    source: '',
    maskedValue: '',
    modelName: '',
    modelSource: '',
    updatedAt: null,
  });
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api-keys/groq', { cache: false });
      const nextStatus = response.data.data || status;
      setStatus(nextStatus);
      setModelName(nextStatus.modelName || 'openai/gpt-oss-20b');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load API key status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanKey = apiKey.trim();
    const cleanModelName = modelName.trim();

    if (!cleanKey && !cleanModelName) {
      toast.error('Please enter a Groq API key or model name');
      return;
    }

    if (cleanKey.length < 20) {
      toast.error('API key looks too short');
      return;
    }

    try {
      setSaving(true);
      const response = await api.put('/api-keys/groq', {
        apiKey: cleanKey,
        modelName: cleanModelName,
      });
      setStatus(response.data.data);
      setModelName(response.data.data?.modelName || cleanModelName);
      setApiKey('');
      toast.success('Groq chatbot settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update API key');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Key</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage the Groq API key used by the public portfolio chatbot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HiKey className="text-navy-500 dark:text-aqua-400" />
                Groq Chatbot Key
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Saving a new key replaces the old database key. The full key is
                never shown again after saving.
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Saving a new model name replaces the old database model name.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchStatus}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900 transition-colors text-sm font-semibold"
            >
              <HiRefresh />
              Refresh
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                    status.configured
                      ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300'
                  }`}
                >
                  {status.configured ? (
                    <HiCheckCircle size={24} />
                  ) : (
                    <HiOutlineExclamation size={24} />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {status.configured ? 'Groq key is configured' : 'No Groq key configured'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Source:{' '}
                    <span className="font-semibold capitalize">
                      {status.source || 'none'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last database update: {formatDateTime(status.updatedAt)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Model source:{' '}
                    <span className="font-semibold capitalize">
                      {status.modelSource || 'default'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg bg-white px-4 py-3 font-mono text-sm text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100">
                  {status.maskedValue || 'No key saved'}
                </div>
                <div className="rounded-lg bg-white px-4 py-3 font-mono text-sm text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100">
                  {status.modelName || 'openai/gpt-oss-20b'}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="groq-api-key"
                className="block text-sm font-medium mb-2"
              >
                New Groq API Key
              </label>
              <input
                id="groq-api-key"
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste your new Groq API key"
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                The old database key will be overwritten and duplicate old key
                records will be deleted.
              </p>
            </div>

            <div>
              <label
                htmlFor="groq-model-name"
                className="block text-sm font-medium mb-2"
              >
                Model Name
              </label>
              <input
                id="groq-model-name"
                type="text"
                value={modelName}
                onChange={(event) => setModelName(event.target.value)}
                placeholder="openai/gpt-oss-20b"
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy-500 dark:focus:ring-aqua-500 bg-white dark:bg-gray-900"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Example: openai/gpt-oss-20b. If this model is unavailable for
                your Groq account, the backend can still auto-pick an available
                chat model.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || (!apiKey.trim() && !modelName.trim())}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-500 text-white rounded-lg hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiLockClosed />
              {saving ? 'Saving Securely...' : 'Save Groq Settings'}
            </button>
          </form>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-gradient-to-br from-navy-600 to-aqua-500 text-white rounded-xl shadow-lg p-6"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 mb-5">
            <HiShieldCheck size={26} />
          </div>
          <h3 className="text-xl font-bold mb-3">Security Note</h3>
          <p className="text-white/85 text-sm leading-6">
            The frontend never receives the real API key. The backend encrypts
            it before storing it and only shows a masked preview here.
          </p>
          <div className="mt-6 rounded-xl bg-white/12 p-4 text-sm text-white/85">
            After changing the key or model, the chatbot starts using the latest
            saved database settings automatically.
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default ManageApiKey;
