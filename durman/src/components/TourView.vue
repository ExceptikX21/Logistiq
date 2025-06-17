<template>

  <div v-if="!isLoading">
  <div v-if="showTour" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6  rounded-lg shadow-lg max-w-md w-full">

        <div class="grid grid-cols-2 w-28">

            <i >              <Vue3Lottie
      style="width: 40px; height: 40px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataControl"
  :loop="true"
  :autoplay="true"
/></i>
            <h3 class="text-2xl font-semibold whitespace-nowrap">
       {{ steps[currentStep].title }}</h3>



            
        </div>
        
      <p class="mt-4 text-lg">{{ steps[currentStep].description }}</p>
      
      <div class="mt-6 flex justify-between">
        <button 
          v-if="currentStep > 0" 
          @click="prevStep" 
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-200">
          Atrás
        </button>
        <button 
          @click="nextStep" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          {{ currentStep + 1 === steps.length ? 'Empezar ' : 'Siguiente' }}
        </button>
      </div>
    </div>
  </div>

  </div>

  </template>
  
  <script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import animationDataControl from '@/assets/animaciones/5eb520b4-eee9-49f7-8a62-f40735243cb1.json'


const router = useRouter()
const route = useRoute()
const isLoading = ref(true)

const showTour = ref(true)
const currentStep = ref(0)

const steps = [
{
  title: 'Hola, Bienvenido',
  description: 'Con LogistIQ, llevar el control de tu inventario nunca fue tan fácil. Dale orden y eficiencia a tu operación.',
  route: '/'
}

,
{
  title: 'Explora tu inventario',
  description: 'Navega por todos tus productos. Encuentra, filtra, edita y mantén el control en tiempo real.',
  route: '/updateproducts'
},
  { title: 'Añade productos', description: 'Agrega productos a tu inventario con facilidad y rapidez.', route: '/productform' },
  {
  title: 'Tus aliados, tus proveedores',
  description: 'Agrega, organiza y comunica con tus proveedores desde una única plataforma.',
  route: '/proveedorview'
},
{
  title: '¿Sabes qué es lo mejor? 🌱',
  description: 'Cada clic te hace más eficiente. ',
  route: '/petall'
}

,

  
{
  title: 'Empezemos a trabajar',
  description: 'Ajusta tu traje, coordina tu misión y mantén tus datos a salvo antes del siguiente salto.',
  route: '/profileview'
}

]


onMounted(() => {
  const tourCompleted = localStorage.getItem('tourCompleted')
  if (tourCompleted === 'true') {
    showTour.value = false
  } else {
    showTour.value = true
  }
  isLoading.value = false // <-- ya terminó de cargar
})



function nextStep() {
  if (currentStep.value + 1 < steps.length) {
    currentStep.value++
    const nextRoute = steps[currentStep.value].route
    router.push(nextRoute).then(() => {
      // Espera que cambie la ruta, luego forza recarga
      nextTick(() => {
        window.location.reload()
      })
    })



    
  } 
  

  
  else {
    endTour()
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    const prevRoute = steps[currentStep.value].route
    router.push(prevRoute).then(() => {
      nextTick(() => {
        window.location.reload()
      })
    })
  }
}

function endTour() {
  showTour.value = false
  localStorage.setItem('tourCompleted', 'true')
}



// Actualiza el paso basado en la ruta actual
watch(route, (newRoute) => {
  const foundStep = steps.findIndex(step => step.route === newRoute.path)
  if (foundStep !== -1) {
    currentStep.value = foundStep
  }
}, { immediate: true })

</script>

  <style scoped>
  .tour-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .tour-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
  }
  
  .buttons {
    margin-top: 1rem;
  }
  </style>
  