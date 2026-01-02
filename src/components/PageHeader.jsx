import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, gradient = true }) => {
  return (
    <div
      className={`py-20 ${
        gradient ? 'gradient-animation' : 'bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl md:text-5xl font-bold mb-4 ${
            gradient ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-lg md:text-xl ${
              gradient
                ? 'text-white/90'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;