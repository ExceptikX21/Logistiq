
<template>

<div id="appmov" class="min-h-screen flex flex-col" style="background-color: var(--bg); color: var(--text);">



    <main class="p-6 max-w-7xl mx-auto space-y-6 flex-grow">
      <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>

      <!-- Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article
          class=" rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <p class=" text-sm mb-1">Ultimos Movimiento de Stock</p>
          <p class="font-semibold text-2xl  mb-1">{{ movimientos.length}}</p>
          <p class="text-xs">Total cargados</p>
        </article>
        <article
          class=" rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <p class=" text-sm mb-1">Productos en movimiento</p>
          <p class="font-semibold text-2xl  mb-1">{{ cantidadMovimientos }}</p>
          <p class="text-xs">Stock Total</p>
        </article>
        <article
          class=" rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <p class=" text-sm mb-1">Movimientos Criticos</p>
          <p class="font-semibold text-2xl text-red-600 mb-1">{{ stockCritico }}</p>
          <p class="text-xs">Stock Critico</p>
        </article>
      </section>

      <!-- Form -->
      <section
        class=" rounded-lg p-6 shadow-sm max-w-4xl w-full"
        aria-label="Registrar Movimiento de Stock"
      >
        <h2 class="font-semibold  mb-4 text-base">
          Registrar Movimiento de Stock
        </h2>
        <form @submit.prevent="registrarMovimiento" class="space-y-4" novalidate>
          <div>
            <label
              for="producto"
              class="block  text-sm mb-1 font-normal"
              >Producto *</label
            >
            <select  v-model="form.producto_id" class="w-full  border border-gray-300 rounded-md px-3 py-2  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
  <option disabled value="">Seleccionar producto</option>
  <option v-for="producto in productos" :key="producto.id" :value="producto.id"  class="">
    {{ producto.nombre }}
  </option>
</select>

          </div>
          <div>
            <label
              class="block  text-sm mb-1 font-normal"
              >Tipo de Movimiento *</label
            >
            <div class="flex space-x-3 max-w-md">
              <button
                type="button"
                :aria-pressed="form.tipoMovimiento === 'entrada'"
                @click="form.tipoMovimiento = 'entrada'"
                :class="[
                  'flex-1 flex items-center justify-center space-x-2 border rounded-md py-2 font-semibold text-sm focus:outline-none focus:ring-2',
                  form.tipoMovimiento === 'entrada'
                    ? 'border-green-400 text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-400'
                    : 'border-gray-300  hover:bg-gray-50 focus:ring-blue-500'
                ]"
              >
                <i class="fas fa-arrow-up-right"></i>
                <span>Entrada</span>
              </button>
              <button
                type="button"
                :aria-pressed="form.tipoMovimiento === 'salida'"
                @click="form.tipoMovimiento = 'salida'"
                :class="[
                  'flex-1 flex items-center justify-center space-x-2 border rounded-md py-2 font-semibold text-sm focus:outline-none focus:ring-2',
                  form.tipoMovimiento === 'salida'
                    ? 'border-red-400 text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-400'
                    : 'border-gray-300  hover:bg-gray-50 focus:ring-blue-500'
                ]"
              >
                <i class="fas fa-arrow-down-left"></i>
                <span>Salida</span>
              </button>
            </div>
          </div>

          <div>
            <label
              for="cantidad"
              class="block  text-sm mb-1 font-normal"
              >Cantidad *</label
            >
            <div
              class="flex items-center border border-gray-300 rounded-md overflow-hidden max-w-md"
            >
              <button
                type="button"
                aria-label="Disminuir cantidad"
                class="w-10 h-10 flex items-center justify-center hover: focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="decrementarCantidad"
              >
                <i class="fas fa-minus-circle"></i>
              </button>
              <input
                type="number"
                id="cantidad"
                v-model.number="form.cantidad"
                min="1"
                required
                class="w-full text-center  text-sm py-2 focus:outline-none"
                aria-required="true"
              />
              <button
                type="button"
                aria-label="Incrementar cantidad"
                class="w-10 h-10 flex items-center justify-center hover: focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="incrementarCantidad"
              >
                <i class="fas fa-plus-circle"></i>
              </button>
            </div>
          </div>

          <div>
            <label
              for="motivo"
              class="block  text-sm mb-1 font-normal"
              >Motivo *</label
            >
            <select
              id="motivo"
              v-model="form.motivo"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-required="true"
            >
              <option value="" disabled>Seleccionar motivo</option>
              <option
                v-for="motivo in motivos"
                :key="motivo.id"
                :value="motivo.nombre"
              >
                {{ motivo.nombre }}
              </option>
            </select>
          </div>

          <button
            type="submit"
            style="background-color: var(--color-secundario);"
            class="w-full  hover:bg-green-700 text-white font-normal text-sm py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Registrar Movimiento
          </button>
        </form>
      </section>

