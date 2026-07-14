const getStorage = (type = 'local') => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return type === 'session' ? window.sessionStorage : window.localStorage;
  } catch (error) {
    return null;
  }
};

export const getStoredValue = (key, options = {}) => {
  const storage = getStorage(options.session ? 'session' : 'local');
  return storage ? storage.getItem(key) : null;
};

export const setStoredValue = (key, value, options = {}) => {
  const storage = getStorage(options.session ? 'session' : 'local');
  if (storage) {
    storage.setItem(key, value);
  }
};

export const removeStoredValue = (key, options = {}) => {
  const storage = getStorage(options.session ? 'session' : 'local');
  if (storage) {
    storage.removeItem(key);
  }
};

export const getStoredJson = (key, fallback = null, options = {}) => {
  const value = getStoredValue(key, options);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};
