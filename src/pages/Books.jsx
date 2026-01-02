import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    badgeClass: 'book-platform--amazon',
    buttonClass: 'book-link--amazon',
  },
  Flipkart: {
    label: 'Flipkart',
    icon: SiFlipkart,
    badgeClass: 'book-platform--flipkart',
    buttonClass: 'book-link--flipkart',
  },
  Other: {
    label: 'Website',
    icon: FaGlobe,
    badgeClass: 'book-platform--other',
    buttonClass: 'book-link--other',
  },
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <Loading fullScreen />;

  const latestBooks = [...books]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="books-page min-h-screen pt-16">
      <header className="books-hero">
        <div className="books-hero-spotlight" aria-hidden="true" />
        <div className="books-hero-pattern" aria-hidden="true" />
        <div
          className="books-hero-shape books-hero-shape-one"
          aria-hidden="true"
        />
        <div
          className="books-hero-shape books-hero-shape-two"
          aria-hidden="true"
        />
        <div
          className="books-hero-shape books-hero-shape-three"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="books-hero-title"
          >
            Books
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="books-hero-subtitle"
          >
            A curated reading list that shapes my work and mindset.
          </motion.p>
        </div>
        <svg
          className="books-hero-wave"
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

      <section className="books-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="books-header">
            <div>
              <h2>All Books</h2>
              <p>Discover the books I recommend and keep revisiting.</p>
            </div>
            <span className="books-count">{books.length} titles</span>
          </div>

          {books.length === 0 ? (
            <div className="books-empty">
              <FaBookOpen size={32} />
              <p>No books are available yet.</p>
            </div>
          ) : (
            <div className="books-grid books-grid--summary">
              {latestBooks.map((book, index) => {
                const config =
                  platformMap[book.platform] || platformMap.Other;
                const PlatformIcon = config.icon;
                const description = book.description?.trim() || '';
                const descriptionWords = description
                  ? description.split(/\s+/)
                  : [];
                const isTruncated = descriptionWords.length > 10;
                const displayedDescription = isTruncated
                  ? `${descriptionWords.slice(0, 10).join(' ')}...`
                  : description;

                return (
                  <motion.article
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="book-card"
                  >
                    <div className="book-card-inner">
                      <div className="book-cover">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="book-cover-img"
                          />
                        ) : (
                          <div className="book-cover-placeholder">
                            <FaBookOpen />
                          </div>
                        )}
                        <span className={`book-platform ${config.badgeClass}`}>
                          <PlatformIcon size={14} />
                          {config.label}
                        </span>
                      </div>

                      <div className="book-details">
                        <div>
                          <h3>{book.title}</h3>
                          {book.author && (
                            <p className="book-author">
                              <span className="book-author-label">Author:</span>
                              {book.author}
                            </p>
                          )}
                        </div>
                        {description && (
                          <div className="book-description-block">
                            <p className="book-description">
                              {displayedDescription}
                            </p>
                            {isTruncated && (
                              <Link
                                to={`/books/${book._id}`}
                                className="book-read-more"
                              >
                                Read more
                              </Link>
                            )}
                          </div>
                        )}
                        <div className="book-actions">
                          <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`book-link ${config.buttonClass}`}
                          >
                            View on {config.label}
                            <FaExternalLinkAlt />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              <Link to="/books/all" className="book-card book-card--see-more">
                <div className="book-card-inner book-card-inner--cta">
                  <div className="book-see-more-icon">
                    <FaBookOpen />
                  </div>
                  <h3>See more books</h3>
                  <p>Browse the complete list in a detailed table.</p>
                  <span className="book-see-more-button">
                    View all books
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Books;
