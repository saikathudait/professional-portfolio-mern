import { ClipLoader } from 'react-spinners';

const Loading = ({ size = 50, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <ClipLoader color="#0073ff" size={size} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <ClipLoader color="#0073ff" size={size} />
    </div>
  );
};

export default Loading;