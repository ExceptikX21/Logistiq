<template>
          <div class=" w-full h-8 "
          
  style="background-color: var(--bg); color: var(--text);"
  >
          <a
  style="background-color: var(--bg); color: var(--text);"

  class="cursor-pointer bg-gray-600 hover:bg-gray-700  top-6 ml-10 relative text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
  <div class="flex justify-center items-center min-h-screen  "
  style="background-color: var(--bg); color: var(--text);"
  >
    
    <div class=" rounded-lg shadow-md  p-6 grid-product" >
      <!-- Botón de regreso -->


      <!-- Encabezado -->
      <div class="mb-6">
        <h1 class="text-1.9xl font-bold text-gray-500" style="text-align: start;">Agregar artículo</h1>
      </div>

      <!-- Formulario -->
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            v-model="nombre"
            placeholder="Tubo pvc solid"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          <transition name="fade">
  <div
    v-if="mostrarSugerencias"
    class="relative w-full mt-1 rounded-xl shadow-lg border border-gray-200 z-50"
  >
    <div
      v-for="(producto, index) in productosSugeridos"
      :key="index"
      @click="seleccionarProducto(producto)"
      class="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer transition-all duration-150 rounded-xl"
    >
      <img
        :src="producto.imagen || 'https://via.placeholder.com/40'"
        alt="Imagen producto"
        class="w-12 h-12 rounded-lg object-cover"
      />
      <div class="flex flex-col">
        <span class="font-semibold text-gray-800 text-sm">{{ producto.nombre }}</span>
        <span class="text-xs text-gray-500 truncate">{{ producto.descripcion }}</span>
        <span class="text-xs text-gray-400">Stock: {{ producto.cantidad }}</span>
      </div>
    </div>
  </div>
