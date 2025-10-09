import React, { useState } from 'react';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  data: DataItem[];
  title?: string;
  colorScheme?: 'blue' | 'green' | 'purple';
}

const DistributionChart: React.FC<DistributionChartProps> = ({ 
  data, 
  title = "Distribución",
  colorScheme = 'blue'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const getColorScheme = (scheme: string, isHovered: boolean = false) => {
    const intensity = isHovered ? 'saturate-150 brightness-110' : '';
    switch (scheme) {
      case 'blue':
        return {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          light: '#EFF6FF',
          gradient: `from-blue-400 via-blue-500 to-blue-600 ${intensity}`,
          shadow: 'shadow-blue-200'
        };
      case 'green':
        return {
          primary: '#10B981',
          secondary: '#047857',
          light: '#ECFDF5',
          gradient: `from-emerald-400 via-emerald-500 to-emerald-600 ${intensity}`,
          shadow: 'shadow-green-200'
        };
      case 'purple':
        return {
          primary: '#8B5CF6',
          secondary: '#7C3AED',
          light: '#FAF5FF',
          gradient: `from-purple-400 via-purple-500 to-purple-600 ${intensity}`,
          shadow: 'shadow-purple-200'
        };
      default:
        return {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          light: '#EFF6FF',
          gradient: `from-blue-400 via-blue-500 to-blue-600 ${intensity}`,
          shadow: 'shadow-blue-200'
        };
    }
  };

  return (
    <div className="w-full h-full p-2">
      <div className="flex flex-col space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const colors = getColorScheme(colorScheme, hoveredIndex === index);
          const isHovered = hoveredIndex === index;
          
          return (
            <div 
              key={index} 
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-300 ${isHovered ? 'scale-125 shadow-lg' : ''}`}
                  />
                  <span className={`font-semibold transition-colors duration-300 ${isHovered ? 'text-gray-900' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`font-bold transition-all duration-300 ${isHovered ? 'text-lg scale-110' : 'text-base'}`} style={{ color: colors.primary }}>
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Enhanced Bar */}
              <div className="relative">
                <div className={`bg-gray-100 rounded-full h-3 overflow-hidden transition-all duration-300 ${isHovered ? 'h-4 shadow-inner' : ''}`}>
                  <div
                    className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out rounded-full relative overflow-hidden ${isHovered ? colors.shadow + ' shadow-lg' : ''}`}
                    style={{ 
                      width: `${percentage}%`,
                      animation: isHovered ? 'pulse 2s infinite' : 'none'
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" 
                      style={{
                        backgroundSize: '200% 100%',
                        animation: isHovered ? 'shimmer 1.5s infinite' : 'none'
                      }}
                    />
                  </div>
                </div>
                
                {/* Progress indicator */}
                {isHovered && (
                  <div 
                    className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg transition-all duration-300"
                    style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Total Section */}
      <div className="mt-6 pt-4 border-t-2 border-gradient-to-r from-gray-200 to-gray-300">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Total Participantes:</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {total.toLocaleString()}
              </span>
              <div className="text-xs text-gray-500 font-medium">personas</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DistributionChart;
