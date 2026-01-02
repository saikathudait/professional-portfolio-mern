import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAmazon, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';
import { SiFlipkart } from 'react-icons/si';
import api from '../utils/api';
import Loading from '../components/Loading';

const PAGE_SIZE = 10;

const platformMap = {
  Amazon: {
    label: 'Amazon',
    icon: FaAmazon,
    className: 'books-table-platform--amazon',
  },
  Flipkart: {
    label: 'Flipkart',
    icon: SiFlipkart,
    className: 'books-table-platform--flipkart',
  },
  Other: {
    label: 'Website',
    icon: FaGlobe,
    className: 'books-table-platform--other',
  },
};

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedBooks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return books.slice(start, start + PAGE_SIZE);
  }, [books, page]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="books-table-page min-h-screen pt-16">
      <header className="books-table-hero">
        <div className="books-table-hero-spotlight" aria-hidden="true" />
        <div className="books-table-hero-pattern" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="books-table-title"
          >
            All Books
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="books-table-subtitle"
          >
            Browse every book with platform details and quick links.
          </motion.p>
        </div>
        <svg
          className="books-table-hero-wave"
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

      <section className="books-table-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="books-table-card">
            <div className="books-table-header">
              <div>
                <h2>Books Table</h2>
                <p>
                  All book entries are pulled directly from the database.
                </p>
              </div>
              <span className="books-table-count">
                {books.length} total
              </span>
            </div>

            {books.length === 0 ? (
              <div className="books-table-empty">
                <p>No books are available yet.</p>
                <Link to="/books" className="books-table-back-link">
                  Back to Books
                </Link>
              </div>
            ) : (
              <>
                <div className="books-table-wrapper">
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>SL No</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Available at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBooks.map((book, index) => {
                        const config =
                          platformMap[book.platform] || platformMap.Other;
                        const PlatformIcon = config.icon;
                        const serial =
                          (page - 1) * PAGE_SIZE + index + 1;

                        return (
                          <tr key={book._id}>
                            <td>{serial}</td>
                            <td>
                              <Link
                                to={`/books/${book._id}`}
                                className="books-table-title-link"
                              >
                                {book.title}
                              </Link>
                            </td>
                            <td>{book.author || '-'}</td>
                            <td>
                              <a
                                href={book.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`books-table-platform ${config.className}`}
                              >
                                <PlatformIcon size={14} />
                                {config.label}
                                <FaExternalLinkAlt size={12} />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="books-table-footer">
                  <div className="books-table-total">
                    Total rows: {books.length}
                  </div>
                  <div className="books-pagination">
                    <button
                      type="button"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        type="button"
                        onClick={() => goToPage(i + 1)}
                        className={page === i + 1 ? 'is-active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BooksTable;
