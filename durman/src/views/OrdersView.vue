<template>
    <div class="bg-gray-100 dark-mode">
      <div class=" w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <router-link to="/proveedorview"><i class="fas fa-shipping-fast  opacity-75 hover:text-blue-500 transition duration-300"></i></router-link>
        
        </div>
        <h1 class="text-1xl font-bold opacity-90">Órdenes de Compra</h1>
        <div class="flex space-x-4">

          <i class="fas fa-search text-gray-800 hidden  dark:text-gray-300 hover:text-blue-500 transition duration-300"
            @click="searchOrder(searchQuery)"></i>
          <input type="text" v-model="searchQuery" placeholder="Ingresa el Nº de orden..." class="border border-gray-300 rounded-md p-2   text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
          
          
          
        </div>
      </div>
  
      <main class="pt-10 p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Tabla de órdenes -->
        <div class="col-span-1 md:col-span-3 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 overflow-x-auto">
          <table class="min-w-full" >
            <thead class="bg-gray-200 dark:bg-gray-700 whitespace-nowrap">
              <tr>
                <th class="py-2 px-4 text-left">ID</th>
                <th class="py-2 px-4 text-left">Número de Orden</th>
                <th class="py-2 px-4 text-left">Fecha</th>
                <th class="py-2 px-4 text-left">Proveedor</th>
                <th class="py-2 px-4 text-left">Estado</th>
                <th class="py-2 px-4 text-left">Total</th>
                <th class="py-2 px-4 text-left">Acción</th>
              </tr>
            </thead>
            <tbody >
              
              <tr class="border-b border-gray-200 dark:border-gray-700" v-for="orden in ordens" :key="orden.id">
               
                <td>
  {{ orden.id }}
</td>
                <td class="py-2 px-4">
                  <span>{{ orden.orderNumber }}</span>

                </td>
                
                
                <td class="py-2 px-4">
                  <span v-if="!orden.editing">{{ orden.date }}</span>
                  <input v-else v-model="orden.date" type="date" />
</td>
<td class="py-2 px-4">
  <span v-if="!orden.editing">{{ orden.supplier }}</span>
  <input v-else v-model="orden.supplier" type="text" />
</td>
<td class="py-1 px-4  font-bold  uppercase" :class="{
  'text-yellow-500': orden.status === 'pendiente',
  'text-green-500': orden.status === 'completado',
  'text-blue-500': orden.status === 'en_proceso',
  'text-red-500': orden.status === 'cancelado'
}">
  <span v-if="!orden.editing">
  {{ orden.status === 'pendiente' ? 'Pendiente' : orden.status === 'completado' ? 'Recibida' : orden.status === 'en_proceso' ? 'Enviada' : 'Cancelado' }}
    
    </span>
  <select v-else v-model="orden.status">
  <option disabled value="">Selecciona un estado</option>
  <option value="pendiente">Pendiente</option>
  <option value="completado">Recibida</option>
  <option value="en_proceso">Enviada</option>
  <option value="cancelado">Cancelada</option>
</select>


</td>
<td class="py-2 px-4">
  <span v-if="!orden.editing">{{ orden.total }}</span>
  <input v-else v-model="orden.total" type="number" />
</td>


                <td class="py-2 px-4">
                  <button  @click="selectOrder(orden)" style="background-color: var(--color-secundario);" class=" text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300">
                    Ver Detalles
                  </button>

                </td>
                <td>
                  
                  <div  v-if="rol === 'admin_pro' || rol === 'admin_basico'|| rol === 'admin_empresarial'" class="content-button">
                  <button
                    v-if="!orden.editing"
                    @click="activateEdition(orden)"
                    class="bg-green-500 mt-2 text-xs text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition duration-300"
                  >
                  <i class="fas fa-edit"></i>
                  </button>
                  <button                     v-else
                    @click="saveChanges(orden)"
                    :disabled="loading"
                  >
                    {{ loading ? "Guardando..." : "Guardar" }}
                  </button>
                  <button @click="deleteById(orden.id)" class="mt-2 bg-red-500 text-xs text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition duration-300">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                </td>
              </tr>
              <!-- Más filas aquí -->
            </tbody>
          </table>
        </div>
  
        <!-- Detalles de la orden -->
        <div v-if="selectedOrder" class="col-span-1 whitespace-nowrap md:col-span-1 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-80 flex flex-col leading-xl justify-between">
          <div class="bg-white p-4 rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-4 border-b pb-2">
    Orden #{{ selectedOrder.orderNumber }}
  </h2>
  <div class="space-y-2 ">
    <div><span class="font-bold">Proveedor:</span> {{ selectedOrder.supplier }}</div>
    <!-- Agrega más detalles aquí si necesitas -->
  </div>
