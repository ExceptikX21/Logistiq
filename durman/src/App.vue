<template>

  <transition name="fade">
    <TourView class="" v-if="!$route.meta.hideTour" v-show="isTourVisible" />
  </transition>




  <div class="hiden-head" @mouseenter="showHeader" @mouseleave="hideHeader">

    <div class="header"  id="app-header" v-if="!$route.meta.hideHeader" v-show="isHeaderVisible" style="background-color: var(--color-principal);">


      <div class="butttonTogglss">
        <svg @click="toggleButton" class="mi-icono" id="ButtonT" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512">

          <path
            d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />

        </svg>


      </div>







      <div class="text-white relative flex flex-col items-center right-60 top-1">
  <h1 class="text-2xl font-bold uppercase">{{ nameCompany }}</h1>
  <p class="text-sm italic text-gray-200">Soluciones que conectan el futuro</p>
</div>



      <div class="logclass">


        <img :src="logo" alt="Logo" class="logo" />
      </div>
      <div class="arrow-left absolute " id="arrow-left"></div>
    </div>
    <div class="sub-header" id="sub-header" v-if="!$route.meta.hideHeader">


<p class="text-white">{{ pageTitle }}</p>



</div>    <div v-show="rol==='usuario_demo'  " class=" text-right bg-gray-200 " style="  color: var(--text);" id="sub-header" v-if="!$route.meta.hideHeader">


  <p class="text-gray-600 allign-left text-sm textdemo">
  Estás utilizando una cuenta de demostración con acceso limitado.
  <br>
  Para obtener acceso completo a todas las funcionalidades,solicita una cuenta personalizada  <button class="  bg-blue-500 text-white px-1 py-1 rounded-md text-sm hover:bg-green-600" @click="toggleModalAqui">Aquí</button>
</p>




</div>
  </div>
  





  <div class="header-app" id="linksDiv" :class="{ hidden: isHidden }">


    <ul>


      <li>
        <router-link to="/" @click="closeMenu">Home

        </router-link>
      </li>

      <li>

        <router-link to="/productform">

          Agregar a Inventario

        </router-link>
      </li>
      <li>

        <router-link to="/updateproducts">

          update products

        </router-link>
      </li>

      <li>

        <router-link to="/generateReports">

          generate Reports

        </router-link>
      </li>

      <li>

        <router-link to="/profileview">

          Profile

        </router-link>

      </li>
      <li>

        <router-link to="/chat-bot">

          Asitente Val4ndr0x

        </router-link>

      </li>
      <li>

        <router-link to="/proveedorview">

          proveedores

        </router-link>

      </li>
      <li>

        <router-link to="/mainview">

          Main

        </router-link>

      </li>
      <li>

        <router-link to="/almacenes">

          Almacen
        </router-link>

      </li>
      <li>

        <router-link to="/petall">
          Pets
        </router-link>

      </li>
      <li>

        <router-link to="/sellsview">
          Ventas
        </router-link>

      </li>

      <li>

        <router-link to="/cargarproductos">
         cargar
        </router-link>

      </li>
      <li>

        <router-link to="/screenl">
        LOader
        </router-link>

      </li>
      <li>

<router-link to="/callview">
llamada
</router-link>

</li>


      <li>

        <router-link to="/productslist">
          Lista de Productos
        </router-link>

      </li>
      <li>

<router-link to="/movementsinventory">

movimientos
</router-link>

</li>
<li>

<router-link to="/barcode">

barcode
</router-link>

</li>
    




    </ul>





  </div>




  <transition name="slide-fade" mode="out-in">
    <router-view :key="$route.meta.forceReload ? $route.fullPath : ''" />

  </transition>


  <div class="footer-app z-50" id ="footer-app" v-if="!$route.meta.hidefooter">


    <div v-for="(item, index) in footer.items" :key="index">

      <RouterLink  :to="item.to">
        <i  :class="item.icon"></i>




      </RouterLink>
    </div>

    <!-- <i class=""></i>
      <i class=""></i>
      <i class="fas fa-cog"></i> -->
  </div>




  <PetNotification />


</template>





<script>

// import logo from '@/assets/logo.svg'
import PetNotification from './components/PetNotification.vue';


import TourView from './components/TourView.vue';
import { useRoute } from 'vue-router';





export default {

  data() {
    return {
     
      isHidden: false,
      isHeaderVisible: false,
      isTourVisible: true,
      rol: localStorage.getItem("rol"),
      logo: "", // Logo de la configuración
      primaryColor: "", // Color primario de la configuración
      secondColor: "", // Color secundario de la configuración
      nameCompany: "LogistIQ",
      footer: {

        items: [
          { title: 'Agregar a Inventario', value: '', to: '/productform', icon: 'fas fa-box-open' },
          { title: 'Home', to: '/', icon: 'fas fa-home' },
          { title: 'Perfil', to: '/profileview', icon: 'fa-solid fa-user' },


        ],
      }

    };

  },

  components: {
    PetNotification,
    TourView
  },

  mounted() {
    
    const configRaw = localStorage.getItem("configuracion");

if (configRaw) {
  try {
    const config = JSON.parse(configRaw);
    this.logo = config.logo_url || "https://placehold.co/600x400";
    this.primaryColor = config.color_primario || "#111827";
    this.secondColor = config.color_secundario || "#006494";
    this.nameCompany = config.nombre_empresa || "LogistIQ";

    this.aplicarEstilosCliente();

  } catch (error) {
    console.error("Error al parsear la configuración:", error);
  }
} else {
  console.log("No hay configuración en localStorage");
}


    // Obtener la configuración del localStorage

},







  methods: {

    toggleModalAqui() {
      this.$router.push("/pricingview#pricing");

      
      
    },

    aplicarEstilosCliente() {
    const root = document.documentElement;
    root.style.setProperty('--color-principal', this.primaryColor);
    root.style.setProperty('--color-secundario', this.secondColor);
  },

    toggleButton() {

      const routerlinks = document.getElementById('linksDiv');

      routerlinks.style.transform = 'translateX(-110%)';

      routerlinks.offsetWidth;

      routerlinks.classList.toggle('hidden');
      this.isHidden = !this.isHidden;

      setTimeout(() => {
        routerlinks.style.transform = 'translateX(0%)'
      }, 200)
    },
    closeMenu() {
      this.isHidden = true; // Oculta el menú
    },
    showHeader() {

      this.isHeaderVisible = true;

    },

    hideHeader() {

      

      this.isHeaderVisible = false;

    },


  },

  computed  : {
    pageTitle() {

      const route = useRoute();

      return route.meta.title || 'Sin título';
    }
  }






}
</script>

<style  >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

.textdemo {
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;

  
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #2c3e50;
  margin: 0;
  margin-right: 1rem;
}

.mi-icono {

  cursor: pointer;
  top: 0;







}

/* Animación combinada de barrido vertical y fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  transform: translateY(50px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
}




body {


  padding: 0;

  background-color: var(--bg);

  margin: 0;
  overflow-x: hidden;
}

.footer-app {
  background-color: var(--color-principal);
  border-top: 1px solid #d1d5db;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;


}

.footer-app i {
  color: rgb(174, 255, 255);
  filter: drop-shadow(0 0px 6px #fffbfb2d);
}

.header-app {

  position: relative;
  position: relative;
  width: 100%;
  z-index: 2;

  display: none;



}





nav {
  margin: 5%;


}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

:root {

  --color-principal: rgb(17 24 39 / var(--tw-bg-opacity, 1));

  --bg: #F8F8FF;         /* Claro */
  --text: #1e2939;
  --text-secundario: #1a202b; /* Secundario */



  --color-secundario: #006494;
}

.dark {
  --bg: rgb(26, 26, 26)
  ;         /* Oscuro */
  --text: #f0f0f0;
  --text-secundario: #999999;
  --color-secundario: #006494;

}

.header {
  /* background: linear-gradient(90deg, rgb(13, 30, 43) 0%, rgba(255, 255, 255, 1) 100%, rgba(0, 212, 255, 1) 100%); */
  color: black;
  text-align: start;
  padding: 10px;
  display: flex;
  position: relative;


}

.logclass {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 4%;


  border-radius: 40% 40% 0 0%;

  margin-right: 2%;

}

.logo {
  opacity: 9;
  z-index: 1;
  position: relative;

  left: 3.5rem;


  height: 40px;
  /* Ajusta el tamaño según necesites */
}

.arrow-left {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  transform: scale(3.5);

  left: 55rem;
  top: 10%;
  z-index: 0;
  opacity: .5;

  border-right: 50px solid var(--color-secundario);

}

.sub-header {

  background: linear-gradient(
  90deg,
  var(--color-principal) 0%,
  rgba(255, 255, 255, 0.8) 80%,
  white 100%
);
  color: white;
  text-align: start;
  padding-right: 25%;


  margin-top: 0px;

  width: 50%;


  p {

    margin-left: 10%;
  }

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: left;
  padding-left: -50%;
  font-size: 10px;

}

.header h1 {
  width: 100%;

  position: inherit;



  color: rgb(255, 255, 255);


  text-align: center;


  display: flex;
  left: 10%;
  white-space: nowrap;
  font-size: 1.5rem;




}

.header svg {
  filter: brightness(0) invert(1);
  height: 27px;
  width: 24px;
  position: absolute;
  margin: 15px;
  margin-bottom: 0;




}

.header-app {

  transition: all 2s ease;
  margin-top: 0px;
  padding: 0;
  width: 14rem;
  height: fit-content;
  position: absolute;
  background-color: #2d3748b7;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  padding-top: 2%;
  font-weight: bold;
  font-size: 12px;

  z-index: 2;


}

.header-app a {


  text-decoration: none;
  color: rgb(252, 254, 255);

  padding: 11%;

  position: relative;

}

ul {
  text-align: start;
  display: block;
  padding: 9%;


  top: 0%;



  width: 100%;

  list-style-type: none;
  margin: 0 auto;


}

li:hover {
  background-color: var(--color-secundario);
  border-radius: 3px;
  transition: background-color 0.8s ease;
  color: rgb(54, 54, 54);
  font-weight: bold;



}


li {

  text-decoration: none;
  width: auto;


  margin-bottom: 8%;
  padding: 8%;




}


.hidden {
  z-index: 1;

  transition: transform 0.3s ease-in;





  display: block;
}
</style>
