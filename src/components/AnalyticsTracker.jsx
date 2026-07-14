import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { getStoredValue, setStoredValue } from '../utils/storage';

const VISITOR_KEY = 'portfolio_visitor_id';
const LAST_TRACKED_KEY = 'portfolio_last_pageview_v1';

const createVisitorId = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getVisitorId = () => {
  const existing = getStoredValue(VISITOR_KEY);
  if (existing) {
    return existing;
  }

  const visitorId = createVisitorId();
  if (visitorId) {
    setStoredValue(VISITOR_KEY, visitorId);
  }
  return visitorId;
};

const AnalyticsTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      return;
    }

    const pageKey = `${pathname}${search}`;
    const visitorId = getVisitorId();

    try {
      const lastTracked = getStoredValue(LAST_TRACKED_KEY, { session: true });
      if (lastTracked) {
        const parsed = JSON.parse(lastTracked);
        if (
          parsed?.pageKey === pageKey &&
          Date.now() - (parsed.timestamp || 0) < 1500
        ) {
          return;
        }
      }
    } catch (error) {
      // Ignore session parsing issues
    }

    setStoredValue(
      LAST_TRACKED_KEY,
      JSON.stringify({ pageKey, timestamp: Date.now() }),
      { session: true }
    );

    api
      .post(
        '/analytics/pageview',
        { visitorId, path: pageKey },
        { retry: false, cache: false }
      )
      .catch(() => {
        // Ignore analytics failures
      });
  }, [pathname, search]);

  return null;
};

export default AnalyticsTracker;