</div>

        </div>
  
        <!-- Información adicional de la orden -->

  

  
        <!-- Detalles deordenos -->
        <div   class="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between">
          <div v-if="selectedOrder">
            <h2 class="text-lg font-bold mb-2">Descripción</h2>
            <p></p>
            <div v-for="(orden, index) in ordens" :key="orden.id" >

              <div v-if="index === 0">

                                           <span v-if="!orden.editing">{{ selectedOrder.details }}</span>
            <input v-else v-model="orden.details" type="text" />
              </div>

            </div>


          </div>
        </div>
                <!-- Resumen de costos y notas -->
                <div class="col-span-1 md:col-span-1 w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between">
          <div v-if="selectedOrder">
            <h2 class="text-lg font-bold mb-2">Resumen de Costos</h2>
            <p><strong>Total:</strong> {{selectedOrder.total }}</p>
            <h2 class="text-lg font-bold mb-2 mt-4">Notas</h2>
            <p>No hay notas adicionales.</p>
          </div>
        </div>
  
        <!-- Métodos de pago -->
        <div v-if="selectedOrder" class="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-bold mb-2">Métodos de Pago</h2>
            <p class="mb-2">Transferencia Bancaria</p>
            <p><strong>Fecha:</strong> {{ selectedOrder.date }}</p>

          </div>
        </div>
  
        <!-- Estado de entrega -->
        <div  class="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between">
          <div v-if="selectedOrder">
            <h2 class="text-lg font-bold mb-2">Estado de Entrega</h2>
            <p class="text-yellow-500 uppercase font-bold" >{{selectedOrder.status}}</p>
          </div>
        </div>
  
        <!-- Comentarios -->

      </main>
  
      <button class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300" @click="toggleModal">
        + Agregar Orden
      </button>
  
      <div id="modal" v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center" :class="{ hidden: !isModalOpen }">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
          <h2 class="text-xl font-bold mb-4">Nueva Orden</h2>
          <form id="orderForm" @submit.prevent="saveOrder">
            <div class="mb-4">
              <label class="block  mb-2">Número de orden </label>
              <input v-model="newOrden.orderNumber" name="orderNumber" type="text" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label class="block  mb-2"> Nombre de Proveedor o Cliente</label>
              <input v-model="newOrden.supplier" name="supplier" type="text" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label class="block  mb-2">Fecha</label>
              <input v-model="newOrden.date" name="date" type="date" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4 ">
              <label class="block  mb-2">Estado</label>
              <select style="color: black" name="status" v-model="newOrden.status" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pendiente" class="text-yellow-500">Pendiente</option>
                <option value="enviada" class="text-blue-500">Enviada</option>
                <option value="recibida" class="text-green-500">Recibida</option>
                <option value="cancelada" class="text-red-500">Cancelada</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block  mb-2">Descripcion de la orden</label>
              <input v-model="newOrden.details" name="details" type="text" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label class="block  mb-2">Total</label>
              <input v-model="newOrden.total" name="total" type="text" class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="flex justify-end">
              <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition duration-300 mr-2" @click="toggleModal">Cancelar</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import api from '@/services/api';

