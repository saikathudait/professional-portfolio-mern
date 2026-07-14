import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiChartBar,
  HiClock,
  HiEye,
  HiRefresh,
  HiTrendingUp,
  HiUsers,
} from 'react-icons/hi';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
};

const getToday = () => toDateInputValue(new Date());

const formatNumber = (value = 0) => new Intl.NumberFormat('en-US').format(value);

const formatDate = (date) => {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getPageLabel = (path = '/') => {
  const cleanPath = path.split('?')[0] || '/';
  if (cleanPath === '/') return 'Home';
  return cleanPath
    .split('/')
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    )
    .join(' / ');
};

const presets = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => ({ startDate: getToday(), endDate: getToday() }),
  },
  {
    label: 'Last 7 Days',
    value: '7days',
    getRange: () => ({ startDate: getDateDaysAgo(6), endDate: getToday() }),
  },
  {
    label: 'Last 30 Days',
    value: '30days',
    getRange: () => ({ startDate: getDateDaysAgo(29), endDate: getToday() }),
  },
  {
    label: 'All Time',
    value: 'all',
    getRange: () => ({ startDate: '', endDate: '' }),
  },
];

const ManageAnalysis = () => {
  const initialFilters = useMemo(() => presets[2].getRange(), []);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('30days');
  const [filters, setFilters] = useState(initialFilters);

  const fetchAnalysis = useCallback(async (nextFilters) => {
    try {
      setFetching(true);
      const response = await api.get('/analytics/analysis', {
        cache: false,
        params: {
          startDate: nextFilters.startDate || undefined,
          endDate: nextFilters.endDate || undefined,
        },
      });
      setAnalysis(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load analysis data'
      );
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis(initialFilters);
  }, [fetchAnalysis, initialFilters]);

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset.value);
    const nextFilters = preset.getRange();
    setFilters(nextFilters);
    fetchAnalysis(nextFilters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedPreset('custom');
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAnalysis(filters);
  };

  const maxDailyViews = useMemo(() => {
    const views = analysis?.dailyViews || [];
    return Math.max(...views.map((day) => day.pageViews || 0), 1);
  }, [analysis?.dailyViews]);

  if (loading) return <Loading fullScreen />;

  const stats = analysis?.stats || {};
  const topPages = analysis?.topPages || [];
  const dailyViews = analysis?.dailyViews || [];

  const statCards = [
    {
      label: 'Total Website Views',
      value: formatNumber(stats.totalPageViews || 0),
      detail: 'All page visits in selected date range',
      icon: HiEye,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Unique Visitors',
      value: formatNumber(stats.totalUniqueVisitors || 0),
      detail: 'Unique users based on stored visitor IDs',
      icon: HiUsers,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Tracked Days',
      value: formatNumber(stats.trackedDays || 0),
      detail: 'Days with analytics data in database',
      icon: HiCalendar,
      color: 'from-violet-500 to-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track website visitors, unique views, and the top pages users visit.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAnalysis(filters)}
          disabled={fetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <HiRefresh className={fetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-white p-5 shadow-lg dark:bg-gray-800"
      >
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-[1fr_auto]"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetChange(preset)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedPreset === preset.value
                      ? 'bg-navy-500 text-white dark:bg-aqua-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Start Date
                </span>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-aqua-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  End Date
                </span>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-aqua-500"
                />
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={fetching}
              className="w-full rounded-lg bg-navy-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-600 disabled:opacity-50 dark:bg-aqua-500 dark:hover:bg-aqua-600 lg:w-auto"
            >
              {fetching ? 'Loading...' : 'Apply Filter'}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {stat.detail}
                </p>
              </div>
              <span
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                <stat.icon size={28} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Top 5 Pages</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Most viewed public pages in the selected range.
              </p>
            </div>
            <HiTrendingUp className="text-navy-500 dark:text-aqua-400" size={28} />
          </div>

          {topPages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No page-level data yet. New visits will start appearing after this update is deployed.
            </div>
          ) : (
            <div className="space-y-4">
              {topPages.map((page, index) => {
                const percent =
                  stats.totalPageViews > 0
                    ? Math.round((page.pageViews / stats.totalPageViews) * 100)
                    : 0;
                return (
                  <div
                    key={page.path}
                    className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-500 text-xs font-bold text-white dark:bg-aqua-500">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold">
                            {getPageLabel(page.path)}
                          </h3>
                        </div>
                        <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                          {page.path}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatNumber(page.pageViews)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNumber(page.uniqueVisitors)} unique
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-navy-500 to-aqua-500"
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Date Wise Views</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily visits fetched from analytics records.
              </p>
            </div>
            <HiChartBar className="text-navy-500 dark:text-aqua-400" size={28} />
          </div>

          {dailyViews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No analytics data found for this date range.
            </div>
          ) : (
            <div className="space-y-3">
              {dailyViews.map((day) => {
                const width = Math.max(
                  Math.round(((day.pageViews || 0) / maxDailyViews) * 100),
                  day.pageViews > 0 ? 5 : 0
                );
                return (
                  <div
                    key={day.date}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <HiClock className="text-gray-400" />
                        <span className="font-semibold">
                          {formatDate(day.date)}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(day.pageViews)}
                        </span>{' '}
                        views · {formatNumber(day.uniqueVisitors)} unique
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ManageAnalysis;
