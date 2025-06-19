<template>
  <div class="min-h-screen text-gray-50 Bg-contain ">
    <main class="container mx-auto py-8 px-4">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="grid-item" v-for="(item, index) in items" :key="index">
         
          <RouterLink :to="item.to" class="grid-content">
            <!-- Primera fila: title y value -->
            <div class="title-value">
              <i :class=" ` ${item.icon}  ${item.textColor || getDefaultColor(index)}`" style="font-size: 1.8rem;"></i>
              <p class="text-lg font-semibold relative ">{{ item.title }}</p>
              <p v-if="item.value" class="text-sm text-right">{{ item.value }}</p>
            </div>
            <!-- Segunda fila: explain -->
            <p class="text-sm text-gray-700 explain">{{ item.explain }}</p>
          </RouterLink>
        </div>



        <button>

          <div class="" @click="OscureOn">
            <i class="fa-solid fa-moon text-yellow-500" style="font-size: 1.8rem;"></i>
            <p class="text-lg font-semibold text-gray-900">Modo Oscuro</p>
            <p class="text-sm text-gray-600 explain">Activa el modo oscuro para una mejor experiencia visual</p>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {



  data() {
    return {
      items: [
        { title: ' V40 -🎯 Tu asistente IA de confianza.',to:'/chat-bot', textColor: 'text-red-800',  icon: 'fa-brands fa-wolf-pack-battalion', explain: 'Añade productos y proveedores rapidamente con V40' },

        // 🔎 Consultas y visualización de inventario
  {
    title: 'Ver Inventario',
    to: '/productslist',
    textColor: 'text-green-600',
    icon: 'fa-solid fa-clipboard-list',
    explain: 'Visualiza el inventario de tu empresa',
  },


  // 📦 Productos
  {
    title: 'Escanear código de barras', 
    to: '/barcode',
    textColor: 'text-blue-600',
    icon: 'fa-solid fa-barcode',
    explain: 'Escanea códigos de barras para encontrar productos rápidamente',
  },

  // ➕ Agregar nuevos datos
  {
    title: 'Agregar a Inventario',
    to: '/productform',
    textColor: 'text-blue-600',
    icon: 'fa-solid fa-plus-square',
    explain: 'Añade nuevos productos al inventario con toda su información',
  },

  // 🔄 Actualizaciones
  {
    title: 'Productos',
    to: '/updateproducts',
    textColor: 'text-green-600',
    icon: 'fa-solid fa-pen-to-square',
    explain: 'Actualiza la información y cantidades de los productos existentes',
  },

  // 📈 Informes
  {
    title: 'Informe',
    to: '/generatereports',
    icon: 'fa-solid fa-chart-line',
    explain: 'Visualiza reportes y estadísticas sobre tu inventario',
  },

  // 📦 Movimientos y almacenes
  {
    title: 'Movimientos de Inventario',
    to: '/movementsinventory',
    icon: 'fa-solid fa-dolly',
    explain: 'Gestiona tus movimientos de inventario',
  },
  {
    title: 'Almacenes',
    to: '/almacenes',
    icon: 'fa-solid fa-warehouse',
    explain: 'Gestiona tus almacenes',
  },

  // 🤝 Proveedores y facturación
  {
    title: 'Proveedores',
    to: '/proveedorview',
    icon: 'fa-solid fa-handshake',
    explain: 'Gestiona la información de tus proveedores',
  },
  {
    title: 'Facturación Proveedor',
    to: '/orders',
    icon: 'fa-solid fa-file-invoice-dollar',
    explain: 'Gestiona las facturas de tus proveedores',
  },
  {
    title: 'Órdenes de Compra',
    to: '/pedidoview',
    icon: 'fa-solid fa-cart-shopping',
    explain: 'Gestiona tus órdenes de compra',
  },

  // 💰 Ventas
  {
    title: 'Ventas',
    to: '/sellsview',
    icon: 'fa-solid fa-cash-register',
    explain: 'Gestiona tus ventas',
  },

  // 🧑 Perfil
  {
    title: 'Perfil',
    to: '/profileview',
    icon: 'fa-solid fa-user-circle',
    explain: 'Configura tu perfil y preferencias de la aplicación',
  },

  // ⚙️ Personalización
  {
    title: 'Personalizar Aplicación',
    to: '/profileconfig',
    icon: 'fa-solid fa-sliders',
    explain: 'Personaliza la configuración de la aplicación',
  },

  // 🐾 Extras
  {
    title: 'Mascotas',
    to: '/petall',
    icon: 'fa-solid fa-paw',
    explain: 'Gestiona tus mascotas',
  },
    
        
        
       

      ],
    };
  },





methods: {



  
  getDefaultColor(index) {
      const colors = [
        'text-blue-600', 
        'text-green-600', 
        'text-red-600',
        'text-yellow-600', 
        'text-purple-600', 
        'text-indigo-600'
      ];
      return colors[index % colors.length];
    }



    ,
    OscureOn() {
      document.documentElement.style.setProperty('--bg', '#1a202c');
      document.documentElement.style.setProperty('--text', '#f7fafc');
      document.documentElement.style.setProperty('--color-secundario', '#2d3748');
    },

}



};



</script>





<style scoped>



.Bg-contain {
  background-color: var(--bg);
  color: var(--text);
  min-height: 100vh;
}


body {
  font-family: Arial, sans-serif;
 
  margin: 0px;
  padding: 0;
}
.title-value{

  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 10px;
  align-items: center;

  
}


.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 15px;

}
.grid-item {
  background-color: var(--bg);
  color: var(--text);
  border-radius: 0.5rem;
  

  padding: 1rem;
  text-align: start;
  transition: transform 0.2s ease-in-out;
  border-width: 2px; /* Grosor del borde */

    border-style: solid; /* Estilo del borde */


    border-radius: 25px; /* Radio del borde redondeado */


    margin: 4%; /* Espaciado externo */

    box-shadow: inset  0 0px 5px 5px rgba(0, 170, 255, 0.1);

}

.grid-item:hover {
  transform: translateY(-5px);
  background-color: color-mix(in srgb, var(--color-secundario) 30%, transparent);
  
}

.grid-item i {
  font-size: 1.1rem;

  padding: 25%;
  margin-bottom: 0.0rem;
}

.grid-item p {
  margin: 0.9rem 0 0;
}

a {
    color: inherit; /* Hereda el color del texto del padre */
    text-decoration: none; /* Quita el subrayado */
}

/* Estilos para los enlaces visitados */
a:visited {
    color: inherit; /* Hereda el color del texto del padre */
}

/* Estilos para el hover (opcional) */
a:hover {
    color: #42b983; /* Cambia el color al hacer hover */
}
</style>

