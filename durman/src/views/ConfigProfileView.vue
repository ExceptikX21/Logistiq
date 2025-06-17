<template>
    <div class="min-h-screen text-gray-800 p-8 max-w-3xl mx-auto max-w-3xl"
    
    style="background-color: var(--bg); color: var(--text);"
    >
      <div class=" w-full h-8 ">
          <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
      <section class="flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div class="max-w-xl">
          <h1 class="text-1xl font-bold mb-8 mt-4 pb-2 border-b-4 " id="border-btconfig" style="border-color: var(--color-principal);">Personaliza tu perfil</h1>
          <h2 class="text-2xl font-semibold mb-2 uppercase" v-if="user">{{ user }}</h2>
          <h2 class="text-1xl font-semibold mb-2 uppercase">{{ company }}</h2>


          <p class="mb-4">
            Ajusta <span class="font-semibold rainbow-text">colores</span>, <span class="italic">fuentes</span>, <span class="font-semibold">logos</span>, etc. para reflejar tu estilo o marca. <br>Crea un entorno único que inspire y mejore tu productividad.
          </p>

          <button class="border border-principal text-principal px-4 py-2 rounded hover:bg-principal hover:text-white transition">
            📅 ¡Configúralo a tu gusto!
          </button>
        </div>

        <div style="clip-path: xywh(0 5px 100% 75% round 15% 0);
        box-shadow: outset 40px 50px 50px 100px red; ">

        <img   src="https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Illustration" class="w-48 h-auto" />

</div>
      </section>
  
      <section class="mt-12 tab-content">
  <h3 class="text-2xl font-bold mb-4">Personaliza</h3>
  <div class="flex gap-4 mb-4">
    <span 
      class="font-semibold cursor-pointer"
      :class="activeTab === 'colores' ? 'text-principal' : 'text-gray-500'"
      @click="activeTab = 'colores'"
    >
      <span class="material-symbols-outlined rainbow-text">🖥️</span>  Colores
    </span>
    <span 
      class="cursor-pointer"
      :class="activeTab === 'branding' ? 'text-principal font-semibold' : 'text-gray-500'"
      @click="activeTab = 'branding'"
    >
      ⚙️ Branding
    </span>
    <span 
      class="cursor-pointer"
      :class="activeTab === 'stock' ? 'text-principal font-semibold' : 'text-gray-500'"
      @click="activeTab = 'stock'"
    >
      📊 Stock mínimo
    </span>



    <span 
      class="cursor-pointer"
      :class="activeTab === 'fuentes' ? 'text-principal font-semibold' : 'text-gray-500'"
      @click="activeTab = 'fuentes'"
    >
      🌐 Fuentes
    </span>
  </div>

  <!-- Contenido de las pestañas -->
  <div v-if="activeTab === 'colores'">
    <h2 class="text-sm font-semibold mb-2 opacity-90">Principales</h2>
    <div class="grid grid-cols-4 md:grid-cols-2 gap-4">
      <!-- Tu contenido actual de colores -->
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <SkillBadge :label=color_primario style="border: gray solid 2px; cursor: not-allowed;" />
      <SkillBadge 
        v-for="color in coloresDisponibles" 
        :key="color"
        :label="color"
        :color="color"
        style="cursor: pointer;"
        @click="actualizarColorPrimario(color)"
        :class="{ 'border-2 border-gray-500': color_primario === color }"
      />
    </div>
    <h2 class="text-sm font-semibold mb-2 opacity-90">Secundarios</h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
      <SkillBadge :label=color_secundario style="border: gray solid 2px; cursor: not-allowed;" />
      <SkillBadge 
        v-for="color in coloresDisponiblesSecundarios" 
        :key="color"
        :label="color"
        :color="color"
        style="cursor: pointer;"
        @click="actualizarColorSecundario(color)"
        :class="{ 'border-2 border-gray-500': color_secundario === color }"
      />
    </div>
  </div>

  <!-- Pestaña de Logo -->
  <div v-if="activeTab === 'branding'" class="p-4 border rounded-lg">
    <h2 class="text-lg font-semibold mb-4">Branding web</h2>
    <!-- Aquí tu formulario/opciones para el logo -->
    <input id="logoInput" type="file" @change="handleLogoUpload" accept="image/*" class="hidden"  style="display: none;"/>
<label for="logoInput" style="background-color: var(--color-secundario);" class="cursor-pointer  hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md">
 <i class="fas fa-upload"></i>
