import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

interface GlacierData {
  name: string;
  lat: number;
  lng: number;
  data: string;
  id: string;
}

export const glaciers: GlacierData[] = [
  { name: 'Glacier 1', lat: 41.365334, lng: 71.043201, data: '28% от 100%', id: '1' },
  { name: 'Glacier 2', lat: 41.375, lng: 71.053, data: '35% от 100%', id: '2' },
  { name: 'Glacier 3', lat: 41.355, lng: 71.033, data: '45% от 100%', id: '3' },
  { name: 'Glacier 4', lat: 41.37, lng: 71.02, data: '60% от 100%', id: '4' },
  { name: 'Glacier 5', lat: 41.36, lng: 71.06, data: '75% от 100%', id: '5' },
];

const center = {
  lat: 41.365334,
  lng: 71.043201,
};

const GlacierMap: React.FC = () => {
  const [hoveredGlacier, setHoveredGlacier] = useState<GlacierData | null>(null);
  const navigate = useNavigate();

  const handleMarkerMouseOver = (glacier: GlacierData) => {
    setHoveredGlacier(glacier);
  };

  const handleMarkerMouseOut = () => {
    setHoveredGlacier(null);
  };

  const handleMarkerClick = (glacier: GlacierData) => {
    navigate(`/glacier/${glacier.id}`);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      language="en" // Устанавливаем английский язык
    >
      <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={11}>
        {glaciers.map((glacier) => (
          <Marker
            key={glacier.id}
            position={{ lat: glacier.lat, lng: glacier.lng }}
            onMouseOver={() => handleMarkerMouseOver(glacier)}
            onMouseOut={handleMarkerMouseOut}
            onClick={() => handleMarkerClick(glacier)}
          />
        ))}

        {hoveredGlacier && (
          <InfoWindow
            position={{ lat: hoveredGlacier.lat, lng: hoveredGlacier.lng }}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
            }}
          >
            <div>
              <p>{hoveredGlacier.name}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GlacierMap;
