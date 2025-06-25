import axios from 'axios';
// import router from '@/router'; // importa el router si vas a redirigir

// import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: "https://192.168.0.14:443",
    withCredentials: true,
  });

// Interceptor de respuesta global
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {

//       // Mostrar alerta con SweetAlert2
//       Swal.fire({
//         title: 'Sesión Expirada',
//         text: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
//         icon: 'warning',
//         confirmButtonText: 'Aceptar'
//       })
//       localStorage.removeItem('token');
//       router.push('/loginview');
//     }

//     else if (error.response?.status === 403) {
//       Swal.fire({
// title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
// html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
// showConfirmButton: true,
// footer: "Ha ocurrido un error inesperado",
// confirmButtonText: "Aceptar",
// confirmButtonColor: 'var(--color-secundario)',

// });



//     }
//     return Promise.reject(error);
//   }


  
// );

export default api;