</label>

    <div v-if="logoPreview" class="mt-4">
      <img :src="logoPreview" alt="Logo Preview" class="w-32 h-32 object-cover">
    </div>

    <p class="text-sm text-gray-500 mt-2">Sube un logo para personalizar tu aplicación.</p>
    <p class="text-xs text-gray-500 mt-2">El logo debe ser de 200x200px.</p>

    <div>
      <h2 class="text-sm font-semibold mb-2 opacity-90 mt-4">Logo Actual</h2>
      <img v-if="profile?.configuracion?.logo_url" :src="profile.configuracion.logo_url" alt="Logo Actual" class="w-16 h-16 object-cover relative left-28">
      <p v-else class="text-sm text-gray-500 mt-2">No hay logo subido.</p>
    </div>

    <div> 
      <h2 class="text-sm font-semibold mb-2 opacity-90 mt-4">Nombre de Compañia</h2>
      <input  type="text" v-model="company" name="company" class="p-2 border rounded"> <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="updateCompany"> <i class="fas fa-save"></i></button>
      <p class="text-sm text-gray-500 mt-2">Cambia el nombre de tu compañia.</p>


    </div>

  </div>

  <!-- Pestaña de Stock -->
  <div v-if="activeTab === 'stock'" class="p-4 border rounded-lg">
    <h2 class="text-lg font-semibold mb-4">Stock Minimo</h2>
    <!-- Aquí tu formulario/opciones para el stock -->
    <ActualizarStockMinimo />
  </div>
  <!-- Pestaña de Nombre -->


  <!-- Pestaña de Fuentes -->
  <div v-if="activeTab === 'fuentes'" class="p-4 border rounded-lg">
    <h2 class="text-lg font-semibold mb-4">Selección de Fuentes</h2>
    <!-- Aquí tu selector de fuentes -->
    <select v-model="fuenteSeleccionada" class="p-2 border rounded">
      <option value="Arial">Arial</option>
      <option value="Roboto">Roboto</option>
      <option value="Open Sans">Open Sans</option>
      <option value="Poppins">Poppins</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Verdana">Verdana</option>
      <option value="Helvetica">Helvetica</option>
      <option value="Georgia">Georgia</option>
      <option value="Courier New">Courier New</option>
    </select>
  </div>

  <!-- Añade más pestañas según necesites -->
</section>
  
      <section id="seccion-membership" class="mt-12">
        <h3 class="text-2xl font-bold mb-4"> <span class="textclope">🟢 </span> Plan Activo</h3>
        <div class="flex gap-4 mb-4" >
          <span
        class="font-semibold"
        :class="activeTabSub === 'basico' ? 'text-principal font-semibold' : 'text-gray-500'"
        @click="activeTabSub = 'basico'"
      >
        🕘 Basico
      </span>


      <div  :class="activeTabSub === 'standard' ? 'text-principal font-semibold' : 'text-gray-500'"
          @click="activeTabSub = 'standard'"
          >
          <span class="cursor-pointer font-semibold">★ Standard</span>
        
        
        </div>
          <div  :class="activeTabSub === 'precios' ? 'text-principal font-semibold' : 'text-gray-500'"
          @click="activeTabSub = 'precios'"
          >
          <span class="cursor-pointer font-semibold">★ Premium</span>
        
        
        </div>
        </div>
        <div v-if="activeTabSub === 'basico'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PricingPlans :includedPlans="['BASIC']" />



        </div>

        <div v-if="activeTabSub === 'precios'" class="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-20">


          <PricingPlans></PricingPlans>
        </div>
<!-- standard -->
<!-- Pestaña Premium Mejorada -->

  <!-- Card 1 -->
  <div v-if="activeTabSub === 'standard'" class=" gap-6 mt-20">
    <PricingPlans :includedPlans=" [  'BASIC','STANDARD']" />
  <!-- Botón de acción -->
  <div class="col-span-full text-center mt-6">
    <button
      @click="obtenerPlanPremium"
      class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold py-3 px-8 rounded-xl transition duration-300 shadow-lg"
    >
      Obtener Plan Premium ✨
    </button>
  </div>
</div>





      </section>
    </div>
  </template>
  
  <script setup>
  import SkillBadge from '../components/SkillBadge.vue'

  import ActualizarStockMinimo from '@/components/ActualizarStockMinimo.vue';

  import PricingPlans from '@/components/PricingPlans.vue';

  import api from '@/services/api';

import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';




const activeTabSub = ref('basico');
const activeTab = ref('colores'); // Pestaña inicial
const profile = ref(null);
const user = ref(null);
const company = ref("LogistIQ");
const color_primario = ref("#000000");
const color_secundario = ref("#000000");




onMounted(async () => {


  try {
    const response = await api.get('/api/configprofiles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    user.value = response.data?.username || 'Usuario no configurado';
    
    // Luego manejar el perfil y la empresa (que pueden ser opcionales)
    profile.value = response.data || {};
    company.value = response.data?.configuracion?.nombre_empresa || 'LogistIQ';
    color_primario.value = response.data?.configuracion?.color_primario || '#000000';
console.log(company);



    console.log(response.data);
    console.log(user.value);

  } catch (error) {
    console.error(error);
    user.value = 'Invitado';
    company.value = 'Sin empresa';
    profile.value = {};
  }
});

const coloresDisponibles = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#FFFFFF', // blanco
  '#000000', // negro
  '#FF00FF',
  '#FFD700', // dorado

 
];

const coloresDisponiblesSecundarios = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#FFFFFF', // blanco
  '#000000', // negro
  '#FF00FF',
  '#FFD700', // dorado

 
];
  

