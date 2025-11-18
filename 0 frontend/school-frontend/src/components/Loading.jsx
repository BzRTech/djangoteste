import React from "react";

const Loading = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Carregando dados...</p>
      </div>
    </div>
  );
};

export default Loading;
