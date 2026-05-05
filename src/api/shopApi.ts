const baseURL = import.meta.env.VITE_SHOP_API_URL; 

    export const shopApi = async (endpoint: string, options: RequestInit = {}) => {
      const url = `${baseURL}${endpoint}`;
      

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      return response.json();
    };