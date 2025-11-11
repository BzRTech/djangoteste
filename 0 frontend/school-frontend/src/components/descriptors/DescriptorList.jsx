import React from 'react';
import { BookOpen, Target } from 'lucide-react';

const DescriptorList = ({ filteredDistractors }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Descritores Encontrados ({filteredDistractors.length})
        </h3>
      </div>

      {filteredDistractors.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum descritor encontrado com os filtros selecionados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-6">
          {filteredDistractors.map((distractor) => (
            <div
              key={distractor.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {distractor.icon && (
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">{distractor.icon}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {distractor.distractor_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Código: {distractor.distractor_code}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {distractor.distractor_description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {distractor.subject}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {distractor.grade}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {distractor.learning_field}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptorList;