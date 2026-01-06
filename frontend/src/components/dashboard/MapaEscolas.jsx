import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different IDEB levels
const createCustomIcon = (ideb) => {
  let color;
  if (ideb >= 5.5) color = '#10B981'; // Green - good
  else if (ideb >= 4.5) color = '#3B82F6'; // Blue - average
  else if (ideb >= 3.5) color = '#F59E0B'; // Yellow - attention
  else color = '#EF4444'; // Red - critical

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="color: white; font-size: 10px; font-weight: bold;">${ideb?.toFixed(1) || '?'}</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Component to fit bounds to all markers
const FitBounds = ({ escolas }) => {
  const map = useMap();

  useEffect(() => {
    if (escolas && escolas.length > 0) {
      const bounds = L.latLngBounds(
        escolas.map(e => [e.latitude, e.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [escolas, map]);

  return null;
};

const MapaEscolas = ({
  escolas,
  titulo,
  altura = 400,
  onEscolaClick
}) => {
  // Default center (Brasília)
  const centro = escolas && escolas.length > 0
    ? [
        escolas.reduce((acc, e) => acc + e.latitude, 0) / escolas.length,
        escolas.reduce((acc, e) => acc + e.longitude, 0) / escolas.length
      ]
    : [-15.7942, -47.8822];

  const getEtapaLabel = (etapa) => {
    const etapas = {
      'INFANTIL': 'Ed. Infantil',
      'FUNDAMENTAL_1': 'Fund. I',
      'FUNDAMENTAL_2': 'Fund. II'
    };
    return etapas[etapa] || etapa;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {titulo && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {titulo}
          </h3>
        </div>
      )}
      <div style={{ height: altura }}>
        <MapContainer
          center={centro}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds escolas={escolas} />
          {escolas?.map((escola) => (
            <Marker
              key={escola.id}
              position={[escola.latitude, escola.longitude]}
              icon={createCustomIcon(escola.ideb)}
              eventHandlers={{
                click: () => onEscolaClick && onEscolaClick(escola)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">
                    {escola.nome}
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">IDEB:</span>{' '}
                      <span className={`font-bold ${
                        escola.ideb >= 5.5 ? 'text-emerald-600' :
                        escola.ideb >= 4.5 ? 'text-blue-600' :
                        escola.ideb >= 3.5 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {escola.ideb?.toFixed(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Alunos:</span>{' '}
                      {escola.totalAlunos?.toLocaleString('pt-BR')}
                    </p>
                    <p>
                      <span className="font-medium">Etapa:</span>{' '}
                      {getEtapaLabel(escola.etapa)}
                    </p>
                  </div>
                  {onEscolaClick && (
                    <button
                      onClick={() => onEscolaClick(escola)}
                      className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-600 dark:text-gray-400">IDEB ≥ 5.5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">IDEB 4.5 - 5.4</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-gray-600 dark:text-gray-400">IDEB 3.5 - 4.4</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">IDEB &lt; 3.5</span>
        </div>
      </div>
    </div>
  );
};

export default MapaEscolas;
