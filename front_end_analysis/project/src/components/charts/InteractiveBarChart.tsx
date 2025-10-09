import React, { useState, useEffect } from 'react';

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface InteractiveBarChartProps {
  data: DataItem[];
  title?: string;
  colorScheme?: 'blue' | 'green' | 'purple' | 'gradient';
}

const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({ 
  data, 
  title = "Gráfico Interactivo",
  colorScheme = 'purple'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [animatedHeights, setAnimatedHeights] = useState<number[]>([]);

  const maxValue = Math.max(...data.map(item => item.value));
  
  // Animate bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeights(data.map(item => (item.value / maxValue) * 100));
    }, 300);
    return () => clearTimeout(timer);
  }, [data, maxValue]);

  const getBarGradient = (index: number, baseColor?: string) => {
    if (baseColor) return `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}CC 100%)`;
    
    const isSelected = selectedIndex === index;
    const isHovered = hoveredIndex === index;
    
    if (isSelected) {
      return 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)';
    }
    
    switch (colorScheme) {
      case 'blue':
        return isHovered 
          ? 'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 50%, #2563EB 100%)'
          : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)';
      case 'green':
        return isHovered
          ? 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)'
          : 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)';
      case 'purple':
        return isHovered
          ? 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)'
          : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)';
      case 'gradient':
        return isHovered
          ? 'linear-gradient(135deg, #EC4899 0%, #BE185D 50%, #9D174D 100%)'
          : 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #BE185D 100%)';
      default:
        return isHovered
          ? 'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 50%, #2563EB 100%)'
          : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)';
    }
  };

  const getShadowColor = () => {
    switch (colorScheme) {
      case 'blue': return 'rgba(59, 130, 246, 0.3)';
      case 'green': return 'rgba(16, 185, 129, 0.3)';
      case 'purple': return 'rgba(139, 92, 246, 0.3)';
      case 'gradient': return 'rgba(236, 72, 153, 0.3)';
      default: return 'rgba(59, 130, 246, 0.3)';
    }
  };

  const handleBarClick = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="w-full h-full p-3">
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mt-2" />
        </div>
      )}
      
      <div className="flex items-end justify-center space-x-3 h-40 mb-4 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4">
        {data.map((item, index) => {
          const heightPercentage = animatedHeights[index] || 0;
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const shadowColor = getShadowColor();
          
          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleBarClick(index)}
            >
              {/* Floating value label */}
              <div 
                className={`absolute -top-12 transition-all duration-300 z-10 ${
                  isHovered || isSelected ? 'opacity-100 transform -translate-y-2 scale-110' : 'opacity-0'
                }`}
              >
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-bold relative">
                  {item.value.toLocaleString()}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              </div>
              
              {/* Enhanced Bar */}
              <div
                className={`w-16 transition-all duration-700 ease-out rounded-t-xl relative overflow-hidden ${
                  isHovered ? 'transform scale-110 shadow-2xl' : 'shadow-lg'
                } ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-60' : ''}`}
                style={{
                  height: `${heightPercentage}%`,
                  background: getBarGradient(index, item.color),
                  minHeight: '12px',
                  boxShadow: isHovered ? `0 20px 40px ${shadowColor}` : `0 8px 20px ${shadowColor}`
                }}
              >
                {/* Shimmer effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transition-all duration-300 ${
                    isHovered ? 'animate-pulse' : ''
                  }`}
                />
                
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 rounded-t-xl" />
                
                {/* Value display inside bar for larger bars */}
                {heightPercentage > 30 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-white text-xs font-bold drop-shadow-lg">
                      {item.value}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enhanced Label */}
              <div className="mt-3 text-center">
                <div className={`text-sm font-semibold transition-all duration-300 ${
                  isHovered || isSelected 
                    ? 'text-gray-900 transform scale-105' 
                    : 'text-gray-600'
                }`}>
                  {item.name}
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  isHovered || isSelected ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Legend/Info */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-full px-6 py-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600 font-medium">Hover para detalles</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600 font-medium">Click para seleccionar</span>
          </div>
        </div>
        
        {selectedIndex !== null && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" />
              <p className="text-sm font-bold text-yellow-800">
                Seleccionado: <span className="text-orange-700">{data[selectedIndex]?.name}</span>
              </p>
              <div className="text-lg font-bold text-yellow-900">
                {data[selectedIndex]?.value.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveBarChart;
