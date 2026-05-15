const baseURL = import.meta.env.VITE_SHOP_API_URL; 

    export const shopApi = async (endpoint: string, options: RequestInit = {}) => {
      const url = `${baseURL}${endpoint}`;
      
      //interceptor de peticion

      const token = localStorage.getItem('token');
      const headers: Record<string, string> ={
        'Content-type': 'application/json',
        'Accept': 'applicacion/json',
        ...options.headers as Record<string, string>|| {}
      }

      if(token){
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        ...options, headers,
        
      });

      //interceptor de respuesta

      if(response.status === 401){
        localStorage.removeItem('token');

        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      return response.json();
    };