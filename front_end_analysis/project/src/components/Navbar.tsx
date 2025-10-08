import { Moon, Sun, RefreshCw, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onRefresh: () => void;
  onDownload: () => void;
  isRefreshing: boolean;
}

const Navbar = ({ onRefresh, onDownload, isRefreshing }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const currentDate = new Date().toLocaleString('es-EC', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const navItems = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/charts', name: 'Análisis', icon: '📈' },
    { path: '/dynamic', name: 'Dinámico', icon: '⚡' },
    { path: '/graphics', name: 'Gráficos', icon: '📸' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Digital Illiteracy Insights 2025
              </h1>
            </Link>
            
            {/* Navigation Items */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
              {currentDate}
            </span>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>

            <button
              onClick={onDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download Report"
            >
              <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
