import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const PieChartComponent = ({
  dados,
  campoValor,
  campoNome,
  titulo,
  altura = 300,
  mostrarLegenda = true,
  cores,
  tipo = 'pie' // 'pie' or 'donut'
}) => {
  const coresPadrao = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const coresUsadas = cores || coresPadrao;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = dados.reduce((acc, item) => acc + item[campoValor], 0);
      const percentual = ((data[campoValor] / total) * 100).toFixed(1);

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {data[campoNome]}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Valor: <span className="font-semibold">{data[campoValor].toLocaleString('pt-BR')}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Percentual: <span className="font-semibold">{percentual}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {titulo}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={altura}>
        <PieChart>
          <Pie
            data={dados}
            dataKey={campoValor}
            nameKey={campoNome}
            cx="50%"
            cy="50%"
            innerRadius={tipo === 'donut' ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {dados.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={coresUsadas[index % coresUsadas.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {mostrarLegenda && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
