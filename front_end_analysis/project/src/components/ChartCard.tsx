import { useState } from 'react';
import { Info, X } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

const ChartCard = ({ title, children, description }: ChartCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <button
              onClick={() => setShowModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Learn More"
            >
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          )}
        </div>
        <div className="h-80">{children}</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChartCard;