</transition>



        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Código de barras</label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              v-model="codigoBarras"
              @keydown.enter="buscarProducto"
              placeholder="||||| Escanea o ingresa el código"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <button
              @click="escanearCodigo"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
            <i class="fa-solid fa-barcode"></i>
            </button>
          </div>
        </div>

        <!-- Escáner -->
        <div v-if="escaneando" class="relative mb-4">
          <div class="absolute top-0 right-0">
            <i
              class="fa fa-window-close text-red-500 text-2xl cursor-pointer"
              @click="detenerEscaneo"
            ></i>
          </div>
          <div class="border border-gray-300 rounded-md p-4" ref="scannerContainer"></div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Agregar foto</label>
          <div class="flex items-center gap-2">
            <input
              type="file"
              @change="handleFile"
              accept="image/*"
              class="block w-full text-sm text-gray-500"
              ref="fileInput"
            />
            <button
              @click="uploadFile"

              v-show="selectedFile"
              :disabled="!selectedFile"
              class="bg-green-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
            >
              Subir Imagen
            </button>
          </div>
          <div v-if="imageUrl" class="mt-4">
            <img :src="imageUrl" alt="Vista previa" class="w-32 h-32 object-cover rounded-lg shadow-md">
          </div>
          <p v-if="uploadMessage" class="text-sm text-gray-500 mt-2">{{ uploadMessage }}</p>
        </div>

        <div class="mb-4" >
          <button style="display: none;"
            @click="generarDescripcion"
            class="bg-yellow-500 text-white px-4 py-2 rounded-md mb-2"
          >
            🧠 Generar Descripción
          </button>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
         
            v-model="descripcion"
            placeholder="Escribe los datos relevantes como fechas de modificación y entrega"
            class=" area-Txt mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Cantidad</label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              v-model="cantidad"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <button
              @click="incrementarCantidad"
              class="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              +
            </button>
            <button
              @click="decrementarCantidad"
              class="decrement bg-red-500 text-white px-4 py-2 rounded-md"
            >
              -
            </button>
          </div>
        </div>

        <div class="text-sm text-gray-500 mb-4">Cantidades de todas las tiendas</div>
        <div class="flex justify-between items-center font-bold text-lg">
          <span>TOTAL:</span>
          <span>{{ cantidad }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-center gap-4 mt-6">
        <button 
          class=" hidden bg-blue-500 text-white px-6 py-2 rounded-full" style="display: none;"
          @click="toggleScanner"
        >
          📊
        </button>
        <button
          class="ml-0 bg-blue-500 text-white px-9 py-2 rounded-full"
          @click="saveProduct"
        >
          + Añadir Producto
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Quagga from "quagga";
import api from '@/services/api';

import Swal from "sweetalert2";

export default {
  data() {
    return {
      nombre: '',
    productosSugeridos: [],
    mostrarSugerencias: false,
      codigoBarras: "",
      descripcion: "",
      cantidad: 0,
      escaneando: false,
      selectedFile: null,
      imageUrl: "",
      uploadMessage: "",
    };
  },
  methods: {
    normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')               // Separa acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .replace(/[^a-z0-9\s]/gi, '');   // Elimina caracteres especiales
  },
  async buscarSugerencias(nombre) {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('https://192.168.0.14:443/productos', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                all: true,  // Pide todos los productos, sin paginación
                nombre: nombre  // Pasa el nombre para la búsqueda de sugerencias
            }
        });

        this.productosSugeridos = response.data.products.filter(p =>
            this.normalizarTexto(p.nombre).includes(this.normalizarTexto(nombre))
        );
        this.mostrarSugerencias = this.productosSugeridos.length > 0;
    } catch (error) {
        console.error('Error al buscar productos sugeridos:', error);
    }
}
,
  seleccionarProducto(producto) {

    this.nombre = producto.nombre;
// Ajusta el nombre del campo
    this.descripcion = producto.descripcion;
    this.cantidad = producto.cantidad;
   this.mostrarSugerencias = false;

  },
    goBack() {
      this.$router.go(-1);
    },
    incrementarCantidad() {
      this.cantidad++;
    },
    decrementarCantidad() {
      if (this.cantidad > 0) this.cantidad--;
    },
    buscarProducto() {
      console.log(`Buscando producto con código: ${this.codigoBarras}`);
    },
    escanearCodigo() {
      if (this.escaneando) return;
      this.escaneando = true;
      this.$nextTick(() => {
        if (!this.$refs.scannerContainer) {
          console.error("Error: El contenedor del escáner no está disponible.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "El contenedor del escáner no está disponible.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "var(--color-secundario)",
          })
          this.escaneando = false;
          return;
        }
        this.iniciarQuagga();
      });
    },
    iniciarQuagga() {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: this.$refs.scannerContainer,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "upc_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error("Error al iniciar Quagga:", err);
            this.escaneando = false;
            return;
          }
          console.log("Quagga inicializado correctamente.");
          Quagga.start();
          Quagga.onDetected((data) => {
            this.codigoBarras = data.codeResult.code;
            console.log("Código detectado:", this.codigoBarras);
            this.detenerEscaneo();
          });
        }
      );
    },
    detenerEscaneo() {
      if (Quagga) {
        Quagga.stop();
        console.log("Escaneo detenido.");
      }
      this.escaneando = false;
    },
    toggleScanner() {
      if (this.escaneando) {
        this.detenerEscaneo();
      } else {
        this.escanearCodigo();
      }
    },
    async saveProduct() {
      
     
      try {
        const product = {
          nombre: this.nombre,
          codigoBarras: this.codigoBarras,
          descripcion: this.descripcion,
          cantidad: this.cantidad,
          imagen: this.imageUrl,
         
        };

        const response = await api.post('/api/saveproduct', product,   {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Producto guardado:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producto guardado correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--color-secundario)',
        })

        // Limpiar campos
        this.nombre = '';
        this.codigoBarras = '';
        this.descripcion = '';
        this.cantidad = 0;
        this.imageUrl = '';
        this.selectedFile = null;
        this.uploadMessage = '';

        // Limpiar el input file
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      } catch (error) {
        console.error('Error al guardar el producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el producto. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'var(--color-secundario)',
        })
      }
    },
    handleFile(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      if (!this.selectedFile) {
        console.log("Selecciona un archivo primero.");
        this.uploadMessage = "Selecciona un archivo primero.";
        return;
      }
      const formData = new FormData();
      formData.append("imageProduct", this.selectedFile);
      try {


        const token = localStorage.getItem("token");
        const response = await api.post("/imanigas/single", formData, {
          headers: { "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${token}`,
           },
        });
        this.imageUrl = response.data.imageUrl;
        this.uploadMessage = "Archivo subido correctamente";
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        this.uploadMessage = "Error al subir el archivo.";
      }
    },
  },
  watch: {
  nombre(newVal) {
    if (newVal.length > 1) {
      this.buscarSugerencias(newVal);
    } else {
      this.productosSugeridos = [];
      this.mostrarSugerencias = false;
    }
  }
}
};
</script>

<style scoped>

.grid-product {
  display: grid;
  place-items: center;
  padding: 1rem;

 
  grid-template-columns: 1fr;
  width: 100rem;
}

button {
  cursor: pointer;
  background-color:  var(--color-secundario);
} 
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}


.area-Txt{
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-secundario);
  border-radius: 4px;
  height: auto;

}
.decrement{

  background-color: rgb(210, 47, 47);
  color: white;
 
  cursor: pointer;
}

.area-Txt:focus{
  border: 5px solid #28a745;
  height: 10rem;
}

input, textarea{

  background-color: var(--bg);
  color: var(--text);
}

button {
  background-color: var(--color-secundario);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}


</style>