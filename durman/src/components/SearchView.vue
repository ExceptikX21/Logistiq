<template>
    <div class="search-bar" ref="searchBar">


<div class="flex ">      <Search  
          
          @click="toggleDropdown"
          color="#718096"
          :size="25"
          style="margin: 5px; cursor: pointer;"/>



          <input
      
      v-if="ShowSearch"

        type="text" 
        v-model="searchQuery" 
        @input="onInput" 
        placeholder="Buscar..." 
        class="search-input"
      /></div>


      <div v-if="showDropdown" class="dropdown"  ref="dropdown">
        <ul>
          <li v-for="route in filteredRoutes" :key="route.path">
            <router-link :to="route.path">{{ route.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { routes } from '@/router/index.js'; // Asegúrate de que las rutas estén exportadas
  
  import { Search } from 'lucide-vue-next';// Importa el componente de configuración
  export default {
    data() {
      return {
        searchQuery: '',
        showDropdown: false,
        filteredRoutes: [],
        ShowSearch: false, // Controla la visibilidad de la barra de búsqueda
      };
    },
    components: {
      Search, // Registra el componente de configuración
    }
    
    
    ,
    methods: {
      onInput() {
        this.filteredRoutes = routes.filter(route => 
          route.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.showDropdown = this.filteredRoutes.length > 0; // Muestra el dropdown si hay resultados
      },
      
      
      toggleDropdown() {
        this.ShowSearch = !this.ShowSearch;
      },
      

      
      handleClickOutside(event) {

const searchBar = this.$refs.searchBar;

const dropdown = this.$refs.dropdown;


// Verifica si el clic fue fuera de la barra de búsqueda y el dropdown

if (searchBar && !searchBar.contains(event.target) && dropdown && !dropdown.contains(event.target)) {

  this.showDropdown = false; // Cierra el dropdown

}

},
    },


    mounted() {
      // Escucha el evento de clic en el documento
      document.addEventListener('click', this.handleClickOutside);
    },

    beforeUnmount() {
      // Desescucha el evento de clic en el documento
      document.removeEventListener('click', this.handleClickOutside);
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    position: relative; /* Contenedor para el dropdown */
  }
  
  .search-input {
    padding: 5px;
    margin-bottom: 10px;
    width: 100px;
    box-sizing: border-box; /* Asegúrate de que el padding no afecte el ancho total */
    border: 1px solid #ccc;
    background-color: var(--bg); /* Fondo de la barra de búsqueda */
    margin-right: 0rem;
    border-radius: 4px;
  }
  
  .dropdown {
    position: absolute;
    top: 100%; /* Justo debajo de la barra de búsqueda */
    left: 0;
    z-index: 10; /* Asegúrate de que esté por encima del encabezado */
    background-color: white; /* Fondo del dropdown */
    border: 1px solid #ccc; /* Borde del dropdown */
    width: 100%; /* Asegúrate de que el dropdown tenga el mismo ancho que la barra de búsqueda */
  }
  
  .dropdown ul {
    list-style-type: none; /* Elimina los puntos de la lista */
    padding: 0; /* Elimina el padding */
    margin: 0; /* Elimina el margen */
  }
  
  .dropdown li {
    padding: 10px; /* Espaciado interno para los elementos de la lista */
  }
  
  .dropdown li:hover {
    background-color: #f0f0f0; /* Cambia el fondo al pasar el mouse */
  }
  </style>