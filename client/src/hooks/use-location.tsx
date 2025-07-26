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
          
          // For demo purposes, we'll use a reverse geocoding service or fallback
          // In production, you'd use a service like Google Maps Geocoding API
          const location: LocationData = {
            name: "Current Location",
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
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
