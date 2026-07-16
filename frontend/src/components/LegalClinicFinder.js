import React, { useState, useEffect, useRef } from 'react';
import TranslatableText from './TranslatableText';
import styles from './LegalClinicFinder.module.css';

const LegalClinicFinder = ({ isOpen, onClose }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyClinics, setNearbyClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  // Sample legal clinics data - in production, this would come from a database
  const sampleClinics = [
    {
      id: 1,
      name: 'Delhi Legal Aid Society',
      address: 'Tis Hazari Courts Complex, Delhi 110054',
      phone: '+91-11-2396-5000',
      email: 'info@delhilegalaid.org',
      specializations: ['Family Law', 'Consumer Rights', 'Criminal Defense'],
      timings: 'Mon-Fri: 9:00 AM - 5:00 PM',
      rating: 4.5,
      coordinates: { lat: 28.6692, lng: 77.2265 },
      website: 'www.delhilegalaid.org',
      verified: true
    },
    {
      id: 2,
      name: 'Mumbai Free Legal Clinic',
      address: 'Fort District Court, Mumbai 400001',
      phone: '+91-22-2266-1234',
      email: 'help@mumbaifreeleg.org',
      specializations: ['Labor Law', 'Property Disputes', 'Women Rights'],
      timings: 'Mon-Sat: 10:00 AM - 6:00 PM',
      rating: 4.3,
      coordinates: { lat: 18.9322, lng: 72.8264 },
      website: 'www.mumbaifreeleg.org',
      verified: true
    },
    {
      id: 3,
      name: 'Bangalore Legal Aid Center',
      address: 'High Court Road, Bangalore 560001',
      phone: '+91-80-2221-5678',
      email: 'contact@blr-legal.org',
      specializations: ['Corporate Law', 'IT Law', 'Civil Rights'],
      timings: 'Mon-Fri: 9:30 AM - 5:30 PM',
      rating: 4.7,
      coordinates: { lat: 12.9716, lng: 77.5946 },
      website: 'www.blr-legal.org',
      verified: true
    },
    {
      id: 4,
      name: 'Chennai Legal Support',
      address: 'High Court Complex, Chennai 600104',
      phone: '+91-44-2857-9000',
      email: 'info@chennailegalsupport.org',
      specializations: ['Family Disputes', 'Immigration Law', 'Tax Law'],
      timings: 'Mon-Fri: 9:00 AM - 4:00 PM',
      rating: 4.2,
      coordinates: { lat: 13.0827, lng: 80.2707 },
      website: 'www.chennailegalsupport.org',
      verified: true
    },
    {
      id: 5,
      name: 'Hyderabad Legal Clinic',
      address: 'Nampally Court Road, Hyderabad 500001',
      phone: '+91-40-2323-4567',
      email: 'support@hydlegal.org',
      specializations: ['Real Estate Law', 'Criminal Law', 'Consumer Protection'],
      timings: 'Mon-Sat: 9:00 AM - 5:00 PM',
      rating: 4.4,
      coordinates: { lat: 17.3850, lng: 78.4867 },
      website: 'www.hydlegal.org',
      verified: true
    }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        findNearbyClinics(location);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const findNearbyClinics = (userLoc) => {
    setLoading(true);
    
    // Calculate distances and sort by proximity
    const clinicsWithDistance = sampleClinics.map(clinic => ({
      ...clinic,
      distance: calculateDistance(
        userLoc.lat, userLoc.lng,
        clinic.coordinates.lat, clinic.coordinates.lng
      )
    }));

    // Sort by distance and get nearest 10
    const nearestClinics = clinicsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    setNearbyClinics(nearestClinics);
    setLoading(false);
    
    // Initialize map after finding clinics (only if Google Maps is available)
    if (window.google && mapRef.current) {
      initializeMap(userLoc, nearestClinics);
    }
  };

  const initializeMap = (userLoc, clinics) => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: userLoc,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add user location marker
    const userMarker = new window.google.maps.Marker({
      position: userLoc,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    });

    markersRef.current.push(userMarker);

    // Add clinic markers
    clinics.forEach((clinic, index) => {
      const marker = new window.google.maps.Marker({
        position: clinic.coordinates,
        map: map,
        title: clinic.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#d32f2f"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #d32f2f;">${clinic.name}</h3>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${clinic.address}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> ${clinic.phone}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Distance:</strong> ${clinic.distance.toFixed(1)} km</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Timings:</strong> ${clinic.timings}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        setSelectedClinic(clinic);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (isOpen) {
      // For now, we'll show a map placeholder since Google Maps API key is not configured
      // In production, you would load Google Maps API here
    }
  }, [isOpen]);

  const getDirections = (clinic) => {
    if (!userLocation) return;
    
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${clinic.coordinates.lat},${clinic.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const callClinic = (phone) => {
    window.open(`tel:${phone}`);
  };

  const emailClinic = (email) => {
    window.open(`mailto:${email}`);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2><TranslatableText text="Find Legal Clinics Near You" /></h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          {!userLocation ? (
            <div className={styles.locationPrompt}>
              <div className={styles.locationIcon}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3><TranslatableText text="Enable Location Access" /></h3>
              <p><TranslatableText text="Allow location access to find legal clinics near you with accurate distances and directions." /></p>
              <button 
                className={styles.enableLocationBtn}
                onClick={getCurrentLocation}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <TranslatableText text="Getting Location..." />
                  </>
                ) : (
                  <>
                    <i className="fas fa-location-arrow"></i>
                    <TranslatableText text="Enable Location" />
                  </>
                )}
              </button>
              {error && (
                <div className={styles.errorMessage}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <TranslatableText text={error} />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.clinicsContent}>
              <div className={styles.mapContainer}>
                {window.google ? (
                  <div ref={mapRef} className={styles.map}></div>
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <div className={styles.mapIcon}>
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <h3><TranslatableText text="Interactive Map" /></h3>
                    <p><TranslatableText text="Map view shows your location and nearby legal clinics with directions" /></p>
                    <div className={styles.mapNote}>
                      <i className="fas fa-info-circle"></i>
                      <TranslatableText text="Google Maps integration available with API key configuration" />
                    </div>
                    <div className={styles.coordinatesDisplay}>
                      {userLocation && (
                        <div className={styles.userCoords}>
                          <i className="fas fa-location-arrow"></i>
                          <span>
                            <TranslatableText text="Your Location: " />
                            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                          </span>
                        </div>
                      )}
                      {nearbyClinics.length > 0 && (
                        <div className={styles.clinicsPreview}>
                          <div className={styles.previewTitle}>
                            <i className="fas fa-map-pin"></i>
                            <TranslatableText text="Clinic Locations:" />
                          </div>
                          <div className={styles.previewClinics}>
                            {nearbyClinics.slice(0, 3).map((clinic, index) => (
                              <div key={clinic.id} className={styles.previewClinic}>
                                <span className={styles.clinicMarker}>{index + 1}</span>
                                <div className={styles.previewInfo}>
                                  <span className={styles.previewName}>{clinic.name}</span>
                                  <span className={styles.previewDistance}>{clinic.distance.toFixed(1)} km</span>
                                </div>
                              </div>
                            ))}
                            {nearbyClinics.length > 3 && (
                              <div className={styles.morePreview}>
                                <TranslatableText text={`+${nearbyClinics.length - 3} more clinics`} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.clinicsList}>
                <div className={styles.listHeader}>
                  <h3><TranslatableText text="Nearby Legal Clinics" /></h3>
                  <span className={styles.resultCount}>
                    <TranslatableText text={`${nearbyClinics.length} clinics found`} />
                  </span>
                </div>
                
                {loading ? (
                  <div className={styles.loadingClinics}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <TranslatableText text="Finding nearby clinics..." />
                  </div>
                ) : (
                  <div className={styles.clinicsGrid}>
                    {nearbyClinics.map((clinic) => (
                      <div 
                        key={clinic.id} 
                        className={`${styles.clinicCard} ${selectedClinic?.id === clinic.id ? styles.selected : ''}`}
                        onClick={() => setSelectedClinic(clinic)}
                      >
                        <div className={styles.clinicHeader}>
                          <div className={styles.clinicInfo}>
                            <h4>{clinic.name}</h4>
                            {clinic.verified && (
                              <span className={styles.verifiedBadge}>
                                <i className="fas fa-check-circle"></i>
                                <TranslatableText text="Verified" />
                              </span>
                            )}
                          </div>
                          <div className={styles.distance}>
                            {clinic.distance.toFixed(1)} km
                          </div>
                        </div>
                        
                        <div className={styles.clinicDetails}>
                          <p className={styles.address}>
                            <i className="fas fa-map-marker-alt"></i>
                            {clinic.address}
                          </p>
                          
                          <p className={styles.timing}>
                            <i className="fas fa-clock"></i>
                            {clinic.timings}
                          </p>
                          
                          <div className={styles.specializations}>
                            <i className="fas fa-gavel"></i>
                            <span>{clinic.specializations.join(', ')}</span>
                          </div>
                          
                          <div className={styles.rating}>
                            <div className={styles.stars}>
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < Math.floor(clinic.rating) ? styles.filled : ''}`}
                                ></i>
                              ))}
                            </div>
                            <span>({clinic.rating})</span>
                          </div>
                        </div>
                        
                        <div className={styles.clinicActions}>
                          <button 
                            className={styles.actionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              callClinic(clinic.phone);
                            }}
                          >
                            <i className="fas fa-phone"></i>
                            <TranslatableText text="Call" />
                          </button>
                          
                          <button 
                            className={styles.actionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              emailClinic(clinic.email);
                            }}
                          >
                            <i className="fas fa-envelope"></i>
                            <TranslatableText text="Email" />
                          </button>
                          
                          <button 
                            className={styles.actionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(clinic);
                            }}
                          >
                            <i className="fas fa-directions"></i>
                            <TranslatableText text="Directions" />
                          </button>
                          
                          {clinic.website && (
                            <button 
                              className={styles.actionBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://${clinic.website}`, '_blank');
                              }}
                            >
                              <i className="fas fa-globe"></i>
                              <TranslatableText text="Website" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalClinicFinder;
