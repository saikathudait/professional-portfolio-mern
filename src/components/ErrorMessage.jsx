import { HiExclamationCircle } from 'react-icons/hi';

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <HiExclamationCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;