<template>
  <div class=" font-sans min-h-screen"
  
  style="background-color: var(--bg);
  color: var(--text);">


    <div class=" w-full align-center flex justify-end h-8 ">
          <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  text-white font-semibold mr-10 py-1 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
    <div class="container mx-auto p-4">
      <header class="text-center mb-8">
     
      </header>

      <main>
        <section class="mb-8">
          <div class=" p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Visualización de Almacenes</h2>

            <div class="Croquis">
              <div class="warehouse-map">
                <svg viewBox="0 0 800 400" class="map-svg">
                  <!-- Fondo cuadriculado -->
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" stroke-width="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  <g
                    v-for="(warehouse, index) in warehouses"
                    :key="index"
                    @click="selectWarehouse(warehouse)"
                    style="cursor: pointer;"
                  >
                    <template v-if="warehouse.tipo === 'columns'">
                      <rect
                        :x="parseFloat(warehouse.x)"
                        :y="parseFloat(warehouse.y)"
                        :width="parseFloat(warehouse.width)"
                        :height="parseFloat(warehouse.height)"
                        :class="lineStyleClass(warehouse.stockLevel)"
                        fill="#fff"
                        stroke="#000"
                      />
                      <circle
                        v-for="n in 4"
                        :key="'circle-' + index + '-' + n"
                        :cx="warehouse.x + n * 30"
                        :cy="warehouse.y + 30"
                        r="4"
                        fill="#000"
                      />
                    </template>

                    <path
                      v-else-if="warehouse.tipo === 'l-shape'"
                      :d="warehouse.path"
                      fill="#fff"
                      stroke="#000"
                      :class="lineStyleClass(warehouse.stockLevel)"
                    />

                    <rect
                      v-else
                      :x="parseFloat(warehouse.x)"
                      :y="parseFloat(warehouse.y)"
                      :width="parseFloat(warehouse.width)"
                      :height="parseFloat(warehouse.height)"
                      :class="lineStyleClass(warehouse.stockLevel)"
                      fill="#fff"
                      stroke="#000"
                    />

                    <text
                      :x="warehouse.x + 5"
                      :y="warehouse.y - 5"
                      class="warehouse-label"
                    >
                      {{ warehouse.nombre }}
                    </text>
                  </g>

                  <!-- Dron -->
                  <image
  :x="dron.x - 12"
  :y="dron.y - 12"
  width="34"
  height="34"
  href="https://media.tenor.com/SsN_iw5_OlAAAAAi/%D0%B0%D1%8D%D1%80%D0%BE%D1%81%D1%8A%D0%B5%D0%BC%D0%BA%D0%B0-%D0%B4%D1%80%D0%BE%D0%BD.gif"
/>

                  <text :x="dron.x - 10" :y="dron.y - 20" font-size="10">V40 (Z: {{ dron.z }})</text>
                </svg>
                <button

  class="  text-white rounded-full left-1/2 transform -translate-x-1/2 bottom-[13%] absolute w-16 h-20 shadow-lg  text-2xl flex items-center justify-center "
  title="Registrar producto en almacén"
>
  +
</button>
                <button
  @click="showRegisterModal = true"
  style="background-color: var(--color-secundario);"
  class=" text-white rounded-full left-1/2 transform -translate-x-1/2 bottom-16 absolute w-14 h-14 shadow-lg hover:bg-blue-700 text-2xl flex items-center justify-center "
  title="Registrar producto en almacén"
>
  <i class="fas fa-plus"></i>
</button>
                
                  <div style="background-color: var(--color-principal);" class="mt-4  text-white p-3 rounded">
    <p>🛰️ Posición: (X: {{ dron.x }}, Y: {{ dron.y }}, Z: {{ dron.z }})</p>
    <p>📍 Zona actual: {{ zonaActual|| 'Fuera de zona' }}</p>
    <p class="text-sm text-gray-400">
      Usa A (izq), W (sube), S (baja), D (der) para mover el dron
    </p>
    
  </div>

                <!-- Modal de detalles -->
                <div v-if="selectedWarehouse" class=" modal-overlay" @click.self="selectedWarehouse = null">
                  <div class="modal">

                    <div class="flex w-full items-center justify-end" >

                      <button @click="selectedWarehouse = null" class=" bg-gray-400 text-white px-4 py-2 rounded ">Cerrar</button>

                    </div>



                    <h2>{{ selectedWarehouse.nombre.toUpperCase() }}</h2>
                    
                    <ul>
<!-- En tu modal de detalles (dentro del li que muestra los productos) -->
<li v-for="(item, i) in selectedWarehouse.productos" :key="i">
  
  {{ item.name }}
  <span v-if="item.quantity > 0">- Cantidad: {{ item.quantity }}</span>
  <span  v-else>Sin cantidad disponible</span>  

 

  
  <button 
    @click.stop="deleteProductFromWarehouse(item.stock_id, selectedWarehouse.id)"
    class="text-red-600 text-sm ml-28"

    v-if="item.quantity > 0"
    title="Eliminar producto del almacén"
  >
 <i class="fas fa-trash-alt"></i>
  </button>
</li>
                    </ul>


                    <div class="flex justify-between mt-4"> 
                      <p>Total stock: {{ selectedWarehouse.totalStock }}</p>

                      <button @click="deleteWarehouse(selectedWarehouse.id)" class="text-red-600  border border-red-600 px-4 py-2 rounded ">Eliminar almacén</button>
                    </div>

                 
                  </div>
                </div>

                <div class="legend">
                  <p><span class="legend-line solid"></span> Stock Óptimo</p>
                  <p><span class="legend-line dashed"></span> Stock Bajo</p>
                  <p><span class="legend-line thick"></span> Stock Crítico</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class=" p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-bold mb-2">Resumen del Sistema</h3>
                <p>Este sistema de visualización de almacenes proporciona una vista general del estado de stock en múltiples ubicaciones.</p>
                <p>Cada almacén está representado en un croquis, con colores que indican el nivel de stock: verde para óptimo, amarillo para bajo, y rojo para crítico.</p>
                <br>
                <p class="text-sm font-bold">Instrucciones:</p>
                <p class="text-sm">Haga clic en cualquier almacén para ver los detalles y el estado de los productos.</p>
              
              </div>
              <div class=" p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-bold mb-2">Leyenda</h3>
                <ul class="mb-4">
                  <li class="flex items-center mb-2">
                    <span class="inline-block w-4 h-4 bg-green-300 mr-2"></span> Stock Óptimo
                  </li>
                  <li class="flex items-center mb-2">
                    <span class="inline-block w-4 h-4 bg-yellow-300 mr-2"></span> Stock Bajo
                  </li>
                  <li class="flex items-center">
                    <span class="inline-block w-4 h-4 bg-red-300 mr-2"></span> Stock Crítico
                  </li>
                </ul>
             
              </div>
            </div>
          

          </div>
        </section>



        <section class="grid grid-cols-1 md:grid-cols-2 gap-4"></section>
        <!-- Modal para registrar producto -->
<div v-if="showRegisterModal" class="modal-overlay" @click.self="showRegisterModal = false">
  <div class="modal">
    <h2 class="text-lg font-bold mb-2">Registrar producto en almacén</h2>
    <label class="block mb-2 text-sm">Almacén:</label>
    <select v-model="newStock.almacen_id" class="w-full mb-3 border rounded p-2">
      <option disabled value="">Seleccione un almacén</option>
      <option v-for="w in warehouses" :value="w.id" :key="w.id">{{ w.nombre }}</option>
    </select>

    <label class="block mb-2 text-sm">Producto:</label>
    <input v-model="newStock.producto_id" class="w-full mb-3 border rounded p-2" placeholder="ID del producto" />

    <label class="block mb-2 text-sm">Cantidad:</label>
    <input v-model="newStock.cantidad" type="number" class="w-full mb-3 border rounded p-2" />

    <div class="flex justify-between mt-4">
      <button @click="registrarProducto" class="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
      <button @click="showRegisterModal = false" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
    </div>
  </div>
</div>

<div>
    <!-- Botón para abrir el modal de registro de almacén -->
    <button style="background-color: var(--color-principal);" @click="showModal = true"
   title="Registrar nuevo almacén"
    class="z-0 fixed bottom-6 right-6 text-white p-2 mb-6 rounded flex items-center gap-2 shadow-lg">
  <i class="fas fa-warehouse"></i>
  Registrar almacén
</button>

    <!-- Modal de registro de almacén -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <h2 class="text-lg font-bold mb-2">Registrar nuevo almacén</h2>
        
        <label class="block mb-2 text-sm">Nombre del almacén:</label>
        <input v-model="newWarehouse.nombre" class="w-full mb-3 border rounded p-2" placeholder="Nombre del almacén" />

        <label class="block mb-2 text-sm">Posición X:</label>
        <input v-model="newWarehouse.x" type="number" class="w-full mb-3 border rounded p-2" placeholder="Posición X" />

        <label class="block mb-2 text-sm">Posición Y:</label>
        <input v-model="newWarehouse.y" type="number" class="w-full mb-3 border rounded p-2" placeholder="Posición Y" />

        <label class="block mb-2 text-sm">Ancho:</label>
        <input v-model="newWarehouse.width" type="number" class="w-full mb-3 border rounded p-2" placeholder="Ancho del almacén" />

        <label class="block mb-2 text-sm">Alto:</label>
        <input v-model="newWarehouse.height" type="number" class="w-full mb-3 border rounded p-2" placeholder="Alto del almacén" />

        <label class="block mb-2 text-sm">Tipo de almacén:</label>
        <select v-model="newWarehouse.tipo" class="w-full mb-3 border rounded p-2">
          <option value="normal">Normal</option>
          <option value="columns">Columnas</option>
          <option value="l-shape">Forma en L</option>
        </select>

        <div class="flex justify-between mt-4">
          <button @click="registerWarehouse" class="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
          <button @click="showModal = false" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </div>
      </div>
    </div>
  </div>


      </main>

      <footer class="text-center mt-8">
        <p class="text-gray-600">&copy; 2025 Sistema de Gestión de Almacenes</p>
      </footer>
    </div>
    
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';

import Swal from 'sweetalert2';

const warehouses = ref([]);
const selectedWarehouse = ref(null);
const showRegisterModal = ref(false)

const newStock = ref({
  almacen_id: '',
  producto_id: '',
  cantidad: 1
});
const showModal = ref(false);
const newWarehouse = ref({
  nombre: '',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  tipo: 'normal',
});
const dron = ref({ x: 100, y: 100, z: 3 });

const fetchWarehouses = async () => {


  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/api/almacenes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    warehouses.value = response.data.map(warehouse => ({
      ...warehouse,
      products: warehouse.products || []
    }));
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
  confirmButtonText: "Aceptar"
});
            this.$router.push("/loginview");

          }  else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});



          } else {
            
            Swal.fire({
              title: "Corex AI- V40",
              text: "Error al cargar los almacenes. Por favor, inténtalo de nuevo más tarde.",
              icon: "error",
              confirmButtonText: "Aceptar"
            })


            
            console.error("Error al obtener los almacenes:", error);
           
        }
  }
};
const zonaActual = computed(() => {
  const zona = warehouses.value.find(w =>
    dron.value.x >= w.x &&
    dron.value.x <= w.x + w.width &&
    dron.value.y >= w.y &&
    dron.value.y <= w.y + w.height
  );
  return zona ? zona.nombre : 'Fuera de zona';
});
function checkDroneOverlap() {
  for (const warehouse of warehouses.value) {
    const x = parseFloat(warehouse.x);
    const y = parseFloat(warehouse.y);
    const w = parseFloat(warehouse.width);
    const h = parseFloat(warehouse.height);

    if (
      dron.value.x >= x &&
      dron.value.x <= x + w &&
      dron.value.y >= y &&
      dron.value.y <= y + h
    ) {
      selectedWarehouse.value = warehouse;
      return;
    }
  }

  // Si no está sobre ninguno, lo cierra
  selectedWarehouse.value = null;
}
const registrarProducto = async () => {

  const token = localStorage.getItem('token');
  try {
    await api.post('/api/stock_almacen', newStock.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    showRegisterModal.value = false
    newStock.value = { almacen_id: '', producto_id: '', cantidad: 1 }
    await fetchWarehouses()
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Producto registrado correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
    
    selectedWarehouse.value = null
  } catch (error) {

    if (error.response && error.response.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El producto ya existe en el almacén.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--color-secundario)',
      })


      return
    }
    if (error.response && error.response.status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El producto no existe en el inventario. Verifica los datos ingresados.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--color-secundario)',
      })
      return
    }



    console.error('Error registrando producto:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el producto. Por favor, inténtalo de nuevo más tarde.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
  }
}


const selectWarehouse = (warehouse) => {
  selectedWarehouse.value = warehouse;
};
const registerWarehouse = async () => {

  const token = localStorage.getItem('token');
  try {
    await api.post('/api/almacenes', newWarehouse.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Almacén registrado correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })

    showModal.value = false;
    await fetchWarehouses();
    // Puedes agregar aquí una función para actualizar la lista de almacenes o hacer cualquier otra cosa necesaria
  } catch (error) {
    console.error('Error al registrar el almacén:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el almacén. Por favor, inténtalo de nuevo más tarde.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
  }
};
const deleteWarehouse = async (warehouseId) => {
  const token = localStorage.getItem('token');

  try {
    await api.delete(`/api/almacenes/${warehouseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Almacén eliminado correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
    selectedWarehouse.value = null;
    await fetchWarehouses(); // Actualizar la lista de almacenes
  } catch (error) {
    console.error('Error al eliminar el almacén:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el almacén. Por favor, inténtalo de nuevo más tarde.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
  }
};
const deleteProductFromWarehouse = async (stockId) => {
  const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto del almacén?');
  if (!confirmDelete) return;

  const token = localStorage.getItem('token');

  try {
    await api.delete(`/api/stock_almacen/${stockId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Producto eliminado correctamente del almacén.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })

    // Vuelve a cargar todos los almacenes
    await fetchWarehouses();
    await selectWarehouse();
    window.location.reload();


    // Si el almacén actual está siendo mostrado, actualízalo también

  } catch (error) {
    console.error('Error al eliminar el producto del almacén:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el producto del almacén. Por favor, inténtalo de nuevo más tarde.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-secundario)',
    })
  }
};






function lineStyleClass(level) {
  return {
    'line-solid': level === 'high',
    'line-dashed': level === 'medium',
    'line-thick blink': level === 'low'
  };
}

onMounted(() => {
  fetchWarehouses();
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'a') dron.value.x -= 10;
    if (key === 'd') dron.value.x += 10;
    if (key === 'w') {
      dron.value.y -= 10;
      dron.value.z += 1;
    }
    if (key === 's') {
      dron.value.y += 10;
      dron.value.z = Math.max(0, dron.value.z - 1);
    }

    checkDroneOverlap();
  });
});
</script>


<style scoped>
.warehouse-map {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  position: relative;
}

.map-svg {
  width: 100%;
  height: auto;
  background-color: var(--bg);
  border: 1px solid #ccc;
}

.line-solid {
  stroke-width: 1;
  fill: rgba(0, 255, 0, 0.17);
}
.line-dashed {
  stroke-width: 1;
  stroke-dasharray: 4, 2;
  fill: rgba(153, 205, 50, 0.367);
}
.line-thick {
  stroke-width: 2;
  stroke-dasharray: 25, 25;
  
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 30rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
    stroke: rgb(255, 31, 31);
    fill: #fed7d7;
  }
  50% {
    opacity: 0.4;
    stroke: #ff4d4d;
    fill: #fca5a5;
  }
}
.blink {
  animation: blink 1s infinite;
}

.warehouse-label {
  font-size: 10px;
  fill:var(--text);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  

  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.legend {
  position: absolute;
  margin-top: -5rem;
  right: 10px;
  background: white;
  padding: 8px;
  font-size: 10px;
  border: 1px solid #ccc;
}
.legend-line {
  display: inline-block;
  width: 30px;
  height: 1px;
  margin-right: 5px;
  vertical-align: middle;
  background-color: #000;
}
.legend-line.dashed {
  border-top: 1px dashed #000;
  background: none;
}
.legend-line.thick {
  height: 2px;
}
</style>

