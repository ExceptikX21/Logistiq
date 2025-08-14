<template>
  <div v-if="!route.meta.hidePet && isPetVisible"
    class="fixed bottom-12 right-4  rounded-xl shadow-lg p-4 cursor-pointer z-40" style="background-color: var(--bg); border: 1px solid var(--color-principal); 
    color: var(--text);" @mouseenter="isHovered = true" @mouseleave="resetHoverState" @click="mostrarModal">
    <div class="flex items-center space-x-2">
      <img :src="svgActual" alt="Pet" class="w-12 h-12 object-cover rounded-full transition-all duration-200" :class="{
        'grayscale': estadoPet === 'descuidado',
        'opacity-90 scale-105': isHovered && !isClicked
      }" />
      <transition name="fade">
        <div v-if="isHovered || isClicked" class="text-sm  ml-2">
          <p class="font-semibold">{{ pet.nombre }}</p>
          <p class="text-xs capitalize">{{ estadoPet }}</p>
          <p class="text-xs">Días activos: {{ pet.diasActivos }}</p>
        </div>
      </transition>
      <div @click.stop="navegarADetalles">
        <i class="fas fa-arrow-right ml-2 text-gray-600"></i>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end items-end p-4">
      <div class=" rounded-lg shadow-lg w-80"
        style="background-color: var(--bg); border: 1px solid var(--color-principal);">
        
        <!-- Header -->
        <div class="rounded-t-lg p-4 text-white flex justify-between items-center"
          style="background: linear-gradient(to right, var(--color-principal), var(--color-secundario));">
          <div class="flex items-center space-x-2">
            <img :src="svgActual" alt="Pet" class="w-10 h-10 rounded-full" />
            <div>
              <p class="text-sm font-semibold">{{ pet.nombre }}</p>
              <p class="text-xs opacity-80">¡Estamos en línea!</p>
            </div>
          </div>
          <button @click="cerrarModal" class="text-white text-xl font-bold">×</button>
        </div>

        <!-- Chat -->
        <div class="h-60 overflow-y-auto px-4 py-2 space-y-2 ">
          <div v-for="(message, index) in messages" :key="index" class="text-sm max-w-[80%] px-3 py-2 rounded-lg"
            :class="message.from === 'bot' ? 'bg-gray-200 text-left' : 'bg-blue-100 self-end ml-auto text-right'">
            {{ message.text }}
          </div>
        </div>

        <!-- Input -->
        <div class="flex items-center px-3 py-2 border-t bg-white">
          <input v-model="input" @keyup.enter="sendMessage" placeholder="Pregúntame algo..."
            class="flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none" />
          <button @click="sendMessage" class="ml-2 text-white p-2 rounded-full"
            style="background-color: var(--color-secundario);">
            <i class="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const showModal = ref(false);
const input = ref('');
const messages = ref([
  { text: '¡Hola! ¿En qué puedo ayudarte?', from: 'bot' }
]);

const isPetVisible = ref(true);
const isHovered = ref(false);
const isClicked = ref(false);

const pet = ref({
  nombre: 'Firulais',
  nivelCuidado: 70,
  diasActivos: 3
});

const tipoMascota = ref('perro'); // "gato" también soportado

const respuestas = {
  "hola": "¡Hola! ¿En qué puedo ayudarte?",
  "precio": "Puedes ver los precios en la sección de productos.",
  "stock": "Puedes consultar el stock en el panel principal.",
  "ayuda": "Claro, ¿con qué necesitas ayuda?",
  "productos": "Puedes ver todos los productos en el módulo de inventario.",
  "proveedores": "Puedes administrar proveedores desde la sección correspondiente.",
  "inventario": "La sección de inventario te permitirá ver y editar todos los productos.",
  "reporte": "Para ver reportes, dirígete al módulo de estadísticas.",
  "gracias": "¡De nada! Estoy aquí para ayudarte 😊"
};

const sendMessage = () => {
  if (!input.value.trim()) return;

  const userText = input.value.toLowerCase();
  messages.value.push({ text: input.value, from: 'user' });
  input.value = '';

  const respuesta = respuestas[userText] || 'Lo siento, no entendí eso 😅';
  setTimeout(() => {
    messages.value.push({ text: respuesta, from: 'bot' });
  }, 400);
};

const estadoPet = computed(() => {
  if (pet.value.nivelCuidado >= 80) return 'feliz';
  if (pet.value.nivelCuidado >= 40) return 'normal';
  return 'descuidado';
});

const svgPerro = {
  feliz: '/svgs/perro_feliz.png',
  normal: '/svgs/perro_normal.png',
  descuidado: '/svgs/perro_descuidado.png'
};

const svgGato = {
  feliz: '/svgs/gato_feliz.svg',
  normal: '/svgs/gato_normal.svg',
  descuidado: '/svgs/gato_descuidado.svg'
};

const svgActual = computed(() => {
  const tipo = tipoMascota.value;
  const estado = estadoPet.value;
  return tipo === 'perro' ? svgPerro[estado] : svgGato[estado];
});

const mostrarModal = () => {
  isClicked.value = true;
  showModal.value = true;
};

const cerrarModal = () => {
  isClicked.value = false;
  showModal.value = false;
};

const resetHoverState = () => {
  if (!isClicked.value) isHovered.value = false;
};

const navegarADetalles = () => {
  router.push({ name: 'detalles-mascota' });
};

// Cargar estado desde localStorage si existe
onMounted(() => {
  const savedPet = localStorage.getItem('miPet');
  if (savedPet) {
    Object.assign(pet.value, JSON.parse(savedPet));
  }
});

router.afterEach((to, from) => {
  if (from.name === 'detalles-mascota') {
    isClicked.value = false;
    isHovered.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.grayscale {
  filter: grayscale(100%);
}
</style>