<p v-if="cargando">Cargando más productos...</p>
      <!-- Table -->
      <section
        class=" rounded-lg p-6 shadow-sm max-w-7xl w-full overflow-x-auto"
        aria-label="Historial de Movimientos"
      >
        <h2 class="font-semibold  mb-4 text-base">
          Historial de Movimientos
        </h2>


        <button 

  @click="borrarTodosLosProductos" 
  class="mb-4  text-center text-white text-sm px-4 py-2 rounded relative left-1/2 "

  style="background-color: var(--color-principal);"
  :disabled="movimientos.length === 0" 
>
<i class="fas fa-undo"></i> Reestaurar
</button>
        <table class="w-full text-left text-xs border-collapse">
          
          <thead class="border-b border-gray-200">
            <tr>
              
              <th class="py-2 px-3 whitespace-nowrap font-normal">FECHA</th>
              <th class="py-2 px-3 whitespace-nowrap font-normal">PRODUCTO</th>
              <th class="py-2 px-3 whitespace-nowrap font-normal">TIPO</th>
              <th class="py-2 px-3 whitespace-nowrap font-normal">CANTIDAD</th>
              <th class="py-2 px-3 whitespace-nowrap font-normal">MOTIVO</th>
              <th class="py-2 px-3 whitespace-nowrap font-normal">USUARIO</th>

            </tr>
          </thead>
          <tbody>
            <tr
