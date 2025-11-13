import React from 'react';
import { BookOpen, Target } from 'lucide-react';

const DescriptorList = ({ filteredDescriptors }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Descritores Encontrados ({filteredDescriptors.length})
        </h3>
      </div>

      {filteredDescriptors.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum descritor encontrado com os filtros selecionados</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-6">
          {filteredDescriptors.map((descriptor) => (
            <div
              key={descriptor.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {descriptor.icon && (
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">{descriptor.icon}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {descriptor.descriptor_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Código: {descriptor.descriptor_code}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {descriptor.descriptor_description}
              </p>

              <div className="flex flex-wrap gap-2">
                {descriptor.subject && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {descriptor.subject}
                  </span>
                )}
                {descriptor.grade && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {descriptor.grade}
                  </span>
                )}
                {descriptor.learning_field && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {descriptor.learning_field}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptorList;