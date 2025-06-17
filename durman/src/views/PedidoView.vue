<template>
  <div class="pedidos-container">
    <div class=" w-full align-center flex justify-end h-8 ">
          <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  text-white font-semibold mr-10 py-1 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
    <table class="pedidos-table">
      <thead style=" background-color: var(--color-principal);">
        <tr>
          <th>Producto</th>
          <th>Cantidad Sugerida</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidos" :key="pedido.id">
          <td>{{ pedido.nombre_producto }}</td>
          <td>{{ pedido.cantidad_sugerida }}</td>
          <td>{{ new Date(pedido.fecha_creacion).toLocaleDateString() }}</td>
          <td class="uppercase p-4" :class="{
    'texto-aprobado bg-green-600': pedido.estado === 'aprobado',
    'texto-pendiente': pedido.estado === 'pendiente',
    'texto-rechazado': pedido.estado !== 'pendiente' && pedido.estado !== 'aprobado'
}">
    {{ capitalizeFirstLetter(pedido.estado) || 'Pendiente' }}
</td>
          <td>
            <button
              @click="aprobarPedido(pedido.id)"
              :disabled="pedido.estado === 'aprobado'"
              class="btn aprobar"
            >
              Aprobar
            </button>
            <button
              @click="rechazarPedido(pedido.id)"
              :disabled="pedido.estado === 'rechazado'"
              class="btn rechazar"
            >
              Rechazar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
import Swal from 'sweetalert2';

import api from '@/services/api';

  export default {
    data() {
      return {
        pedidos: [],
      };
    },
    mounted() {
      this.obtenerPedidos();
    },
    methods: {

        capitalizeFirstLetter(str) {
        if (!str) return ''; // Si no hay texto, retorna vacío
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
      // Obtener todos los pedidos automáticos desde el backend
      async obtenerPedidos() {
        try {

  
          const token = localStorage.getItem("token"); // Obtener el token de localStorage
          const response = await api.get("/api/pedidos-automaticos", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los headers
            },
          });
  
          this.pedidos = response.data; // Asigna los datos a la variable 'pedidos'
        } catch (error) {
          if (error.response?.status === 404) {

            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "No se pudieron obtener los pedidos automáticos.",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          } else if (error.response?.status === 401) {
            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "La corrupción es inevitable. ¿Fue error o fue intención?",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
            this.$router.push("/loginview");
          } 
          
          
          else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});



this.$router.push('/profileconfig#seccion-membership');

          }else {

            
            alert(error.response?.data?.error || "Ocurrió un error inesperado.");

          }
        }
      },
  
      // Aprobar un pedido
      async aprobarPedido(id) {
        try {

          const token = localStorage.getItem("token"); // Obtener el token de localStorage
          await api.put(`/api/pedidos-automaticos/${id}/aprobar`, null, {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los headers
            },
          });
  
          Swal.fire({
      icon: 'success',
      title: 'Pedido aprobado',
      text: 'El pedido ha sido aprobado exitosamente.',
      timer: 2000,
      showConfirmButton: false,
      backdrop: `rgba(0, 128, 0, 0.1)`,
    });
          this.obtenerPedidos(); // Recargar lista de pedidos
        } catch (error) {
          if (error.response?.status === 404) {

            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "No se pudo aprobar el pedido.",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          } else if (error.response?.status === 401) {
            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "La corrupción es inevitable. ¿Fue error o fue intención?",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
            this.$router.push("/loginview");
          } 
          
          else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});



this.$router.push('/profileconfig#seccion-membership');

          }
          else {
            alert(error.response?.data?.error || "Ocurrió un error inesperado.");
          }
        }
      },
  
      // Rechazar un pedido
      async rechazarPedido(id) {
        try {
          const api = api.create({
            baseURL: "https://192.168.0.14:443", // Ajusta la URL del backend
            withCredentials: true,
          });
  
          const token = localStorage.getItem("token"); // Obtener el token de localStorage
          await api.put(`/api/pedidos-automaticos/${id}/rechazar`, null, {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los headers
            },
          });
  
          Swal.fire({
  icon: 'error',
  title: 'Pedido rechazado',
  text: 'El pedido ha sido rechazado. Motivo: stock insuficiente.', // Mensaje detallado
  timer: 3000, // 3 segundos
  showConfirmButton: true, // Muestra el botón "OK" (útil si el mensaje es importante)
  confirmButtonColor: '#d33', // Botón rojo
  backdrop: `rgba(255, 0, 0, 0.1)`, // Fondo semi-transparente rojo claro
});
          this.obtenerPedidos(); // Recargar lista de pedidos
        } catch (error) {
          if (error.response?.status === 404) {
            Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "no se pudo rechazar el pedido.",
  icon: "error",
  confirmButtonText: "Aceptar"
});

          } else if (error.response?.status === 401) {

            Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "La corrupción es inevitable. ¿Fue error o fue intención?",
  icon: "error",
  confirmButtonText: "Aceptar"
});
            this.$router.push("/loginview");
          } 
          
          
          else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});



this.$router.push('/profileconfig#seccion-membership');

          }else {
            alert(error.response?.data?.error || "Ocurrido un error inesperado.");
            
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .pedidos-container {
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: var(--bg)
; color: var(--text);

  }
  
  h2 {
    text-align: center;
    color: var(--text);
  }
  
  .pedidos-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .pedidos-table th, .pedidos-table td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .pedidos-table th {
    background-color: var(--bg);
    filter: brightness(0.8);
    color: var(--text);
    font-weight: bold;

  }
  

  .pedidos-table td {
    background-color: var(--bg);

  }
  
  .pedidos-table tr:nth-child(even) {
    background-color: var(--bg);

  }
  
  .pedidos-table tr:hover {
   background-color: var(--bg);
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    margin: 5px;
  }
  .pedidos-title {
    text-align: start;
    font-size: 24px;
    margin-bottom: 20px;
   
  }
  
  .aprobar {
    background-color: #4CAF50;
  }
  
  .rechazar {
    background-color: #f44336;
  }
  
  .btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .texto-aprobado {
    color: green;
    font-weight: bold; /* Opcional: para resaltar */

    
}

.texto-pendiente {
    color: rgb(142, 127, 11);
    font-weight: bold; /* Opcional: para resaltar */

}
.texto-rechazado {
    color: rgb(255, 0, 0); /* o el color que prefieras */
    font-weight: bold; /* Opcional: para resaltar */

}
  </style>
  