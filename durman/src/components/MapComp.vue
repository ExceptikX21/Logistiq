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
    <div class="container mx-auto p-0">
      <header class="text-center mb-8">
     
      </header>

      <main>
        <section class="mb-8">
          <div class=" p-2 rounded-lg shadow-md">


            <div class="Croquis">
              <div class="warehouse-map">
                <svg viewBox="0 0 800 700" class="map-svg">
                  <!-- Fondo cuadriculado -->
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-principal)" stroke-width="0.5" />
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
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open-icon lucide-package-open"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>
</button>
                
                  <div style="background-color: var(--color-principal);" class="mt-4  text-white p-3 rounded">
    <p>🛰️ Posición: (X: {{ dron.x }}, Y: {{ dron.y }}, Z: {{ dron.z }})</p>
    <p>📍 Zona actual: {{ zonaActual|| 'Fuera de zona' }}</p>
    <p class="text-sm text-gray-400">
      Usa A (izq), W (sube), S (baja), D (der) para mover el dron
    </p>
    
  </div>

<!-- Modal de detalles -->
<div
  v-if="selectedWarehouse"
  class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
  @click.self="selectedWarehouse = null"
>
  <div class="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 overflow-auto max-h-[90vh]">
    
    <!-- Header -->
    <div class="flex items-start justify-between border-b pb-4 mb-6">
      <div class="flex items-center gap-3">
        <i class="fas fa-warehouse text-blue-600 text-2xl bg-blue-100 p-2 rounded border"></i>
        <div>
          <h2 class="text-xl font-bold text-gray-800 uppercase">
            {{ selectedWarehouse.nombre }}
          </h2>
          <p class="text-sm text-gray-500">{{ selectedWarehouse.zona || 'Warehouse Zone' }}</p>
        </div>
      </div>
      <button
        @click="selectedWarehouse = null"
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition"
      >
        Cerrar
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-3 gap-6 text-center mb-8">
      <!-- Total productos -->
      <div>
        <div class="flex justify-center items-center gap-2 text-xs text-gray-600 mb-1">
          <i class=" p-1 bg-blue-100 border rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide text-blue-600 lucide-package-icon lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>
      </i>
          <span class="font-semibold">Productos</span>
        </div>
        <p class="text-lg font-bold text-blue-600"> {{ selectedWarehouse.productos.length }}</p>
      </div>

      <!-- Capacidad -->
      <div>
        <div class="flex justify-center items-center gap-2 text-xs text-gray-600 mb-1">
          <i class=" p-1 bg-blue-100 border rounded"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up h-4 w-4 text-green-600" data-lov-id="src/components/StockOverlay.tsx:57:18" data-lov-name="TrendingUp" data-component-path="src/components/StockOverlay.tsx" data-component-line="57" data-component-file="StockOverlay.tsx" data-component-name="TrendingUp" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20text-green-600%22%7D"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></i>
          <span class="font-semibold">Capacidad</span>
        </div>
        <p class="text-lg font-bold text-green-600">{{ selectedWarehouse.capacidad_maxima || '∞' }}</p>
      </div>

      <!-- Utilizado -->
      <div>
        <div class="flex justify-center items-center gap-2 text-xs text-gray-600 mb-1">
          <i class="p-1 bg-blue-100 border rounded"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-x-icon text-purple-600 lucide-package-x"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><path d="m17 13 5 5m-5 0 5-5"/></svg></i>
          <span class="font-semibold">Utilizado</span>
        </div>
        <p>
          <span
    class="inline-block px-3 py-0.5 bg-red-100 text-purple-600 text-sm font-semibold rounded-full">
    {{ selectedWarehouse.totalStock }} / {{ selectedWarehouse.capacidad_maxima || '∞' }} 
    ({{ calcularPorcentajeUso(selectedWarehouse.totalStock, selectedWarehouse.capacidad_maxima) }})
  </span>
        </p>
      </div>
    </div>

    <!-- Inventario -->
    <div>
      <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Inventario en almacén</h3>

      <div
        v-for="(item, i) in selectedWarehouse.productos"
        :key="i"
        class="bg-gray-50 border rounded-lg p-4 mb-3 shadow-sm"
      >
        <div class="flex justify-between items-center mb-1">
          <h4 class="text-gray-800 font-medium">
            {{ item.name }}
            <span
              v-if="item.categoria"
              class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
            >
              {{ item.categoria }}
            </span>
          </h4>
          <div class="flex gap-2">
  <!-- Editar -->
  <button
    v-if="item.quantity > 0"
    @click.stop="editProductInWarehouse(item.stock_id, selectedWarehouse.id)"
    class="text-blue-600 hover:text-blue-800 transition"
    title="Editar producto"
  >
    <i class="fas fa-edit"></i>
  </button>

  <!-- Eliminar -->
  <button
    v-if="item.quantity > 0"
    @click.stop="deleteProductFromWarehouse(item.stock_id, selectedWarehouse.id)"
    class="text-red-600 hover:text-red-800 transition"
    title="Eliminar producto"
  >
    <i class="fas fa-trash-alt"></i>
  </button>
</div>
<!-- Modal de edición -->
<div
  v-if="productoEditando"
  class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
  @click.self="productoEditando = null"
>
  <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
    <h3 class="text-lg font-bold mb-4">Editar producto: {{ productoEditando.name }}</h3>

    <label class="block mb-2 text-sm font-medium">Cantidad nueva</label>
    <input
      v-model="productoEditando.quantity"
      type="number"
      min="0"
      class="w-full border rounded px-3 py-2 mb-4"
    />

    <div class="flex justify-end gap-2">
      <button
        @click="productoEditando = null"
        class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >Cancelar</button>
      <button
        @click="guardarEdicionProducto"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >Guardar</button>
    </div>
  </div>
</div>


        </div>

        <p class="text-sm text-gray-600">
          Stock: 
          <span v-if="item.quantity > 0">{{ item.quantity }} / {{ selectedWarehouse.capacidad_maxima || '∞' }}</span>
          <span v-else class="text-red-500">Sin cantidad disponible</span>
        </p>

        <!-- Barra de progreso -->
        <div v-if="item.quantity && item.capacidad" class="mt-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Fill Level: {{ Math.round((item.quantity / item.capacidad) * 100) }}%</span>
            <span v-if="(item.quantity / item.capacidad) * 100 > 100" class="text-orange-600 font-semibold">
              Near Full
            </span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-2 bg-orange-500 rounded-full transition-all"
              :style="{ width: Math.min((item.quantity / item.capacidad) * 100, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center mt-8 pt-4 border-t">
      <p class="text-gray-700 font-medium">
        Total stock: {{ selectedWarehouse.totalStock }}
      </p>
      <button
        @click="deleteWarehouse(selectedWarehouse.id)"
        class="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
      >
        Eliminar almacén
      </button>
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
import { ref, onMounted, computed,watch } from 'vue';
import api from '@/services/api';


import Swal from 'sweetalert2';

const warehouses = ref([]);
const selectedWarehouse = ref(null);
const showRegisterModal = ref(false)
const productoEditando = ref(null)

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


const editProductInWarehouse = (stock_id, almacen_id) => {
  const producto = selectedWarehouse.value.productos.find(p => p.stock_id === stock_id)
  if (producto) {
    productoEditando.value = { ...producto, almacen_id } // duplicamos para no editar en vivo
  }
}


const calcularPorcentajeUso = (actual, maximo) => {
  if (!maximo || maximo === 0) return '∞%';
  const porcentaje = (actual / maximo) * 100;
  return `${porcentaje.toFixed(1)}%`; // redondea a un decimal
};
const guardarEdicionProducto = async () => {
  try {
    const {  producto_id, quantity } = productoEditando.value

    const almacen_id = selectedWarehouse.value.id

    await api.put('/api/stock_almacen', {
      almacen_id,
      producto_id,
      cantidad: quantity
    
    }
  ,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  )

    // Refrescar visualmente el valor editado
    const index = selectedWarehouse.value.productos.findIndex(
      p => p.stock_id === productoEditando.value.stock_id
    )
    if (index !== -1) {
      selectedWarehouse.value.productos[index].quantity = quantity
    }

    productoEditando.value = null
  } catch (err) {
    console.error('Error al actualizar producto:', err)
    alert('No se pudo guardar la cantidad editada')
  }
}


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


watch(selectedWarehouse, (val) => {
  console.log('Productos del almacén:', val?.productos)
})
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
  border: 1px solid var(--text);
  border-radius: 20px;
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

