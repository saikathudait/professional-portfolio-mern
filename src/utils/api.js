import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const CACHE_TTL_MS = 30000;
const PERSIST_TTL_MS = 1000 * 60 * 60 * 24;
const LOCAL_CACHE_PREFIX = 'api_cache_v1:';
const LOCAL_CACHE_INDEX = 'api_cache_index_v1';
const MAX_RETRY = 2;
const responseCache = new Map();

const getCacheKey = (config) => {
  const base = config.baseURL || '';
  const url = config.url || '';
  const params = config.params || {};
  const headers = config.headers || {};
  const auth = headers.Authorization || '';
  const paramsKey = JSON.stringify(
    Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {})
  );
  return `${base}${url}?${paramsKey}|${auth}`;
};

const getLocalCacheKey = (config) =>
  `${LOCAL_CACHE_PREFIX}${config.metadata?.cacheKey || getCacheKey(config)}`;

const readLocalCache = (config) => {
  try {
    const key = getLocalCacheKey(config);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !('data' in parsed)) return null;
    if (Date.now() - parsed.timestamp > PERSIST_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeLocalCache = (config, response) => {
  try {
    const key = getLocalCacheKey(config);
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), data: response.data })
    );
    const existing = localStorage.getItem(LOCAL_CACHE_INDEX);
    const index = existing ? JSON.parse(existing) : [];
    if (Array.isArray(index) && !index.includes(key)) {
      index.push(key);
      localStorage.setItem(LOCAL_CACHE_INDEX, JSON.stringify(index));
    }
  } catch {
    // Ignore cache write errors
  }
};

const clearLocalCache = () => {
  try {
    const existing = localStorage.getItem(LOCAL_CACHE_INDEX);
    if (!existing) return;
    const index = JSON.parse(existing);
    if (Array.isArray(index)) {
      index.forEach((key) => localStorage.removeItem(key));
    }
    localStorage.removeItem(LOCAL_CACHE_INDEX);
  } catch {
    // Ignore cache clear errors
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const useCache = config.method === 'get' && config.cache !== false;
    if (useCache) {
      const key = getCacheKey(config);
      const cached = responseCache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        config.adapter = () =>
          Promise.resolve({
            data: cached.data,
            status: cached.status,
            statusText: cached.statusText,
            headers: cached.headers,
            config,
            request: {},
          });
      }
      config.metadata = { cacheKey: key };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method;
    if (method === 'get' && response.config.cache !== false) {
      const key =
        response.config.metadata?.cacheKey || getCacheKey(response.config);
      responseCache.set(key, {
        timestamp: Date.now(),
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      writeLocalCache(response.config, response);
    } else if (method && method !== 'get') {
      responseCache.clear();
      clearLocalCache();
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    const config = error.config || {};
    const shouldRetry =
      !status || status >= 500 || status === 429 || status === 408;
    if (
      config.method === 'get' &&
      config.retry !== false &&
      shouldRetry
    ) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < MAX_RETRY) {
        config.__retryCount += 1;
        const delay = 400 * 2 ** (config.__retryCount - 1);
        await sleep(delay);
        return api(config);
      }
    }

    if (
      config.method === 'get' &&
      config.cache !== false &&
      shouldRetry
    ) {
      const cachedData = readLocalCache(config);
      if (cachedData) {
        return Promise.resolve({
          data: cachedData,
          status: 200,
          statusText: 'OK',
          headers: { 'x-cache': 'fallback' },
          config,
          request: {},
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
