import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

const StackedBarChart = ({
  dados,
  barras,
  campoX,
  titulo,
  altura = 300,
  mostrarLegenda = true,
  mostrarGrid = true,
  horizontal = false
}) => {
  const coresPadrao = {
    insuficiente: '#EF4444',
    basico: '#F59E0B',
    adequado: '#3B82F6',
    avancado: '#10B981'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((acc, item) => acc + (item.value || 0), 0);
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm flex justify-between gap-4"
              style={{ color: entry.color }}
            >
              <span>{entry.name}:</span>
              <span className="font-semibold">
                {entry.value?.toFixed(1)}% ({((entry.value / total) * 100).toFixed(0)}% do total)
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (horizontal) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        {titulo && (
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {titulo}
          </h3>
        )}
        <ResponsiveContainer width="100%" height={altura}>
          <BarChart
            data={dados}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {mostrarGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                horizontal={false}
              />
            )}
            <XAxis
              type="number"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey={campoX}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            {mostrarLegenda && (
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span className="text-gray-600 dark:text-gray-400 text-xs">{value}</span>
                )}
              />
            )}
            {barras.map((barra) => (
              <Bar
                key={barra.campo}
                dataKey={barra.campo}
                name={barra.nome || barra.campo}
                stackId="stack"
                fill={barra.cor || coresPadrao[barra.campo] || '#6B7280'}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
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
            tick={{ fill: '#6B7280', fontSize: 11 }}
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
                <span className="text-gray-600 dark:text-gray-400 text-xs">{value}</span>
              )}
            />
          )}
          {barras.map((barra) => (
            <Bar
              key={barra.campo}
              dataKey={barra.campo}
              name={barra.nome || barra.campo}
              stackId="stack"
              fill={barra.cor || coresPadrao[barra.campo] || '#6B7280'}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
