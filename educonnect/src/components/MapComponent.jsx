import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick && onPick(e.latlng);
    },
  });
  return null;
}

export default function MapComponent({ lat, lng, zoom = 13, height = 220, editable = false, onPick, popupText }) {
  const [position, setPosition] = useState({ lat, lng });

  const handlePick = (latlng) => {
    setPosition(latlng);
    onPick && onPick(latlng);
  };

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl">
      <MapContainer center={[position.lat, position.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]} icon={icon}>
          {popupText && <Popup>{popupText}</Popup>}
        </Marker>
        {editable && <ClickHandler onPick={handlePick} />}
      </MapContainer>
    </div>
  );
}
