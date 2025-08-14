<template>

    <div class="flex min-h-screen bg-gray-50" style="background-color: var(--bg); color: var(--text);">
      
      <!-- Sidebar -->
      <aside class="w-64 border-r p-6 space-y-6">


        <div class=" w-full h-8 ">
          <a
  class="cursor-pointer  hover:bg-gray-700  text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
    style="background-color: var(--bg); color: var(--text);"
>
  ← Back
</a>



        </div>
<br>
        <span>Showing <span class="font-semibold">{{ totalItems }}</span> products</span>

        <div>
          <h2 class="font-semibold  mb-2">Categories</h2>
          <div class="space-y-2">
            <div class="space-y-2">
  <label class="block">
    <input type="checkbox" class="mr-2" value="tubo" v-model="categoriasSeleccionadas" /> Tubos
  </label>
  <label class="block">
    <input type="checkbox" class="mr-2" value="accesorios" v-model="categoriasSeleccionadas" /> Accesorios
  </label>
  <label class="block">
    <input type="checkbox" class="mr-2" value="herramientas" v-model="categoriasSeleccionadas" /> Herramientas
  </label>
</div>

          </div>
        </div>
  

  
        <div>
          <h2 class="font-semibold  mb-2">Estado de Stock</h2>
          <div class="space-y-2">
            <div class="space-y-2">
  <label class="block">
    <input type="checkbox" class="mr-2" value="stock" v-model="stockSeleccionado" /> En Stock
  </label>
  <label class="block">
    <input type="checkbox" class="mr-2" value="bajo" v-model="stockSeleccionado" />Agotado
  </label>
  <label class="block">
    <input type="checkbox" class="mr-2" value="agotado" v-model="stockSeleccionado" /> Crítico
  </label>
</div>

          </div>
        </div>
  
        <div>
          <h2 class="font-semibold  mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 rounded text-xs">wireless</span>
            <span class="px-2 py-1  rounded text-xs">audio</span>
            <span class="px-2 py-1  rounded text-xs">headphones</span>
            <span class="px-2 py-1 rounded text-xs">wearable</span>
            <span class="px-2 py-1  rounded text-xs">fitness</span>
            <span class="px-2 py-1 rounded text-xs">keyboard</span>
          </div>
        </div>
      </aside>
  
      <!-- Main Content -->
      <main class="flex-1 p-6">
        <div class="flex justify-between items-center mb-6">
            <input
  v-model="nombreBusqueda"
  type="text"
  placeholder=" | Ingrese el nombre del producto..."
  style="background-color: var(--bg); color: var(--text);"
  class="w-1/2 px-4 py-2 border rounded-md "
/>
 
          <select class="px-4 py-2 border rounded-md"
          style="background-color: var(--bg); color: var(--text);"  
          
          >
            <option>Nombre (A-Z)</option>
            <option>Nombre (Z-A)</option>
            <option>Precio (Bajo a Alto)</option>
            <option>Precio (Alto a Bajo)</option>
          </select>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Product Cards -->
          <div

          @click="verDetalle(product.id)"
          v-for="product in productosFiltrados"

            :key="product.id"
            class=" rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div class="mb-2">
              <div class="h-40  rounded mb-4 items-center justify-center">

<div class="flex items-center justify-center w-full h-full" >

    <img  :src="product.imagen || 'https://img.freepik.com/free-vector/realistic-stainless-steel-pipeline-background-pvc-plumbing_1017-51570.jpg'"  alt="Product Image" class="w-40 h-40 object-cover  rounded" />

