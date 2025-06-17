<template>

  <div class="min-h-screen bg-red-500" style="background-color: var(--bg); color: var(--text);">

    <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  top-6 ml-10 relative text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← 
</a>

      <div class="top-bar" style="">
      <div class="right">
        <div class="search">
          <span></span>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder=" | Buscar producto por id..."
        />
      </div>
    </div>
  <div class="container" style="">

    <!-- Top Bar -->




    <div class="main-content">
      
      <!-- Left Sidebar -->
       
      <div class="left-sidebar">
        <div class="user" v-for="product in recentProducts" :key="product.id">
          <div class="info" style="font-size: 14px">
            <img
              v-if="product.imagen"
              :src="product.imagen"
              alt="Product Image"
              class="avatars"
            />
            <div class="name">{{ product.nombre }}</div>
            <div class="title">{{ product.codigoBarras }}</div>
            <div class="title editing-descrdv">
              <span>
                {{ product.descripcion }}
              </span>
            </div>

            <div class="title">Total:{{ product.cantidad }}</div>
          </div>
        </div>
      </div>
      <!-- Table -->
      <div class="table-container">


        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Detalles del producto</th>
              <th>Código de barras</th>
              <th>cantidad</th>
              <th>Image</th>
              <th>Fecha creación</th>

              <th>
                <button style="background-color: #40ad55">
                  <router-link
                    to="/productform"
                    style="
                      color: inherit;
                      font-weight: bold; /* Hereda el color del texto del padre */
                      text-decoration: none;
                    "
                  >
                    Añadir producto</router-link
                  >
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td for="productId" id="productId">{{ product.id }}</td>

              <td>
                <span v-if="!product.editing" class="namep">{{
                  product.nombre
                }}</span>
                <input
                  v-else
                  v-model="product.nombre"
                  type="text"
                  class="edit-input"
                />
              </td>
              <td class="editing-descr">
                <span v-if="!product.editing">{{ product.descripcion }}</span>
                <textarea
                  v-else
                  v-model="product.descripcion"
                  type="text"
                  class="edit-input"
                />
              </td>
              <td>
                <span>{{ product.codigoBarras }}</span>
              </td>
              <td>
                <span v-if="!product.editing">{{ product.cantidad }}</span>
                <input
                  v-else
                  v-model="product.cantidad"
                  type="number"
                  class="edit-input"
                />
              </td>
              <td>
                <img
                  class="productsImages"
                  alt="imagen producto"
                  v-if="product.imagen && !product.editing"
                  :src="product.imagen"
                />
                <div v-if="product.editing" class="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    @change="(e) => handleImageChange(product, e)"
                    class="file-input"
                  />
                  <img
                    v-if="product.imagen"
                    :src="product.imagen"
                    alt="Vista previa"
                    class="preview-image"
                  />
                </div>
              </td>
              <td>10 / 08 2003</td>
              <td>
                <div  v-if="rol === 'admin_pro' || rol === 'admin_basico'|| rol === 'admin_empresarial'" class="content-button">
                  <button
                    v-if="!product.editing"
                    @click="activateEdition(product)"
                  >
                    Modificar
                  </button>
                  <button
                    v-else
                    @click="saveChanges(product)"
                    :disabled="loading"
                  >
                    {{ loading ? "Guardando..." : "Guardar" }}
                  </button>
                  <button @click="deleteById(product.id)" style="background-color: #ad4040">
                    Eliminar
                  </button>
                </div>
                <!-- Botones dentro del bucle v-for -->
              </td>
            </tr>
          </tbody>
        </table>

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
          <div class="total-info">Total: {{ totalItems }} productos</div>
        </div>
        <div class="grid grid-cols-[40px_2fr] gap-2 ">
  <div> 
    <img src="https://i.imgur.com/RiY6XO8.png" class="w-9 h-9 rounded-full" alt="">
    </div>
   
    
    <div :class="['p-1 rounded transition-all duration-300 flex items-center mb-6 gap-2 w-full', bgClass, blinkClass]">

      <span v-if="isCritical" class="animate-bounce text-white text-xl">🔥</span>

      <div v-if="alertMessage" class="alert text-white font-bold">
      <p>{{ alertMessage }}</p>
    </div>
  </div>
