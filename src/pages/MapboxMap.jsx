import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoib21hcm5lZnppIiwiYSI6ImNtYjQ3azczNDFrdjkyanIwdm9mZHpjYW0ifQ.oM5jT9V4AYqjDYfZpY3Csw';

// Convert [lat, lng] → [lng, lat] for Mapbox
const convertToMapboxCoords = ([lat, lng]) => [lng, lat];

// Input in Google Maps format: [lat, lng]
const googleLocations = [
  { name: 'Tunis', coordinates: [36.0886064393329, 9.567931961574732] },
  { name: 'Sfax', coordinates: [34.7406, 10.7603] },
  { name: 'Tozeur', coordinates: [33.9197, 8.1275] },
  { name: 'Djerba', coordinates: [33.8076, 10.8587] },
  { name: 'Bizerte', coordinates: [37.2744, 9.865] },
  { name: 'Kairouan', coordinates: [35.6781, 10.1000] },
  { name: 'Gabès', coordinates: [33.8833, 10.1000] }
];

// Convert all coordinates to Mapbox format
const locations = googleLocations.map(loc => ({
  ...loc,
  coordinates: convertToMapboxCoords(loc.coordinates)
}));

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10, 34.5],
      zoom: 5
    });

    // Add markers for each location
    locations.forEach(loc => {
      new mapboxgl.Marker()
        .setLngLat(loc.coordinates)
        .setPopup(new mapboxgl.Popup().setText(loc.name))
        .addTo(map.current);
    });
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
    </div>
  );
};

export default MapboxMap;
