import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const cityCenters = {
  NCR: [
    { center: "Country Delight", type: "PMKVY", address: "Plot No. 3/3a Block-CB Sector 44, Noida", email: "shivkumar@countrydelight.in", lat: 28.5675, lng: 77.3349 },
    { center: "PMKK JITM Gautam Budh Nagar", type: "PMKVY", address: "Plot No. 29D, Knowledge Park-1, Greater Noida", email: "Gautambudhnagar.pmkk@jitmskills.com", lat: 28.4744, lng: 77.4912 },
    { center: "Kolvin Management Solutions", type: "PMKVY", address: "A-14, Sector 68, Noida", email: "vishwakarmashanu778@gmail.com", lat: 28.5843, lng: 77.3921 },
    { center: "LAVA-TSSC (UP)", type: "PMKVY", address: "D-348, Sector 63, Noida", email: "info@kolvinmspl.com", lat: 28.6195, lng: 77.3839 },
  ],
  Lucknow: [
    { center: "Mr Brown", type: "PMKVY", address: "CP3-CP4 Sitapur Road, Jankipuram, Lucknow", email: "principal@dibcas.com", lat: 26.9265, lng: 80.9503 },
    { center: "NIELIT Lucknow", type: "PMKVY", address: "A 1/9 Sumit Complex, Gomti Nagar, Lucknow", email: "ghanshyam@nielit.gov.in", lat: 26.8542, lng: 81.0038 },
    { center: "AISECT PMKK Lucknow", type: "PMKVY", address: "578/785 Jai Sooraj Niwas, Sarojini Nagar", email: "chetan.jain@aisect.org", lat: 26.7353, lng: 80.8885 },
  ],
  Gurgaon: [
    { center: "OM Institute", type: "PMKVY", address: "KHASRA NO 2/11 State Highway No 26, Jamalpur", email: "ominstitute@omlogistics.co.in", lat: 28.4426, lng: 76.9969 },
    { center: "GD Goenka University", type: "PMKVY", address: "GD Goenka University Campus, Sohna", email: "pankaj.jindal@gdgoenka.com", lat: 28.2467, lng: 77.0660 },
    { center: "PMKK - Gurugram Centre", type: "PMKVY", address: "Kadipur Enclave", email: "neha.jawaliya20@gmail.com", lat: 28.5040, lng: 77.0256 },
  ],
};

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [markers, map]);
  return null;
}

export default function MapPage() {
  const [city, setCity] = useState('NCR');
  const [userLoc, setUserLoc] = useState(null);

  const centers = cityCenters[city] || [];

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Locate Nearest Training Center</h2>
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-6 flex flex-col items-center">
        <div className="flex gap-3 flex-wrap justify-center mb-4">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            {Object.keys(cityCenters).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={locateUser} className="px-5 py-2 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:border-primary hover:text-primary transition-colors">
            Show My Location
          </button>
        </div>
        <div className="w-full max-w-[800px] h-[500px] rounded-xl overflow-hidden border border-slate-200">
          <MapContainer center={[28.5, 77.3]} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds markers={userLoc ? [...centers, userLoc] : centers} />
            {centers.map((c, i) => (
              <Marker key={i} position={[c.lat, c.lng]} icon={redIcon}>
                <Popup>
                  <b>{c.center}</b><br />{c.type}<br />{c.address}<br />{c.email}
                </Popup>
              </Marker>
            ))}
            {userLoc && (
              <Marker position={[userLoc.lat, userLoc.lng]} icon={blueIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