const actualizarColorPrimario = async (nuevoColor) => {
  profile.value.configuracion.color_fondo = nuevoColor;



  try {
    // 1. Actualizar el estado local
    localStorage.setItem('config', JSON.stringify(profile.value.configuracion));
    color_primario.value = nuevoColor;
    
    // 2. Enviar al backend
    await api.put('/api/configprofiles/color', {
      color_primario: nuevoColor
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('Color actualizado correctamente');
    Swal.fire({
      title: "Corex AI- V40",
      text: "Color actualizado correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "var(--color-secundario)",
    })
  } catch (error) {

    if (error.response?.status === 500) {
    Swal.fire({
                title: "Corex AI- V40",
                footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
                text: "No se pudo completar la solicitud.",
                icon: "error",
                confirmButtonText: "Aceptar"
              })
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





          }
  
    // Opcional: Revertir el cambio en el frontend si falla
   
  }
};


const handleLogoUpload = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('logo', file);


  // Aquí puedes hacer una vista previa del logo si lo deseas
  logoPreview.value = URL.createObjectURL(file);

  try {
    const response = await api.post('/api/empresa/logo', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 200) {
      logoPreview.value = URL.createObjectURL(file);
      
      Swal.fire({
        title: "Corex AI- V40",
        text: "Logo actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar"
      })
    }
    console.log('Logo actualizado:', response.data);
  } catch (error) {


    if (error.response.status === 401) {
      Swal.fire({
        title: "Corex AI- V40",
        text: "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      this.$router.push('/loginview');
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



          } 
setTimeout(() => {
  if (error.response.status === 400) {
      Swal.fire({
        title: "Corex AI- V40",
        text: "Error interno del servidor. Intenta más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
}, 1000);
    console.error('Error al subir logo:', error);
  }
};

// Función auxiliar para conversión a Base64


const logoPreview = ref(null); // Para la vista previa del logo

const fuenteSeleccionada = ref('Arial'); // Para la fuente seleccionada
// Para el color primario


const updateCompany = async () => {
  try {
    const response = await api.put('/api/configprofiles/companyname', {
      nombre_empresa: company.value
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.status === 200) {
      Swal.fire({
        title: "Corex AI- V40",
        text: "Nombre de compañia actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "var(--color-secundario)",
      })
    }
  } catch (error) {

    if  (error.response?.status === 500) {  
      Swal.fire({
        title: "Corex AI- V40",
        footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
        text: "No se pudo completar la solicitud.",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
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



          }



    console.error('Error al actualizar el nombre de la compañia:', error);
  }
};

const actualizarColorSecundario = async (nuevoColorSecundario) => {




  try {
    // 1. Actualizar el estado local
    localStorage.setItem('config', JSON.stringify(profile.value.configuracion));
    color_secundario.value = nuevoColorSecundario;
    
    // 2. Enviar al backend
    await api.put('/api/configprofiles/color', {
      
      color_secundario: nuevoColorSecundario
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('Color actualizado correctamente');
    Swal.fire({
      title: "Corex AI- V40",
      text: "Color actualizado correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "var(--color-secundario)",
    })
  } catch (error) {

    if (error.response?.status === 500) {
    Swal.fire({
                title: "Corex AI- V40",
                footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
                text: "No se pudo completar la solicitud.",
                icon: "error",
                confirmButtonText: "Aceptar"
              })
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



// this.$router.push('/profileconfig#seccion-membership');

          }
          
    // Opcional: Revertir el cambio en el frontend si falla
    // color_primario.value = valorAnterior;
  }
};
watch(() => color_primario.value, (nuevoColor) => {
  document.documentElement.style.setProperty('--color-principal', nuevoColor);
  const header = document.getElementById('app-header');
  const footer = document.getElementById('footer-app');
  const subHeader = document.getElementById('sub-header');

  
  const borderbtconfig = document.getElementById('border-btconfig'); // Reemplaza 'border-btconfig' con el ID correcto de tu elemento con la clase border-btconfig
  if (header) {
    header.style.backgroundColor = nuevoColor;
  }
  if (footer) {
    footer.style.backgroundColor = nuevoColor;
  }
  if (subHeader) {
    subHeader.style.background = 'linear-gradient(90deg, var(--color-principal) 0%, rgba(255, 255, 255, 0.8) 80%, white 100%)';
}

  if (borderbtconfig) {
    borderbtconfig.style.borderColor = nuevoColor;
  }
});


watch(() => color_secundario.value, (nuevoColorSecundario) => { 
  document.documentElement.style.setProperty('--color-secundario', nuevoColorSecundario);
  const arrow = document.getElementById('arrow-left');


  if (arrow) {
    arrow.style.borderRightColor= nuevoColorSecundario;
  }


});
  
  </script>
  
  <style scoped>
    .rainbow-text {
    background: linear-gradient(90deg, #fa5615, #EC4899, #3B82F6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
  }
  .tab-content {
  transition: opacity 0.3s ease;
}

.textclope {
  background: linear-gradient(90deg, rgb(155, 255, 155) ,var(--color-principal), rgb(31, 255, 31));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 600;
}


input, select {
  transition: border-color 0.3s ease;
  border: 2px solid #e2e8f0; /* Gray-200 */
  background-color: var(--bg) /* Gray-100 */
}

body 
  {

    background-color: var(--bg);
  }
  </style>