v-for="(movimiento, index) in movimientos" :key="index"
              class="border-b border-gray-100"
            >
              <td class="py-3 px-3 whitespace-nowrap ">
                {{ movimiento.fecha }}
              </td>
              <td class="py-3 px-3 whitespace-nowrap font-semibold ">
                {{ obtenerNombreProducto(movimiento.producto_id) }}
              </td>
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-xs font-semibold select-none',
                    movimiento.tipo === 'entrada'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  ]"
                >
                  <i
                    :class="[
                      'fas',
                      movimiento.tipo === 'entrada'
                        ? 'fa-arrow-up-right text-green-600'
                        : 'fa-arrow-down-left text-red-600'
                    ]"
                  ></i>
                  <span>{{ movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida' }}</span>
                </span>
              </td>
              <td class="py-3 px-3 whitespace-nowrap ">
                {{ movimiento.cantidad }}
              </td>
              <td class="py-3 px-3 whitespace-nowrap ">
                {{ movimiento.motivo }}
              </td>
              <td class="py-3 px-3 whitespace-nowrap ">

                {{ movimiento.usuario }}
              </td>
            </tr>
          </tbody>
        </table>

      </section>
    </main>
    <div ref="observador" style="height: 1px"></div>

  </div>

  <button @click="resetDetenerObserverWarning" style="background-color: var(--color-principal);" class=" fixed bottom-14 left-4 text-white text-sm px-4 py-2 rounded">
  
    Restablecer carga
  
  </button>

  
</template>

  <script>

import api from '@/services/api';

import Swal from 'sweetalert2';




export default {
  name: 'MovementsInventory',
  components: {

  },
  data() {
        return {
          usuario: "Juan Pérez",
         
          cantidadMovimientos: "$24.678,90",
          paginaActual: 1,
          productosPorPagina: 10,
          stockCritico: 0,
          
          observadorInstancia: null,
          movimientosIniciales: 10,
          movimiento: "",
          fecha: "",
          productos: [
            { id: 1, nombre: "Laptop HP ProBook 450 G8" },
            { id: 2, nombre: "Teclado Logitech K380" },
            { id: 3, nombre: "Monitor Dell 24\"" },
            { id: 4, nombre: "Mouse Logitech MX Master 3" },
            { id: 5, nombre: "Impresora HP LaserJet Pro" }
          ],


    todosLosProductos: [], // toda tu lista o puedes pedirlos por página
    cargando: false,
    batchSize: 5,
    actualIndex: 0,
          motivos: [
            { id: 1, nombre: "Compra de proveedor" },
            { id: 2, nombre: "Venta a cliente" },
            { id: 3, nombre: "Devolución" },
            { id: 4, nombre: "Ajuste de inventario" }
          ],
          form: {
            producto: "",
            producto_id: null,
            tipoMovimiento: "entrada",
            cantidad: 1,
            motivo: ""
          },
          movimientos: [
           
          ]
        };
      },
      methods: {
        borrarTodosLosProductos() {
          Swal.fire({
    title: "¿Borrar productos cargados?",
    text: "Esto eliminará solo los movimientos recientes.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
    
  }).then((result) => {
    if (result.isConfirmed && this.movimientos.length > this.movimientosIniciales) {
      this.movimientos.splice(this.movimientosIniciales);
      Swal.fire("Éxito", "Productos recientes eliminados.", "success");
    }
  });
  }
,

        
cargarMas() {




  if (this.cargando) return;
  this.cargando = true;

  const nuevos = this.todosLosProductos.slice(this.actualIndex, this.actualIndex + this.batchSize);

  if (nuevos.length > 0) {
    this.movimientos.push(...nuevos);
    this.actualIndex += this.batchSize;
    this.cargando = false; // Terminé de cargar datos, oculto el mensaje
  } else {
    // No hay más datos que cargar
    this.cargando = false; // ocultar mensaje
    this.detenerObserver(); // opcional: parar observer si no hay más datos
  }
},




formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const pad = n => n.toString().padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
  },
  

  iniciarObserver() {
  // Evita múltiples observers
  if (this.observadorInstancia) return;

  const elemento = this.$refs.observador;
  if (!elemento) {
    this.movimientos = [];
    this.actualIndex = 0;
    return;
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  };

  this.observadorInstancia = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      this.cargarMas();
    }
  }, options);

  this.observadorInstancia.observe(elemento);
}


,
  resetDetenerObserverWarning() {
  localStorage.removeItem("noMostrarDetenerObserver");
  Swal.fire("Listo", "Se volverá a mostrar la advertencia.", "info");
},

  
async detenerObserver() {
  const noMostrarMensaje = localStorage.getItem("noMostrarDetenerObserver");
  if (noMostrarMensaje === "true") {
    this.desconectarObserver(); // usamos función utilitaria
    return;
  }

  const { isConfirmed, value: checkboxChecked } = await Swal.fire({
    title: "¿Deseas detener la carga automática de movimientos?",
    text: "Esto desactivará la carga automática de movimientos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, detener",
    cancelButtonText: "Cancelar",
    input: "checkbox",
    inputValue: 0,
    inputPlaceholder: "No volver a mostrar este mensaje",
    didClose: () => {
      const checkbox = Swal.getInput();
      if (checkbox && checkbox.checked) {
        localStorage.setItem("noMostrarDetenerObserver", "true");
        console.log("Preferencia guardada: No mostrar mensaje nuevamente");
      }
    }
  });

  if (checkboxChecked) {
    localStorage.setItem("noMostrarDetenerObserver", "true");
    console.log("Preferencia guardada: No mostrar mensaje nuevamente");
  }

  if (isConfirmed) {
    this.desconectarObserver();
    Swal.fire("Éxito", "Observer detenido.", "success");
  } else {
    // No hagas nada si cancela. El observer ya estaba activo.
    console.log("Cancelado, observer sigue activo.");
  }

  console.log("Valor checkbox:", checkboxChecked);
}

