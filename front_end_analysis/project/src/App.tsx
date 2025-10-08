import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChartsAnalysis from './components/ChartsAnalysis';
import DynamicDashboard from './components/DynamicDashboardClean';
import GraphicsViewer from './components/GraphicsViewer';
import { fetchData } from './utils/api';
import { FilterOption } from './types';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadFilterOptions();
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadFilterOptions = async () => {
    try {
      const rawData = await fetchData();
      setData(rawData);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const provinces = useMemo<FilterOption[]>(() => {
    const uniqueProvinces = [...new Set(data.map((d) => d.Provincia || d.provincia))].filter(Boolean);
    return uniqueProvinces.map((p) => ({ value: p as string, label: p as string }));
  }, [data]);

  const genders = useMemo<FilterOption[]>(() => {
    const uniqueGenders = [...new Set(data.map((d) => d.Genero || d.genero))].filter(Boolean);
    return uniqueGenders.map((g) => ({ value: g as string, label: g as string }));
  }, [data]);

  const ageRanges = useMemo<FilterOption[]>(() => {
    const uniqueAges = [...new Set(data.map((d) => d.RangoEdad || d.rango_edad))].filter(Boolean);
    return uniqueAges.map((a) => ({ value: a as string, label: a as string }));
  }, [data]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadFilterOptions();
      setRefreshKey((prev) => prev + 1);
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `report_${timestamp}.json`;
    const dataStr = JSON.stringify({ data, timestamp: new Date().toISOString() }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Reporte descargado: ${filename}`);
  };

  const handleFilterChange = (column: string, value: string) => {
    toast.info(`Filtro aplicado: ${column} = ${value}`);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <Navbar
            onRefresh={handleRefresh}
            onDownload={handleDownload}
            isRefreshing={isRefreshing}
          />

          <div className="flex">
            <Sidebar
              isOpen={isSidebarOpen}
              provinces={provinces}
              genders={genders}
              ageRanges={ageRanges}
              onFilterChange={handleFilterChange}
            />

            <main className="flex-1 p-6 lg:ml-0">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard key={refreshKey} />} />
                  <Route path="/charts" element={<ChartsAnalysis key={refreshKey} />} />
                  <Route path="/dynamic" element={<DynamicDashboard key={refreshKey} />} />
                  <Route path="/graphics" element={<GraphicsViewer key={refreshKey} />} />
                </Routes>
              </div>
            </main>
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
