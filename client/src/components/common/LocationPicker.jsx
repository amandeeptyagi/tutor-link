import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ profile, setProfile, editMode }) => {
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setProfile((prev) => {
          const updated = {
            ...prev,
            latitude: lat,
            longitude: lng,
          };
          return updated;
        });
      },
    });

    return profile.latitude && profile.longitude ? (
      <Marker position={[profile.latitude, profile.longitude]} />
    ) : null;
  };

  return (
    <>
      <div className={`${!editMode ? "pointer-events-none opacity-50" : "none"}`}>
        <label className="block text-sm mb-2">Pick Location</label>
        <MapContainer
          center={[profile.latitude || 20, profile.longitude || 78]}
          zoom={profile.latitude && profile.longitude ? 13 : 5}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </>
  );
};

export default LocationPicker;
