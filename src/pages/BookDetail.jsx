import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import {
  FaAmazon,
  FaBookOpen,
  FaExternalLinkAlt,
  FaGlobe,
} from 'react-icons/fa';
import { SiFlipkart } from 'react-icons/si';
import api from '../utils/api';
import Loading from '../components/Loading';

const platformMap = {
  Amazon: {
    label: 'Amazon',
    icon: FaAmazon,
    badgeClass: 'book-detail-platform--amazon',
    buttonClass: 'book-detail-link--amazon',
  },
  Flipkart: {
    label: 'Flipkart',
    icon: SiFlipkart,
    badgeClass: 'book-detail-platform--flipkart',
    buttonClass: 'book-detail-link--flipkart',
  },
  Other: {
    label: 'Website',
    icon: FaGlobe,
    badgeClass: 'book-detail-platform--other',
    buttonClass: 'book-detail-link--other',
  },
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <Loading fullScreen />;

  if (!book) {
    return (
      <div className="book-detail-page min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Book Not Found
          </h2>
          <p className="text-slate-300 mb-8">
            The book you are looking for is not available.
          </p>
          <Link to="/books" className="book-detail-back-link">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const config = platformMap[book.platform] || platformMap.Other;
  const PlatformIcon = config.icon;

  return (
    <div className="book-detail-page min-h-screen pt-16">
      <header className="book-detail-hero">
        <div className="book-detail-hero-spotlight" aria-hidden="true" />
        <div className="book-detail-hero-pattern" aria-hidden="true" />
        <div
          className="book-detail-hero-shape book-detail-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="book-detail-hero-shape book-detail-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="book-detail-hero-shape book-detail-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="book-detail-back"
          >
            <HiArrowLeft />
            Back to Books
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="book-detail-title"
          >
            {book.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="book-detail-subtitle"
          >
            {book.author ? `Author: ${book.author}` : 'Book details'}
          </motion.p>
          <span className={`book-detail-platform ${config.badgeClass}`}>
            <PlatformIcon size={16} />
            Available on {config.label}
          </span>
        </div>
        <svg
          className="book-detail-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0f172a"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </header>

      <section className="book-detail-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="book-detail-card">
            <div className="book-detail-media">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-detail-cover"
                />
              ) : (
                <div className="book-detail-placeholder">
                  <FaBookOpen />
                </div>
              )}
            </div>

            <div className="book-detail-info">
              <div className="book-detail-header">
                <h2>{book.title}</h2>
                {book.author && (
                  <p className="book-detail-author">
                    <span>Author:</span> {book.author}
                  </p>
                )}
              </div>

              <div className="book-detail-section">
                <h3>About this book</h3>
                <p>
                  {book.description ||
                    'No description is available for this book yet.'}
                </p>
              </div>

              <div className="book-detail-section">
                <h3>Where to get it</h3>
                <p>
                  You can purchase or preview this book using the platform
                  link below.
                </p>
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`book-detail-link ${config.buttonClass}`}
                >
                  Visit {config.label}
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDetail;
