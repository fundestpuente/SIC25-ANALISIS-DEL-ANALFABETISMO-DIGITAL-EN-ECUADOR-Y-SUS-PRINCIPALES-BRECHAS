import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface ApiStatusProps {
  apiUrl?: string;
}

interface ApiHealth {
  status: string;
  message: string;
  cors: string;
  data_count: number;
  timestamp: string;
}

const ApiStatusChecker: React.FC<ApiStatusProps> = ({ 
  apiUrl = 'http://localhost:8000' 
}) => {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const healthData: ApiHealth = await response.json();
      setHealth(healthData);
      setLastCheck(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      
      // Mostrar mensajes específicos según el tipo de error
      if (errorMsg.includes('fetch')) {
        toast.error('No se puede conectar con la API. ¿Está corriendo en http://localhost:8000?');
      } else if (errorMsg.includes('CORS')) {
        toast.error('Error de CORS. Reinicia la API con el archivo RESTART_API.bat');
      } else {
        toast.error(`Error de API: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, [apiUrl]);

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (error) return 'bg-red-100 border-red-300 text-red-800';
    if (health?.status === 'healthy') return 'bg-green-100 border-green-300 text-green-800';
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getStatusIcon = () => {
    if (loading) return '⏳';
    if (error) return '❌';
    if (health?.status === 'healthy') return '✅';
    return '❓';
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center">
          <span className="mr-2">{getStatusIcon()}</span>
          Estado de la API
        </h3>
        <button
          onClick={checkApiHealth}
          disabled={loading}
          className="px-2 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </div>

      {loading && (
        <p className="text-sm">Verificando conexión con la API...</p>
      )}

      {error && (
        <div className="text-sm space-y-2">
          <p><strong>Error:</strong> {error}</p>
          <div className="bg-white bg-opacity-50 rounded p-2">
            <p className="font-medium">Posibles soluciones:</p>
            <ul className="text-xs space-y-1 mt-1">
              <li>• Verifica que la API esté corriendo en {apiUrl}</li>
              <li>• Ejecuta el archivo <code>RESTART_API.bat</code></li>
              <li>• Revisa la consola de la API por errores</li>
              <li>• Asegúrate de que Python y las dependencias estén instaladas</li>
            </ul>
          </div>
        </div>
      )}

      {health && (
        <div className="text-sm space-y-1">
          <p><strong>Estado:</strong> {health.status}</p>
          <p><strong>Mensaje:</strong> {health.message}</p>
          <p><strong>CORS:</strong> {health.cors}</p>
          <p><strong>Registros:</strong> {health.data_count.toLocaleString()}</p>
          {lastCheck && (
            <p><strong>Última verificación:</strong> {lastCheck.toLocaleTimeString()}</p>
          )}
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-current border-opacity-30">
        <div className="flex justify-between items-center text-xs">
          <span>API URL: {apiUrl}</span>
          <a 
            href={`${apiUrl}/docs`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Ver Documentación
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusChecker;