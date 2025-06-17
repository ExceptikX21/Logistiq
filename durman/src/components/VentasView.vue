<template>
  <div class="p-4"
  
  style="background-color: var(--bg) ; color: var(--text);"
  >

    <div class=" w-full align-center flex justify-end h-8 ">
          <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  text-white font-semibold mr-10 py-1 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
    <h1 class="text-2xl font-bold mb-4">Gestión de Ventas</h1>

    <div class="flex justify-end mb-4  ">

    <div v-if="ventas.length < 5" class="flex gap-2 start  text-white px-4 py-2 mr-2 rounded w-full">
      <img src="https://img.freepik.com/free-vector/realistic-stainless-steel-pipeline-background-pvc-plumbing_1017-51570.jpg" alt="" style="width: 30px;
height: 30px;">

      <div class="bg-red-400 text-xs w-full text-white px-4 py-2 mr-16 rounded">
        
        <span>¡Atención!</span>
        <br>
        <span>Solo has realizado un Total de {{ ventas.length }} ventas</span>
        <p>Para desbloquear todas las funciones, realiza al menos 5 ventas.</p>
      </div>


    </div>
    <div v-else  class="flex gap-2 start  text-white px-4 py-2 mr-2 rounded w-full">
      <img src="https://img.freepik.com/free-vector/realistic-stainless-steel-pipeline-background-pvc-plumbing_1017-51570.jpg" alt="" style="width: 30px;
height: 30px;">

      <div  class="bg-green-400 text-xs w-full text-white px-4 py-2 mr-16 rounded">
        
        <span>¡Felicidades!</span>
        <br>
        <span>Has realizado un Total de 15 ventas con un precio total de $ {{ precioTotal }}  </span>
        <p></p>
      </div>


    </div>

      <div class="flex gap-2">
    <input
      v-model="searchQuery"
      type="text"
      class="border border-gray-300 rounded-md p-2"
      placeholder="Ingresar ID de la venta"
    />
    <!-- <button
      @click="searchVentas(searchQuery)"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Buscar venta
    </button> -->
  </div>
    
  <button
  :class="[
    'fixed bottom-20 right-3 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg transition duration-500 ease-in-out transform hover:scale-105',
    mostrarFormulario
      ? 'bg-red-500 hover:bg-red-700'
      : 'bg-blue-500 hover:bg-blue-700',
  ]"
  @click="mostrarFormulario = !mostrarFormulario"
>
  <span v-if="mostrarFormulario">🗶 Cerrar</span>
  <span v-else>＋ Nueva</span>
</button>

