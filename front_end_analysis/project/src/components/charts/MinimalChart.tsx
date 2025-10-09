import React from 'react';

interface DataItem {
  name: string;
  value: number;
  percentage?: number;
  color: string;
}

interface MinimalChartProps {
  data: DataItem[];
  title: string;
  type?: 'bar' | 'donut';
  showPercentages?: boolean;
  total?: number;
}

const MinimalChart: React.FC<MinimalChartProps> = ({ 
  data, 
  title, 
  type = 'bar',
  showPercentages = true,
  total: providedTotal 
}) => {
  const calculatedTotal = data.reduce((sum, item) => sum + item.value, 0);
  const total = providedTotal || calculatedTotal;
  const maxValue = Math.max(...data.map(item => item.value));

  if (type === 'donut') {
    let cumulativePercentage = 0;
    
    return (
      <div className="w-full">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">{title}</h4>
        
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:stroke-4"
                />
              );
            })}
          </svg>
          
          {/* Centro del donut */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">{item.value}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Gráfico de barras minimalista
  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">{title}</h4>
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800">{item.value.toLocaleString()}</span>
                  {showPercentages && (
                    <span className="text-xs text-gray-500 ml-2">{percentage.toFixed(1)}%</span>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Total */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-bold text-gray-800">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MinimalChart;