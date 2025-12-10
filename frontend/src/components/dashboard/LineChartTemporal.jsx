import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

const LineChartTemporal = ({
  dados,
  linhas,
  campoX,
  titulo,
  altura = 300,
  mostrarLegenda = true,
  mostrarGrid = true
}) => {
  const cores = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-semibold">{entry.value?.toFixed(1)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <LineChart
          data={dados}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {mostrarGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={campoX}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {mostrarLegenda && (
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>
              )}
            />
          )}
          {linhas.map((linha, index) => (
            <Line
              key={linha.campo}
              type="monotone"
              dataKey={linha.campo}
              name={linha.nome || linha.campo}
              stroke={linha.cor || cores[index % cores.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: linha.cor || cores[index % cores.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTemporal;
