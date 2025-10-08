import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FilterOption } from '../types';

interface SidebarProps {
  isOpen: boolean;
  provinces: FilterOption[];
  genders: FilterOption[];
  ageRanges: FilterOption[];
  onFilterChange: (column: string, value: string) => void;
}

const Sidebar = ({
  isOpen,
  provinces,
  genders,
  ageRanges,
  onFilterChange,
}: SidebarProps) => {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    if (value) onFilterChange('provincia', value);
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    if (value) onFilterChange('genero', value);
  };

  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
    if (value) onFilterChange('rango_edad', value);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard Principal' },
    { path: '/charts', icon: BarChart3, label: 'Análisis de Gráficas' },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full pt-20">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-3" />
              <span className="font-medium">Filtros</span>
            </div>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showFilters && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provincia
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {provinces.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Género
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rango de Edad
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {ageRanges.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