</div>


    <form v-if="mostrarFormulario" @submit.prevent="guardarVenta" class="grid gap-2 mb-6">
      <input v-model="venta.fecha" type="datetime-local" class="border p-2" required/>
      <input v-model="venta.productos" placeholder="Productos" class="border p-2" required />
      <input v-model="venta.precio_total" type="number" step="0.01" placeholder="Precio total" class="border p-2" required />
      <input v-model="venta.cliente" placeholder="Cliente" class="border p-2" />
      <input v-model="venta.cantidad" type="number" placeholder="Cantidad" class="border p-2" required />
      <select v-model="venta.metodo_pago" class="border p-2">

        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>
      <button class="bg-blue-500 text-white py-2 rounded">Guardar Venta</button>
    </form>

    <div v-if="ventas.length === 0">No hay ventas registradas.</div>

    <table v-else class="w-full border-collapse border">
      <thead class="relative text-left">
        <tr 
        style="background-color: var(--bg); filter: brightness(0.8);
        border: 2px solid var(--);
        "
        
        class="  text-sm font-medium align-center">
          <th class=" p-2" >ID</th>
          <th class="border  p-2">Fecha</th>
          <th class="border p-2">Productos</th>
          <th class="border p-2">Precio</th>
          <th class="border p-2">Cliente</th>
          <th class="border p-2">Método</th>
          <th class=" p-2 "> cantidad</th>
          <th class=" p-2 place-items-center text-center flex">Acciones</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="v in ventas" :key="v.id">
          <td class="border p-2 text-center "
          style="background-color: var(--bg); filter: brightness(0.8);"
          >{{ v.id }}</td>
          <td class="border p-2">{{ formatFecha(v.fecha) }}</td>
          <td class="border p-2 "  >{{ v.productos }}</td>
          <td class="border p-2">{{ v.precio_total }}</td>
          <td class="border p-2">{{ v.cliente }}</td>
          <td class="border p-2 uppercase text-center text-yellow-800">{{ v.metodo_pago }}</td>
          <td class="border p-2">{{ v.cantidad }}</td>
          <td class="border p-2 justify-center flex flex-ce" >
            
            <div class="w-14 flex-align-center flex flex-col text-xs"> <button @click="editarVenta(v)" class="text-white bg-blue-500 py-2 px-2 gap-2 mr-2 mt-2 rounded-md"><i class="fas fa-edit"></i></button>
            <button @click="eliminarVenta(v.id)" class=" text-white bg-red-500 py-2 px-2 gap-2 mr-2  rounded-md mt-2"><i class="fa-solid fa-trash"></i></button>
          </div>
           
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination">
          <select
            v-model="itemsPerPage"
            @change="handlePageSizeChange"
            class="page-select"
          >
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
          </select>
          <div class="pages">
            <button
              @click="prevPage"
              :disabled="currentPage <= 1"
              class="page-btn"
            >
              &lt;
            </button>
            <span class="page-info"
              >Página {{ currentPage }} de {{ totalPages }}</span
            >
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="page-btn"
            >
              &gt;
            </button>
          </div>
          <div class="total-info">Total de ventas: {{ totalItems }}</div>
        </div>
</template>

<script>
import { ref, onMounted,  watch  } from 'vue'
import api from '@/services/api';

import Swal from 'sweetalert2'

import { useRouter } from 'vue-router';

const router = useRouter();

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)
const alertMessage = ref('')
const loading = ref(false)

const precioTotal = ref(0)

const formatoMoneda = precioTotal.value.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});


