import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  map.setView([lat, lon], 10);
  return null;
}

export default function WeatherMap({ location }) {
  if (!location) return null;

  return (
    <div className="glass rounded-3xl overflow-hidden p-6">
      <p className="text-white/50 text-xs uppercase tracking-wide mb-4">Location</p>
      <div className="h-[200px] rounded-2xl overflow-hidden">
        <MapContainer center={[location.lat, location.lon]} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[location.lat, location.lon]}>
            <Popup>{location.name}, {location.country}</Popup>
          </Marker>
          <RecenterMap lat={location.lat} lon={location.lon} />
        </MapContainer>
      </div>
    </div>
  );
}