</div>
        
      </div>
    </div>
    <!-- Bottom Section -->
    <div class="bottom-section" style="display: none">
      <div class="error">
        <i class="fas fa-exclamation-circle"></i>
        <span>Change a few things up and try submitting again.</span>
      </div>
    </div>
    <div class="progress-bars">
      <div class="bar">
        <div class="progress blue"></div>
      </div>
      <div class="bar">
        <div class="progress red"></div>
      </div>
    </div>
  </div>
  </div>

</template>

<style scoped>
body {
  transform-origin: top left;
  width: 125%;

  
}
.edit-input {
  width: 100%; /* Los inputs ocupan el 100% del ancho de la celda */
  box-sizing: border-box;
  padding: 5px; /* Incluye el padding en el ancho */
}

.editing-descr {
  width: 100%; /* Los inputs ocupan el 100% del ancho de la celda */
}
.editing-descrdv {
  position: relative;
  width: 100px;
  display: inline-block;
  overflow: hidden;
  display: inline-block;
}
.editing-descrdv span {
  width: 150px;
  white-space: nowrap;

  overflow: hidden;
  text-overflow: ellipsis;
}

.editing-descr textarea {
  width: 11rem;
  height: 2rem;
  box-sizing: border-box;
  padding: 5px; /* Incluye el padding en el ancho */

  border: none;
  border-radius: 4px;
  resize: none; /* Evita que el textarea sea redimensionable */
}

.editing-descr textarea:focus {
  width: 20rem;
  height: 10rem;

  white-space: normal;
  text-overflow: clip;
}

.editing-descrdv span:hover,
.editing-descrdv span:focus {
  width: 200px;
  white-space: normal;
}