,

desconectarObserver() {
  if (this.observadorInstancia) {
    this.observadorInstancia.disconnect();
    this.observadorInstancia = null;
  }
}
,
        obtenerNombreProducto(id) {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Producto desconocido';
  },
        incrementarCantidad() {
          this.form.cantidad++;
        },
        decrementarCantidad() {
          if (this.form.cantidad > 1) {
            this.form.cantidad--;
          }
        },
        async registrarMovimiento() {
  try {
    const token = localStorage.getItem("token");



    if (!token) throw new Error("Token no encontrado");

    const movimiento = {
      producto_id: this.form.producto_id,
      producto: this.form.producto.nombre,
      
      tipo: this.form.tipoMovimiento,
      cantidad: this.form.cantidad,
      motivo: this.form.motivo,
    
      fecha: new Date().toISOString(),
    };

    const response = await api.post(
      'https://192.168.0.14:443/api/movimientos/create',
      movimiento,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Agrega el nuevo movimiento (ya viene con firma desde el backend)
    this.movimientos.push(response.data);

    // Limpia el formulario
    this.form = {
      producto: "",
      producto_id: null,
      tipoMovimiento: "entrada",
      cantidad: 1,
      motivo: "",
      fecha: new Date().toISOString(),
    };

    Swal.fire({
      icon: 'success',
      title: 'Movimiento registrado',
      text: 'El movimiento se ha registrado correctamente.',
      confirmButtonText: 'Aceptar'
    });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el movimiento. Intente nuevamente.',
      confirmButtonText: 'Aceptar'
    });

    console.error("Error al registrar movimiento:", error.response?.data || error.message);
  }
}
  ,


        async fetchAllProducts(nombre) {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/productos', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                all: true,  // Pide todos los productos, sin paginación
                nombre: nombre  // Pasa el nombre para la búsqueda de sugerencias
            }
        });

        this.productos = response.data.products;
        
    } catch (error) {
        console.error('Error al buscar productos sugeridos:', error);
    }
},



        async obtainMovements() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token no encontrado");

    const response = await api.get('/api/movimientos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    

    this.movimientos = response.data;

    this.stockCritico = this.movimientos.filter(movimiento => movimiento.cantidad < 5).length;
    this.cantidadMovimientos = this.movimientos.reduce((total, movimiento) => total + movimiento.cantidad, 0);


    this.movimientos.forEach(movimiento => {
      movimiento.fecha = this.formatFecha(movimiento.fecha);
    });
    console.log(this.movimientos);
  } catch (error) {


    if (error.response?.status === 404) {
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
            console.error("Error al obtener los productos:", error);
           
        }
      }
  }
}

      },
      computed: {
  productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    return this.productos.slice(inicio, inicio + this.productosPorPagina);
  }
},

      mounted() {
        
        this.fetchAllProducts("");
        
        this.obtainMovements();


        this.cargarMas();

       


    


// Simulación: cargar datos al principio
// this.todosLosProductos = Array.from({ length: 100 }, (_, i) => ({
//   fecha: new Date().toLocaleDateString(),
//   producto_id: (i % 5) + 1,
//   tipo: i % 2 === 0 ? 'entrada' : 'salida',
//   cantidad: Math.floor(Math.random() * 10 + 1),
//   motivo: this.motivos[i % this.motivos.length].nombre,
//   usuario: this.usuario
// }));

      },


      created() {
        this.iniciarObserver();
      },





      beforeRouteLeave(to, from, next) {
  this.productos = [] // Limpia la lista
  this.movimientos = []
  this.actualIndex = 0
  next()
},

      
}
  </script>

  <style scoped>

 input, select{
    background-color: var(--bg);
    color: var(--text);
  }
  </style>