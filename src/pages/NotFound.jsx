import { Link } from 'react-router-dom';

const NotFound = ({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or may have moved.',
  linkTo = '/',
  linkLabel = 'Back to Home',
}) => {
  return (
    <div className="not-found-page min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="not-found-card max-w-xl w-full text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-10">
        <p className="not-found-kicker text-sm font-semibold uppercase tracking-[0.3em] text-navy-500 dark:text-aqua-400">
          404 Error
        </p>
        <h1 className="not-found-title mt-4 text-4xl font-bold">{title}</h1>
        <p className="not-found-message mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        <Link
          to={linkTo}
          className="not-found-link inline-flex items-center mt-8 px-6 py-3 bg-navy-500 text-white rounded-xl hover:bg-navy-600 dark:bg-aqua-500 dark:hover:bg-aqua-600 transition-colors font-semibold"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
