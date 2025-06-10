import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Location.css";

const Location = () => {
  const [data, setData] = useState({
    events: [],
    villes: [],
    activites: []
  });
  
  const [filters, setFilters] = useState({
    ville: "",
    activite: "",
    type: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultPosition = { lat: 36.8065, lng: 10.1815 };
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const infoWindowsRef = useRef([]);

  // Style minimaliste pour la carte
  const minimalistStyle = [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" },
        { "color": "#5b5b5b" }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        { "color": "#f2f2f2" }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" },
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" },
        { "color": "#dadada" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        { "color": "#d8eaf5" }
      ]
    }
  ];

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4UJ3rBXNtRM2cOD_0jRgUK0ZXi0oKyJU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => {
        setError("Erreur de chargement de Google Maps");
        setScriptLoaded(false);
      };
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize map with minimalist style
  useEffect(() => {
    if (scriptLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultPosition,
        zoom: 12,
        styles: minimalistStyle,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      });
      setMap(newMap);
    }
  }, [scriptLoaded]);

  // Geolocation
  useEffect(() => {
    if (map && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserPosition(pos);
          map.setCenter(pos);
          new window.google.maps.Marker({
            position: pos,
            map,
            title: "Votre position",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          map.setCenter(defaultPosition);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [map]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { events } = await response.json();

        const parsedEvents = events.map(event => ({
          ...event,
          coordinates: {
            lat: event.localisation.coordinates[1],
            lng: event.localisation.coordinates[0]
          },
          ville: event.adresse.split(", ").pop().trim()
        }));

        setData({
          events: parsedEvents,
          villes: [...new Set(parsedEvents.map(event => event.ville))],
          activites: [...new Set(parsedEvents.flatMap(e => e.activitesCentres))]
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update markers when filters or data change
  useEffect(() => {
    if (map && data.events.length > 0) {
      const filteredEvents = data.events.filter(event => 
        (!filters.ville || event.ville === filters.ville) &&
        (!filters.activite || event.activitesCentres.includes(filters.activite)) &&
        (!filters.type || event.type === filters.type)
      );

      clearMarkers();
      
      if (filteredEvents.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const newMarkers = [];
        const newInfoWindows = [];
        
        filteredEvents.forEach(event => {
          const marker = new window.google.maps.Marker({
            position: event.coordinates,
            map,
            title: event.nom,
            icon: {
              url: event.type === "Centre de Sport" 
                ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
          
          bounds.extend(event.coordinates);
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="info-window">
                <h4>${event.nom}</h4>
                <p><strong>Type:</strong> ${event.type}</p>
                <p><strong>Adresse:</strong> ${event.adresse}</p>
                <p><strong>Activités:</strong> ${event.activitesCentres.join(", ")}</p>
                ${event.localisationLink ? 
                  `<a href="${event.localisationLink}" target="_blank" class="map-link">
                    <i class="fas fa-external-link-alt"></i> Voir sur Google Maps
                  </a>` : ''}
              </div>
            `,
            maxWidth: 250
          });
          
          marker.addListener("click", () => {
            infoWindowsRef.current.forEach(iw => iw.close());
            infoWindow.open(map, marker);
          });
          
          newMarkers.push(marker);
          newInfoWindows.push(infoWindow);
        });
        
        setMarkers(newMarkers);
        infoWindowsRef.current = newInfoWindows;
        
        if (filteredEvents.length === 1) {
          map.setCenter(filteredEvents[0].coordinates);
          map.setZoom(15);
        } else {
          map.fitBounds(bounds);
          // Prevent zooming too close
          const zoom = map.getZoom();
          if (zoom > 15) map.setZoom(15);
        }
      }
    }
  }, [filters, data.events, map]);

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(iw => iw.close());
    setMarkers([]);
    infoWindowsRef.current = [];
  };

  const availableVilles = useMemo(() => {
    return data.events
      .filter(event => 
        (!filters.activite || event.activitesCentres.includes(filters.activite)) &&
        (!filters.type || event.type === filters.type)
      )
      .map(event => event.ville)
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [data.events, filters.activite, filters.type]);

  const availableActivites = useMemo(() => {
    return data.events
      .filter(event => 
        (!filters.ville || event.ville === filters.ville) &&
        (!filters.type || event.type === filters.type)
      )
      .flatMap(e => e.activitesCentres)
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [data.events, filters.ville, filters.type]);

  const handleFilter = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { activite: "", ville: "" }),
      ...(name === 'activite' && { ville: "" })
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      ville: "",
      activite: "",
      type: ""
    });
    if (map) {
      map.setCenter(userPosition || defaultPosition);
      map.setZoom(12);
    }
  };

  if (error) {
    return (
      <div className="container location-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container location-container">
      <div className="row align-items-center">
        <div className="col-md-10 mt-4">
          <h2 className="location-title">
            Localiser rapidement les activités autour de vous
          </h2>
          <div className="d-flex gap-3 flex-wrap">
            <select
              className="form-select gray-select-ville text-center"
              onChange={e => handleFilter('ville', e.target.value)}
              value={filters.ville}
              disabled={loading}
            >
              <option value="">Villes</option>
              {availableVilles.map(ville => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>

            <select
              className="form-select gray-select text-center"
              onChange={e => handleFilter('activite', e.target.value)}
              value={filters.activite}
              disabled={loading}
            >
              <option value="">Toutes les activités</option>
              {availableActivites.map(activite => (
                <option key={activite} value={activite}>{activite}</option>
              ))}
            </select>

            <button 
              className="btn btn-outline-secondary"
              onClick={handleResetFilters}
              disabled={loading}
            >
              Réinitialiser
            </button>
          </div>
        </div>

  <div className="col-md d-flex flex-column gap-1 mt-4">
          <button 
            className={`btn gray-btn ${filters.type === "Centre de Sport" ? "active" : ""}`}
            onClick={() => handleFilter('type', "Centre de Sport")}
          >
            Centre de Sport
          </button>
          <button 
            className={`btn gray-btn ${filters.type === "Therapy Location" ? "active" : ""}`}
            onClick={() => handleFilter('type', "Therapy Location")}
          >
            Therapy Location
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div 
            ref={mapRef}
            style={{ 
              width: '100%', 
              height: '65vh',
              minHeight: '500px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}
          />
          {loading && (
            <div className="map-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p>Chargement de la carte et des données...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;