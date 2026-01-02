import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const updateFavicon = (href) => {
  if (!href || typeof document === 'undefined') return;
  const head = document.head || document.getElementsByTagName('head')[0];
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  });
};

const createCircularFavicon = (src, size = 128) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const scale = Math.max(size / img.width, size / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const dx = (size - drawWidth) / 2;
      const dy = (size - drawHeight) / 2;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      ctx.restore();

      try {
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load favicon image'));
    img.src = src;
  });

const FaviconUpdater = () => {
  const { user } = useAuth();
  const [favicon, setFavicon] = useState('');

  useEffect(() => {
    if (user?.profileImage) {
      setFavicon(user.profileImage);
    }
  }, [user?.profileImage]);

  useEffect(() => {
    let isActive = true;

    const fetchFavicon = async () => {
      if (user?.profileImage) return;
      try {
        const response = await api.get('/about', {
          params: { includeOwnerImage: true },
        });
        const data = response.data?.data;
        const image =
          data?.profileImage || data?.ownerProfileImage || '';
        if (isActive && image) {
          setFavicon(image);
        }
      } catch (error) {
        // Ignore favicon fetch errors
      }
    };

    fetchFavicon();

    return () => {
      isActive = false;
    };
  }, [user?.profileImage]);

  useEffect(() => {
    if (!favicon) return;
    let isActive = true;

    const applyFavicon = async () => {
      try {
        const rounded = await createCircularFavicon(favicon);
        if (isActive) {
          updateFavicon(rounded);
        }
      } catch (error) {
        if (isActive) {
          updateFavicon(favicon);
        }
      }
    };

    applyFavicon();

    return () => {
      isActive = false;
    };
  }, [favicon]);

  return null;
};

export default FaviconUpdater;