export default {
  name: 'VentasView',



  setup() {
const mostrarFormulario = ref(false);

const token = localStorage.getItem('token');

    const ventas = ref([])
    const venta = ref({
      id: null,
      fecha: '',
      productos: '',
      precio_total: '',
      cliente: '',
      metodo_pago: 'efectivo',
      cantidad: '',
    })

    const API_URL = 'https://192.168.0.14:443/api/ventas'

    

    const cargarVentas = async () => {
    try {
      const response = await api.get(`${API_URL}?page=${currentPage.value}&limit=${itemsPerPage.value}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      ventas.value = response.data.ventas;
      totalItems.value = response.data.pagination.totalProducts;
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
      alertMessage.value = response.data.alert;

      precioTotal.value = ventas.value.reduce((total, venta) => {
        return total + parseFloat(venta.precio_total || 0);
      }, 0);

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value;
        await cargarVentas();
      }

    } catch (error) {
      
    if (error.response?.status === 404) {
            Swal.fire({
  title: "Corex AI- V40",
  text: "No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.",
  icon: "error",
  confirmButtonText: "Aceptar"
  
            })

            
          } else if (error.response?.status === 401) {
            
            Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "La corrupción es inevitable. ¿Fue error o fue intención?",
  icon: "error",
  confirmButtonText: "Aceptar",
  didClose: () => {
    router.push('/loginview');
  }
});



          }           else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});



          } else {
            console.error("Error al actualizar el producto:", error);
           
        }
    }
  };

    const guardarVenta = async () => {
      await cargarVentas()


try {
        
  if (venta.value.id) {

        

venta.value.updated_at = formatFechaParaMySQL(venta.value.updated_at);

await api.put(`${API_URL}/${venta.value.id}`, venta.value, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
} else {
await api.post(API_URL, venta.value, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
}


venta.value = {
id: null,
fecha: '',
productos: '',
precio_total: '',
cliente: '',
metodo_pago: 'efectivo',
updated_at: '',
}

mostrarFormulario.value = false;
Swal.fire({
  title: "Venta guardada",
  text: "La venta se ha guardado correctamente.",
  icon: "success",
  confirmButtonText: "Aceptar",
  confirmButtonColor: "var(--color-secundario)",
})


  
} catch (error) {
  if (error.response?.status === 404) {
            Swal.fire({
              title: "Corex AI- V40",
              text: "No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.",
              icon: "error",
              confirmButtonText: "Aceptar"
            })
          } else if (error.response?.status === 401) {
            Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "La corrupción es inevitable. ¿Fue error o fue intención?",
  icon: "error",
  confirmButtonText: "Aceptar",
  didClose : () => {
    
    router.push('/loginview');
  }
});

          }  else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});


          }          else if (error.response?.status === 400) {
            Swal.fire({
              title: "Error al guardar la venta",
              text: error.response.data.error || "Verifica los datos ingresados.",
              icon: "error",
              confirmButtonText: "Aceptar"
            })
          } else if (error.response?.status === 500) {
            Swal
.fire({
              title: "Error del servidor",
              text: "Por favor, inténtalo de nuevo más tarde.",
              icon: "error",
              confirmButtonText: "Aceptar"
            })
          }
          
          
          else {
            alert(
              error.response?.data?.error || "Ocurrió un error inesperado."
            );
          }
  
}
      

      
    }

    const editarVenta = (v) => {

      let conf = confirm("¿Está seguro de que desea editar esta venta?");

      if (!conf) {
        return;
      }

      mostrarFormulario.value = true;

      venta.value = { ...v }
    }

    

    const eliminarVenta = async (id) => {


      let conf= confirm("¿Está seguro de que desea eliminar esta venta?");

      if (!conf) {
        return;
      }

      await api.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      await cargarVentas()
    }
    const handlePageSizeChange = async () => {
  currentPage.value = 1; // Reiniciar a la primera página
  await cargarVentas();
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await cargarVentas();
  }
};


const formatFechaParaMySQL = (fechaISO) => {

    const fecha = new Date(fechaISO);
    const pad = n => n.toString().padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
  
  
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await cargarVentas();
  }
};

    const searchQuery = ref('');
    const searchVentas = async (ventaId) => {
    loading.value = true;

    if (!ventaId) {
      await cargarVentas();
      return;
    }

    try {
      const response = await api.get(`https://192.168.0.14:443/api/ventas/${ventaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      ventas.value = [response.data];
    } catch (error) {
      console.error("Error al obtener la venta:", error.response?.data || error.message);
      ventas.value = [];
    } finally {
      loading.value = false;
    }
  };
  watch(searchQuery, (nuevoValor) => {
  searchVentas(nuevoValor);
});



    onMounted(cargarVentas)

    return {
      ventas,
    venta,
    guardarVenta,
    editarVenta,
    eliminarVenta,
    mostrarFormulario,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    alertMessage,
  handlePageSizeChange,
  prevPage,
  nextPage,
  precioTotal,
  formatoMoneda,
  searchQuery,
    searchVentas,
    loading,
    }
  },
  methods: 

  
  {  formatFecha(fechaIso) {
      const date = new Date(fechaIso);
      const fecha = date.toLocaleDateString("es-ES"); // Formato de fecha en español
      const hora = date.toLocaleTimeString("es-ES", { hour12: false }); // Hora en formato 24 horas
      return `${fecha} ${hora}`; // Retorna la fecha y la hora juntas
    },

    


  },
  
}
</script>

<style scoped>
.bg-green-400{
  background-color: #28a74672;
  color: var(--text);

}

table th,
table td {
  text-align: left;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.page-select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.pages {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.total-info {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}




</style>
