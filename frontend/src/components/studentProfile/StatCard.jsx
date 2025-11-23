import React from "react";
const StatCard = ({ title, value, total, icon: Icon, color }) => {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colors[color].text} mt-2`}>
            {value}
          </p>
          {total && <p className="text-sm text-gray-500 mt-1">de {total}</p>}
        </div>
        <div className={`${colors[color].bg} p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${colors[color].text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
