import axios from 'axios';
import router from '@/router'; // importa el router si vas a redirigir

import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: "https://192.168.0.14:443",
    withCredentials: true,
  });

// Interceptor de respuesta global
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {

      // Mostrar alerta con SweetAlert2
      Swal.fire({
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
      localStorage.removeItem('token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
