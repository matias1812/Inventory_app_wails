import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_SOME_KEY;
/**
 * Hook personalizado para manejar peticiones HTTP.
 * @param {string} endpoint - El endpoint de la API (sin la URL base).
 * @param {string} method - El método HTTP a utilizar (GET, POST, PUT, DELETE).
 * @param {object} [body] - El cuerpo de la petición, si es necesario.
 * @param {boolean} [isFileDownload] - Indica si se espera una descarga de archivo.
 * @returns {[object, boolean, any]} - [data, loading, error]
 */
export function useApi(endpoint, method, body = null, isFileDownload = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': isFileDownload ? 'application/octet-stream' : 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (isFileDownload) {
        const blob = await response.blob();
        setData({
          url: window.URL.createObjectURL(blob),
          type: response.headers.get('Content-Type'),
        });
      } else {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, method, body, isFileDownload]);

  return [data, loading, error];
}
