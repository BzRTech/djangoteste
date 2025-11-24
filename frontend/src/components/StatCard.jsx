import React from "react";
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "from-blue-100 to-blue-600",
    green: "from-green-100 to-green-600",
    orange: "from-orange-100 to-orange-600",
    purple: "from-purple-100 to-purple-600",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]}  rounded-xl shadow-lg p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-800 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colors[color].text} mt-2`}>
            {value}
          </p>
        </div>
        <Icon className="w-12 h-12 text-white/80" />
      </div>
    </div>
  );
};

export default StatCard;