</div>
<span  :class="[
    'text-2sm text-white px-2 py-1 rounded mt-2 relative left-60',
    product.cantidad > 10
      ? 'bg-green-600'
      : product.cantidad > 0
      ? 'bg-yellow-500'
      : 'bg-red-600'
  ]" class="text-2sm text-white bg-gray-500 px-2 py-1 rounded mt-2 relative left-60">{{ product.cantidad }}</span>

               
              </div>
              <h3 class="font-semibold  capitalize">{{ product.nombre }}</h3>
              <p class="text-sm text-gray-500">{{ product.codigoBarras }}</p>
            </div>
            <div class="flex   justify-between items-center">
              <span class="text-blue-600 font-bold">${{ product.precio }}</span>
              <div><span class="text-xs px-2 py-1 rounded bg-green-200 text-green-800" v-show="product.cantidad > 10">En Stock</span>  </div>
                
              <span class="text-xs px-2 py-1 rounded bg-red-200 text-red-800" v-show="product.cantidad === 0">Crítico ({{ product.cantidad }})</span>
              <span class="text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-800" v-show="product.cantidad > 0 && product.cantidad <= 10">Agotado ({{ product.cantidad }})</span>

            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="pagination">
          <select
            v-model="itemsPerPage"
            @change="handlePageSizeChange"
            class="page-select"
          >
            <option :value="6">6 por página</option>
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
          <div class="total-info">Total: {{ totalItems }} productos</div>
        </div>
  </template>
  
  <script>

import api from '@/services/api';

import Swal from "sweetalert2";

  export default {
    name: "InventoryDashboard",


    data() {
      return {
        products: [],
        loading: false,
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        productosSugeridos: [],
        categoriasSeleccionadas: [],
    stockSeleccionado: [],
    precioMaximo: 350,

        nombre: '',

        alertMessage: "",
        nombreBusqueda: '',
        productName: "",
        searchQuery: "",

      };
    },



    methods: {


        verDetalle(productId) {
    this.$router.push(`/producto/${productId}`);
  },
        async handlePageSizeChange() {
      this.currentPage = 1; // Reset to first page when changing page size
      await this.fetchAllProducts();
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchAllProducts();
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchAllProducts();
      }
    },
        async fetchAllProducts() {
      this.loading = true;
      try {
        // Crear una instancia de axios con la configuración base

        const token = localStorage.getItem("token");

        const response = await api.get(
          `/productos?page=${this.currentPage}&limit=${this.itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Actualizar los datos
        this.products = response.data.products;
        this.totalItems = response.data.pagination.totalProducts;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.alertMessage = response.data.alert;


        // Si la página actual es mayor que el total de páginas, ir a la última página
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
          await this.fetchAllProducts();
        }
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
            console.error("Error al actualizar el producto:", error);
           
        }
      } finally {
        this.loading = false;
      }
    },
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
        const response = await api.get('/productos', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                all: true,  // Pide todos los productos, sin paginación
                nombre: nombre  // Pasa el nombre para la búsqueda de sugerencias
            }
        });

        this.productosSugeridos = response.data.products.filter(p =>
            this.normalizarTexto(p.nombre).includes(this.normalizarTexto(nombre))
        );
        
    } catch (error) {
        console.error('Error al buscar productos sugeridos:', error);
    }
}
    
    },

    watch: {
        

        nombreBusqueda(newSearchValue) {
      if (newSearchValue) {
        this.buscarSugerencias(newSearchValue); // Busca por el ID cuando hay texto
      } else {
        this.buscarSugerencias(); // Obtiene todos los productos si no hay búsqueda
      }
    },

    },
    computed: {
  productosFiltrados() {
    const base = this.nombreBusqueda ? this.productosSugeridos : this.products;


   // Reset to first page when changing filters

    return base.filter(producto => {
      // Categoría
      const coincideCategoria =
        this.categoriasSeleccionadas.length === 0 ||
        this.categoriasSeleccionadas.includes(producto.tipo);

      // Stock
      let coincideStock = true;
      if (this.stockSeleccionado.length > 0) {
        if (producto.cantidad === 0) {
          coincideStock = this.stockSeleccionado.includes('agotado');
        } else if (producto.cantidad <= 10) {
          coincideStock = this.stockSeleccionado.includes('bajo');
        } else {
          coincideStock = this.stockSeleccionado.includes('stock');
        }
      }

      // Precio
      const coincidePrecio = producto.precio <= this.precioMaximo;

      return coincideCategoria && coincideStock && coincidePrecio;
    });
  }
}
,

    mounted() {
      this.fetchAllProducts();
    },
  };


  
  </script>
  
  <style scoped>
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
    .page-btn:hover:not(:disabled) {
        background-color: #e9ecef;
    }



.pagination select,
.pagination button {
  background-color:var(--color-secundario);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}
  </style>