import Swal from 'sweetalert2';


  export default {
    data() {
      return {
        rol: localStorage.getItem("rol"),
        isModalOpen: false,
        ordens: [],
        selectedOrder: null,
        searchQuery: '',
        ordensId:"",
        orderNumber: '',

        loading: false,
        error: null,

        newOrden: {
          orderNumber: '',
          date: '',
          supplier: '',
          details: '',
          status: '',
          total: ''
        }
      };
    },
    
    methods: {

      formatFechaParaMySQL(fechaISO) {
  const fecha = fechaISO ? new Date(fechaISO) : new Date();
  if (isNaN(fecha.getTime())) return null;
  const pad = n => n.toString().padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
}
,
      
      toggleModal() {
        this.isModalOpen = !this.isModalOpen;
      },

      async fetchOrders() {
  try {

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    
    const response = await api.get('/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    this.ordens = response.data.map(order => ({
      ...order,
      date: new Date(order.date).toISOString().split('T')[0],
    }));
    
  } catch (error) {
    if (error.response?.status === 404) {
      Swal.fire({
        title: "Corex AI- V40",
        text: "No se encontraron órdenes registradas.", // Cambiar mensaje
        icon: "info",
        confirmButtonText: "Aceptar"
      });
    } else if (error.response?.status === 401) {
      Swal.fire({
        title: "0xdeadfeed",
        text: "Sesión expirada. Por favor inicie sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      this.$router.push("/loginview");
    } else if (error.response?.status === 403) {
      Swal.fire({
        title: '<i class="fa-regular fa-face-sad-cry"></i><br>0xdeadfeed',
        html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
        showConfirmButton: true,
        footer: "Ha ocurrido un error inesperado",
        confirmButtonText: "Aceptar",
        confirmButtonColor: 'var(--color-secundario)'
      });
      this.$router.push('/profileconfig#seccion-membership');
    } else {
      console.error("Error al obtener órdenes:", error.response?.data || error.message); // Cambiar mensaje
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las órdenes. Por favor intente más tarde.", // Cambiar mensaje
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
},
      async saveOrder() {
      try {
        const response = await api.post('/api/orders', 
        
        this.newOrden , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        } );
        this.ordens.push(response.data);
        Swal.fire({
          title: "Corex AI- V40",
          text: "Orden creada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: 'var(--color-principal)',
        })
        this.toggleModal();
        this.newOrden = { orderNumber: '', date: '', supplier: '', details:'' , status: '', total: '' };
      } catch (error) {
        console.error('Error creando la orden:', error);
      }
    },

    selectOrder(order) {
    this.selectedOrder = order;
  }, 

  async saveChanges(orden) {
      // Reinicia el mensaje de error

      try {
        this.loading = true; // Activa el estado de carga
        this.error = null;

        const updateData = {
  date: orden.date,
  supplier: orden.supplier, 
  details: orden.details,
  status: orden.status,
  total: orden.total,
  updated_at: this.formatFechaParaMySQL(orden.updated_at),
  

};



        const updatedOrder = await this.updateOrden(orden.id, updateData);
        orden.updated_at = updatedOrder.updated_at;

        // Desactiva el modo de edición
       orden.editing = false;

        // Actualiza elordeno en la lista con la respuesta de la API (opcional)

        console.log("Cambios guardados:", updatedOrder);
      } catch (error) {
        if (error.response?.status === 404) {

          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
            text: "Por favor, inténtalo de nuevo más tarde.",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        } else if (error.response?.status === 401) {
          Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "La corrupción es inevitable. ¿Fue error o fue intención?",
  icon: "error",
  confirmButtonText: "Aceptar",
  confirmButtonColor: 'var(--color-secundario)',

});
          this.$router.push("/loginview");

        }

        else if (error.response?.status === 409) {
          

          Swal.fire({
  title: "Corex AI- V40",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "Se ha modificado el producto por otro usuario, por favor recargue la página",
  icon: "error",
  confirmButtonText: "Aceptar"
});

        }



         else {
          alert(error.response?.data?.error || "Ocurrió un error inesperado.");
        }
        //   this.error = 'Error al guardar los cambios: ' + (error.response?.data || error.message);
        console.error("Error:", error);
      } finally {
        this.loading = false; // Desactiva el estado de carga
      }
    },

    async updateOrden(ordensId, updateData) {
      try {

        const token = localStorage.getItem("token");

        const response = await api.put(`/orders/${ordensId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        Swal.fire({
          title: "Corex AI- V40",
          text: "Orden actualizada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: 'var(--color-principal)',
        })
        console.log("Orden actualizado:", response.data);
        return response.data; // Retorna elordeno actualizado
      } catch (error) {
        console.error(
          "Error al actualizar la orden:",
          error.response?.data || error.message
        );
        throw error; // Relanza el error para manejarlo en saveChanges
      }
    },


  activateEdition(orden) {
     orden.editing = true; // Activa el modo de edición
    
    },
    async deleteById(ordensId) {

  const confirmDelete = confirm("¿Estás seguro de eliminar esta orden?");
  if (!confirmDelete) return false;

  const token = localStorage.getItem("token");

  try {
    const response = await api.delete(`/orders/${ordensId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log("Orden eliminada:", response);

    Swal.fire({
      title: "Corex AI- V40",
      text: "Orden eliminada correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: 'var(--color-principal)',
    })
    await this.fetchOrders();

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      Swal.fire({
        title: "Corex AI- V40",
        footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
        text: "Por favor, inténtalo de nuevo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    } else if (error.response?.status === 401) {

      Swal.fire({
        title: "0xdeadfeed",
        footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
        text: "La corrupción es inevitable. ¿Fue error o fue intención?",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: 'var(--color-secundario)',
      });
      this.$router.push("/loginview");
    } else {
      alert(
        error.response?.data?.error || "Ocurrió un error inesperado."
      );
    }
  }
},
async searchOrder(query) {
  if (!query) {
    await this.fetchOrders(); // Método que recupera todas las órdenes si no hay búsqueda
    return;
  }

  const token = localStorage.getItem("token");

  try {
    this.currentPage = 1;
    const response = await fetch(
      `https://192.168.0.14:443/api/orders/search?query=${encodeURIComponent(query)}&page=${this.currentPage}&limit=10`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al buscar órdenes: " + response.statusText);
    }

    const data = await response.json();

    if (data && Array.isArray(data.orders)) {
      this.ordens = data.orders.map((item) => ({
        ...item,
        editing: false,
      }));
      this.totalPages = data.totalPages;
    } else {
      console.error('Error: "orders" no es un array válido');
      this.ordens = [];
    }
  } catch (error) {
    console.error("Error al buscar órdenes:", error);
    Swal.fire({
      title: "Corex AI - V40",
      footer: "Error inesperado",
      text: "No se pudo completar la solicitud. Inténtalo más tarde.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    this.ordens = [];
  } finally {
    this.loading = false;
  }
}



    }, mounted() {
      this.fetchOrders();
    },
    watch: {
    // Observar cambios en la búsqueda y ejecutar la búsqueda
    searchQuery(newSearchValue) {
      if (newSearchValue) {
        this.searchOrder(newSearchValue); // Busca por el ID cuando hay texto
      } else {
        this.searchOrder(); // Obtiene todos todas las ordenes si no hay búsqueda
      }
    },
  },
  };
  </script>
  
  <style scoped>

  .hidden {
    display: none;
  }
  .dark-mode {
    background-color: var(--bg);
    color: var(--text);
    filter: brightness(0.9);

  }
  .dark-mode .bg-white {
    background-color:var(--bg);
    filter: brightness(0.9);
    

    
  }
  .dark-mode .text-black {
    color: #cbd5e0;
  }
  .dark-mode .border-gray-200 {
    border-color:var(--bg);
    padding: 6%;
    filter: drop-shadow(0 0 0.75rem rgba(115, 115, 115, 0.023));
    
 
  }



  .dark-mode .bg-gray-100 {
    background-color: #4a5568;
  }
  .dark-mode .bg-gray-200 {
    background-color:var(--bg);
  }
  #modal input{

    color: #4a5568;
  }

  #modal input:focus, #modal select:focus {
    border-color: #63b3ed;
    outline: none;
    color: #2d3748;
  }
 
  input{
    color: #000;
  }

  
  </style>