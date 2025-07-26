import { useState, useEffect } from "react";
import type { LocationData } from "@/types";

interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser"
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // For demo purposes, we'll determine a general location based on coordinates
          // In production, you'd use a service like Google Maps Geocoding API
          let locationName = "Current Location";
          let locationAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          // Simple location detection based on common US city coordinates
          if (latitude >= 47.5 && latitude <= 47.7 && longitude >= -122.4 && longitude <= -122.2) {
            locationName = "Seattle Area";
            locationAddress = "Seattle, WA";
          } else if (latitude >= 40.7 && latitude <= 40.8 && longitude >= -74.0 && longitude <= -73.9) {
            locationName = "New York Area";
            locationAddress = "New York, NY";
          } else if (latitude >= 34.0 && latitude <= 34.1 && longitude >= -118.5 && longitude <= -118.2) {
            locationName = "Los Angeles Area";
            locationAddress = "Los Angeles, CA";
          } else if (latitude >= 41.8 && latitude <= 41.9 && longitude >= -87.7 && longitude <= -87.6) {
            locationName = "Chicago Area";
            locationAddress = "Chicago, IL";
          }
          
          const location: LocationData = {
            name: locationName,
            address: locationAddress,
            latitude,
            longitude
          };

          setState({
            location,
            isLoading: false,
            error: null
          });
        } catch (error) {
          setState({
            location: null,
            isLoading: false,
            error: "Failed to get location details"
          });
        }
      },
      (error) => {
        let errorMessage = "Location access denied";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setState({
          location: null,
          isLoading: false,
          error: errorMessage
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const setManualLocation = (location: LocationData) => {
    setState({
      location,
      isLoading: false,
      error: null
    });
  };

  const clearLocation = () => {
    setState({
      location: null,
      isLoading: false,
      error: null
    });
  };

  return {
    ...state,
    detectLocation,
    setManualLocation,
    clearLocation
  };
}
