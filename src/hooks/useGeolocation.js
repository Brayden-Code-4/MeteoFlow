/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback((onSuccess, onError) => {
    if (!navigator.geolocation) {
      const msg = "Votre navigateur ne supporte pas la géolocalisation.";
      setState({ latitude: null, longitude: null, error: msg, loading: false });
      onError(msg);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const successCallback = (position) => {
      const { latitude, longitude } = position.coords;
      setState({
        latitude,
        longitude,
        error: null,
        loading: false,
      });
      onSuccess(latitude, longitude);
    };

    const errorCallback = (error) => {
      let msg = "Une erreur est survenue lors de la récupération de votre position.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = "Autorisation de géolocalisation refusée. Veuillez l'activer dans vos paramètres.";
          break;
        case error.POSITION_UNAVAILABLE:
          msg = "La position GPS est indisponible.";
          break;
        case error.TIMEOUT:
          msg = "Le délai d'attente pour récupérer la position est dépassé.";
          break;
      }
      setState({
        latitude: null,
        longitude: null,
        error: msg,
        loading: false,
      });
      onError(msg);
    };

    // options with maximum age and timeout
    const options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  }, []);

  return {
    ...state,
    requestLocation,
  };
}
