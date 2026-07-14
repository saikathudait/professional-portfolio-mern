// Format date
export const formatDate = (date) => {
  if (!date) return 'Date unavailable';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return parsedDate.toLocaleDateString('en-US', options);
};

// Truncate text
export const truncateText = (text, maxLength = 150) => {
  const value = text || '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

// Get reading time
export const getReadingTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(readingTime, 1)} min read`;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Smooth scroll to element
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Get unique values from array
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map((item) => item[key]))];
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};
