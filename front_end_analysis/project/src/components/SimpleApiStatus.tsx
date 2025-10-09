import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface SimpleApiStatusProps {
  apiUrl?: string;
}

const SimpleApiStatus: React.FC<SimpleApiStatusProps> = ({ 
  apiUrl = 'http://localhost:8000' 
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsConnected(response.ok);
    } catch (err) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Conectado</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <WifiOff className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Desconectado</span>
        </>
      )}
    </div>
  );
};

export default SimpleApiStatus;