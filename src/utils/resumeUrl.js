import api from './api';

const getApiAssetOrigin = () => {
  const baseUrl = api.defaults.baseURL || '';
  const fallbackOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

  try {
    return new URL(baseUrl, fallbackOrigin).origin;
  } catch {
    return '';
  }
};

const getUploadPath = (value = '') => {
  const normalized = value.replace(/\\/g, '/');
  const match = normalized.match(/^\/?(?:api\/)?uploads\/(.+)$/);
  return match ? `/uploads/${match[1]}` : '';
};

const getResumeApiPath = (value = '') => {
  const normalized = value.replace(/\\/g, '/');
  return /^\/?api\/home\/cv\/file$/.test(normalized)
    ? '/api/home/cv/file'
    : '';
};

export const normalizeResumeAssetUrl = (url) => {
  if (!url) return '';

  const directResumeApiPath = getResumeApiPath(url);
  if (directResumeApiPath) {
    const origin = getApiAssetOrigin();
    return origin ? `${origin}${directResumeApiPath}` : directResumeApiPath;
  }

  const directUploadPath = getUploadPath(url);
  if (directUploadPath) {
    const origin = getApiAssetOrigin();
    return origin ? `${origin}${directUploadPath}` : directUploadPath;
  }

  try {
    const fallbackOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost';
    const parsedUrl = new URL(url, fallbackOrigin);
    const resumeApiPath = getResumeApiPath(parsedUrl.pathname);
    const uploadPath = getUploadPath(parsedUrl.pathname);

    if (!resumeApiPath && !uploadPath) {
      return url;
    }

    const isAbsoluteUrl = /^[a-z][a-z\d+\-.]*:/i.test(url);
    const origin = isAbsoluteUrl
      ? parsedUrl.origin
      : getApiAssetOrigin() || parsedUrl.origin;

    return `${origin}${resumeApiPath || uploadPath}`;
  } catch {
    return url;
  }
};
