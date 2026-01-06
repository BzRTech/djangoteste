import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

const BarChartComparativo = ({
  dados,
  campoX,
  campoY,
  meta,
  titulo,
  horizontal = true,
  corBarra = '#3B82F6',
  corAbaixoMeta = '#EF4444',
  altura = 400,
  mostrarLegenda = true
}) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {data[campoX]}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Valor: <span className="font-semibold">{data[campoY]?.toFixed(1)}</span>
          </p>
          {meta && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Meta: <span className="font-semibold">{meta.toFixed(1)}</span>
            </p>
          )}
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
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey={campoX}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            {meta && (
              <ReferenceLine
                x={meta}
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `Meta: ${meta}`,
                  position: 'top',
                  fill: '#10B981',
                  fontSize: 11
                }}
              />
            )}
            <Bar
              dataKey={campoY}
              radius={[0, 4, 4, 0]}
              maxBarSize={25}
            >
              {dados.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={meta && entry[campoY] < meta ? corAbaixoMeta : corBarra}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {mostrarLegenda && meta && (
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: corBarra }} />
              <span className="text-gray-600 dark:text-gray-400">Acima/Na meta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: corAbaixoMeta }} />
              <span className="text-gray-600 dark:text-gray-400">Abaixo da meta</span>
            </div>
          </div>
        )}
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
          <XAxis
            dataKey={campoX}
            tick={{ fill: '#6B7280', fontSize: 11 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            domain={[0, 'auto']}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {meta && (
            <ReferenceLine
              y={meta}
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
          <Bar
            dataKey={campoY}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {dados.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={meta && entry[campoY] < meta ? corAbaixoMeta : corBarra}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComparativo;