.editing-descr span {
  box-sizing: border-box;

  position: relative;
  width: 8rem;
  display: inline-block;
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.editing-descr span:hover,
.editing-descr span:focus {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;

  max-width: 50rem;
}

.namep {
  color: var(--color-principal);
font-weight: bold;

text-shadow: #cccccc6f 4px 0px 20px ;
  font-size: 14px;
  white-space: nowrap;
}

button {
  background-color: var(--color-secundario);
  color: white;
  padding: 6px 16px;
  border: none;
  margin-top: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.container {
  display: flex;
  padding: 0px;
  font-size: 11.3px;

  
  

}

.productsImages {
  max-width: 100px;
  height: auto;
  display: block;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color:var(--bg);
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
  font-weight: 4rem;
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

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.file-input {
  width: 100%;
  max-width: 200px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.preview-image {
  width: 100px;
  height: auto;
  border-radius: 5px;
  object-fit: cover;
}

.top-bar,
.bottom-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  text-align: end;
}

.top-bar button,
.bottom-section button {
  background-color: #2d3748;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.top-bar .avatars img,
.left-sidebar img {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

.avatars {
  padding: 0;
  margin: 0;
  position: relative;
  top: 65px;

  left: -40px;
}

.top-bar .avatars .more {
  background-color: #e53e3e;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  text-align: start;
}


.top-bar input[type="text"] {
  background-color: rgb(141, 220, 251);
  color: rgb(0, 0, 0);
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  width: 300px;
}

.main-content {
  margin: 0%;
  margin-left: -3%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 90%;
  gap: 15px;
  transform: scale(0.9);
}

.left-sidebar{

  width: 80%;
}

.top-bar
{margin: 0;}

.table-container,
.bottom-section {
  background-color: #85b0ff17;

  padding: 16px;
  padding-top: 0;
  text-align: center;
  width: 100%;
  border-radius: 8px;
}

.left-sidebar .user {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 6px;
  border-radius: 18px;
}

.left-sidebar .user img {
  width: 50px;
  height: 50px;
  margin-right: 0px;
}

.left-sidebar {
  width: 90%;
}
.table-container{
  width: 100%;
  background-color: var(--bg);
  
  margin-left: -2%; 

}
.left-sidebar .user .info {
 background-color: var(--bg);
 color: var(--text);
  width: 110%;

  border: 2px rgb(179, 218, 245) dashed;

  display: flex;
  flex-direction: column;
}

.left-sidebar .user .info .name {
  font-weight: bold;
}

.left-sidebar .user .info .title {
  background-color: var(--bg);
 
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 9px;
  border: 1px solid #ffffff;
}

table th {
  background-color: var(--bg);
}

table tr:nth-child(even) {
  background-color:var(--bg);
}

table tr:nth-child(odd) {
  background-color: rgba(var(--bg), 0.2);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

td {
  width: 150px;
  height: 50px;
}

.pagination select,
.pagination button {
  background-color:var(--color-secundario);
  color: white;
  padding: 8px 16px;
 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-weight: bold;
}

.bottom-section .error {
  color: #e53e3e;
  display: flex;
  align-items: center;
}

.name {
  
  text-align: start;
  white-space: nowrap;
}

.info {
  position: relative;
  left: 0%;
  margin-top: 0;

  padding-bottom: 15%;
  padding-left: 60px;
  padding-right: 30px;

  text-align: start;

  div {
    width: 100%;

    display: flex;
    margin-left: 30px;
    padding-right: 0%;
  }
}

.bottom-section .error i {
  margin-right: 8px;
}

.bottom-section .tabs button {
  margin-right: 8px;
}

.progress-bars {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.progress-bars .bar {
  background-color: #4a5568;
  border-radius: 4px;
  height: 8px;
  width: 100%;
  position: relative;
}

.progress-bars .bar .progress {
  height: 100%;
  border-radius: 4px;
  position: absolute;
}

.progress-bars .bar .progress.blue {
  background-color: #4299e1;
  width: 50%;
}

.progress-bars .bar .progress.red {
  background-color: #e53e3e;
  width: 20%;
}



.alert {
  
 color: #141730;
  padding: 10px;

  margin-bottom: 20px;
}
</style>

<script>
import Swal from "sweetalert2";
import api from '@/services/api';
export default {
  data() {
    return {
      alertMessage: '',
      totalUnidades: 60, 
     rol: localStorage.getItem("rol") || '',

      notificationsEnabled: false,
      
      searchQuery: "",
      avatars: [
        "https://placehold.co/30x30",
        "https://placehold.co/30x30",
        "https://placehold.co/30x30",
      ],

      users: [
        {
          id: 1,
          name: "Warsono",
          title: "Frontend Developer",
          email: "warsono@gits.id",
          role: "Admin",
          avatar: "https://placehold.co/50x50",
        },
        {
          id: 2,
          name: "Alex Doe",
          title: "UI/UX Designer",
          email: "alex@example.com",
          role: "User",
          avatar: "https://placehold.co/50x50",
        },
        {
          id: 3,
          name: "John Doe",
          title: "Backend Developer",
          email: "john@example.com",
          role: "User",
          avatar: "https://placehold.co/50x50",
        },
        {
          id: 4,
          name: "Jane Doe",
          title: "Business Analyst",
          email: "jane@example.com",
          role: "User",
          avatar: "https://placehold.co/50x50",
        },
        {
          id: 5,
          name: "Stephanie Doe",
          title: "Product Owner",
          email: "steph@example.com",
          role: "Admin",
          avatar: "https://placehold.co/50x50",
        },
      ],

      products: [],
      loading: false,
      productId: "",
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 0,
      totalPages: 0,
    };
  },
  computed: {
    recentProducts() {
      // Ordenar los productos por ID (asumiendo que IDs más altos son más recientes) y tomar los primeros 4
      return [...this.products].sort((a, b) => b.id - a.id).slice(0, 4);
    },
    isCritical() {
      const msg = this.alertMessage?.toLowerCase() || ''
      return msg.includes('bajo') || msg.includes('alerta')
    },
    isNormal() {
      const msg = this.alertMessage?.toLowerCase() || ''
      return msg.includes('normales') || msg.includes('alerta')
    },
    bgClass() {
      if (!this.alertMessage) return ''

      const msg = this.alertMessage.toLowerCase()

      if (msg.includes('bajo')) return 'bg-red-200' 
      if (msg.includes('normales')) return 'bg-green-300 '
      if (msg.includes('error')) return 'bg-yellow-500'
      return 'bg-blue-500'
    },
    blinkClass() {
      return this.isCritical ? 'animate-pulse' : ''
    }
  },
  async created() {
    await this.fetchAllProducts();
  },
  mounted() {
//     async function llenarBaseProductos(cantidad = 5000, lote = 100) {
//   const tipos = ['tubería', 'accesorio', 'herramienta', 'válvula'];
//   const productos = [];

//   for (let i = 0; i < cantidad; i++) {
//     productos.push({
//       nombre: `Producto ${i + 1}`,
//       tipo: tipos[Math.floor(Math.random() * tipos.length)],
//       precio: (Math.random() * 100).toFixed(2),
//       cantidad: Math.floor(Math.random() * 500),
//       descripcion: `Descripción generada para el producto número ${i + 1}`,
//       codigoBarras: `123456789${i + 1}`
//     });
//   }

//   for (let i = 0; i < productos.length; i += lote) {
//     const bloque = productos.slice(i, i + lote);
//     await Promise.all(bloque.map(producto =>
//       fetch('https://192.168.0.14:443/api/saveproduct', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(producto)
//       }).catch(err => {
//         console.error(`❌ Error en producto ${producto.nombre}:`, err);
//       })
//     ));
//     console.log(`🧱 Lote ${i / lote + 1} de ${Math.ceil(cantidad / lote)} enviado`);
//   }

//   console.log(`✅ Base llena con ${cantidad} productos en bloques de ${lote}`);
// }

    
    console.log(localStorage.getItem("rol"));
    // llenarBaseProductos(500);

    
    
    console.log("Base de datos llena");
    

  },
  watch: {
    // Observar cambios en la búsqueda y ejecutar la búsqueda
    searchQuery(newSearchValue) {
      if (newSearchValue) {
        this.searchProduct(newSearchValue); // Busca por el ID cuando hay texto
      } else {
        this.searchProduct(); // Obtiene todos los productos si no hay búsqueda
      }
    },
  },


  methods: {
    formatFechaParaMySQL(fechaISO) {
    const fecha = new Date(fechaISO);
    const pad = n => n.toString().padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
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
    

    activateEdition(product) {
      product.editing = true; // Activa el modo de edición
      product.newImage = null; // Resetea la nueva imagen
    },

    async handleImageChange(product, event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("imageProduct", file);
        try {

          const token = localStorage.getItem("token");
          const response = await api.post("/imanigas/single", formData, {
            headers: { "Content-Type": "multipart/form-data", 

              Authorization: `Bearer ${token}`,
             },
          });
          product.imagen = response.data.imageUrl;
        } catch (error) {

          if (error.response?.status === 404 && !error.response?.data?.error) {
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
  confirmButtonText: "Aceptar"
});
            this.$router.push("/loginview");
          } else {
          // Maneja otros errores
            console.error(error.response?.data?.error || "Ocurrió un error inesperado.");
          }
          console.error("Error al subir la imagen:", error);
          Swal.fire({
            title: "Corex AI- V40",
            text: "Error al subir la imagen. Por favor, inténtalo de nuevo.",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        }
      }
    },
    

    async saveChanges(product) {
      // Reinicia el mensaje de error

      try {
        this.loading = true; // Activa el estado de carga
        this.error = null;

        const updateData = {
  nombre: product.nombre,
  descripcion: product.descripcion,
  cantidad: product.cantidad,
  imagen: product.imagen,
  updated_at: this.formatFechaParaMySQL(product.updated_at),
};


        // Llama a updateProduct para enviar los cambios a la API
        const updatedProduct = await this.updateProduct(product.id, updateData);

        // Desactiva el modo de edición
        product.editing = false;

        // Actualiza el producto en la lista con la respuesta de la API (opcional)

          product.updated_at = updatedProduct.updated_at;

        console.log("Cambios guardados:", updatedProduct);
      } catch (error) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
            text: "No se pudo completar la solicitud",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        } else if (error.response?.status === 401) {
          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
            text: "Tu sesión ha expirado. Vuelve a iniciar sesión",
            icon: "error",
            confirmButtonText: "Aceptar"
          })
          this.$router.push("/loginview");

        } 
        else if (error.response?.data?.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    Swal.fire({
      title: "Stock insuficiente",
      footer: "No puedes realizar una salida mayor al stock disponible.",
      text: "Intenta registrar una cantidad menor.",
      icon: "warning",
      confirmButtonText: "Entendido"
    });
    return;
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
        console.error("Error:", error);


        }
        //   this.error = 'Error al guardar los cambios: ' + (error.response?.data || error.message);



      } finally {
        this.loading = false; // Desactiva el estado de carga
      }
    },

    async updateProduct(productId, updateData) {
      try {

        const token = localStorage.getItem("token");

        const response = await api.put(`/products/${productId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

       Swal.fire({
          title: "Corex AI- V40",
          text: "Producto actualizado con éxito",
          icon: "success",
          confirmButtonText: "Aceptar"
       })
        console.log("Producto actualizado:", response.data);
        return response.data; // Retorna el producto actualizado
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
  confirmButtonText: "Aceptar"
});
            this.$router.push("/loginview");

          }    
          
          else if (error.response?.data?.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    Swal.fire({
      title: "Cantidad insuficiente",
      footer: "No puedes registrar un número menor al stock disponible ( 0 ).",
      text: "Intenta registrar una cantidad mayor a 0",
      icon: "warning",
      confirmButtonText: "Entendido"
    });
    return;
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



          } else {
            console.error("Error al actualizar el producto:", error);
           
        }
        throw error; // Relanza el error para manejarlo en saveChanges
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
  confirmButtonText: "Aceptar"
});
            this.$router.push("/loginview");

          }           else if (error.response?.status === 403) {
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

          
          else  {
            console.error(
              "Error al obtener los productos:",
              error.response?.data || error.message
            );
          }
  
      } finally {
        this.loading = false;
      }
    },
    

    async searchProduct(productId) {
      if (!productId) {
        // Si no hay un ID, obtén todos los productos
        await this.fetchAllProducts();
        return;
      }

      const api = api.create({
        baseURL: "https://192.168.0.14:443", // URL de tu backend
        withCredentials: true, // Habilita el envío de cookies o credenciales
      }
      );
      const token = localStorage.getItem("token");

      try {
        const response = await api.get(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }); // Obtiene los productos

        this.products = [response.data]; // Asigna los productos a la variable reactiva
      } catch (error) {
        console.error(
          "Error al obtener los productos:",
          error.response?.data || error.message
        );
        this.products = [];
      } finally {
        this.loading = false; // Finaliza el estado de carga
      }
    },

    async deleteById(productId) {
        productId = document.getElementById("productId").textContent;
        console.log(productId); // Verifica que el ID esté siendo capturado correctamente
        const token = localStorage.getItem("token");
      const confirmDelete = await
      Swal.fire({
        title: "Corex AI- V40",
        text: "¿Estás seguro de eliminar este producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      })
      
      
      ;

      if (confirmDelete.isConfirmed) {
        const api = api.create({
          baseURL: "https://192.168.0.14:443",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
          // URL de tu backend
          withCredentials: true,
         // Habilita el envío de cookies o credenciales
        });

        try {
        

          const response = await api.delete(`/products/${productId}`);
          console.log(response)

          Swal.fire({
            title: "Corex AI- V40",
            text: "Producto eliminado con éxito",
            icon: "success",
            confirmButtonText: "Aceptar"
          })
          await this.fetchAllProducts();

          return true + response.data;
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
        }
      } else {
        return false;
      }
    },


    
  },
};
</script>
