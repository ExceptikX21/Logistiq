<template>

  <div class="min-h-screen  flex items-center justify-center p-6"
  style="background-color: var(--bg); color: var(--text);"
  >
    
    <div class="
     rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
     
     style="background-color: var(--bg); color: var(--text);"
     >
      <div class=" w-full h-9 mb-4  align-center flex relative right-40 justify-center ">
          <a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  text-white font-semibold py-1 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>



        </div>
      <h1 class="text-3xl font-bold mb-2 ">🐾 Tu Mascota Virtual</h1>
      <h2 class="text-xl  mb-4 italic">{{ pet.nombre }}</h2>

      <!-- Mascota animada -->
      <img
        :src="svgActual"
        :alt="estadoPet"
        class="mx-auto w-40 h-30 transition-transform duration-500"
        :class="{ 'scale-105': estadoPet === 'Feliz', 'grayscale': estadoPet === 'descuidado' }"
      />

      <!-- Cambiar nombre -->
      <div class="mt-4">
        <label class="block text-sm  mb-1">Nombre:</label>
        <input
          v-model="pet.nombre"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Escribe un nombre..."
        />
      </div>

      <!-- Tipo de mascota -->
      <div class="mt-4">
        <label class="block text-sm  mb-1">Tipo de mascota:</label>
        <select
          v-model="tipoMascota"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="perro">🐶 Perro</option>
          <option value="gato">🐱 Gato</option>
        </select>
      </div>

      <!-- Estado y estadísticas -->
      <div class="mt-6 p-4 rounded-lg shadow-inner" 
      >
        <p class="text-lg font-semibold ">Estado: 
          <span
            :class="{
              'text-green-600': estadoPet === 'Feliz',
              'text-yellow-600': estadoPet === 'normal',
              'text-red-600': estadoPet === 'descuidado'
            }"
          >
            {{ estadoPet }}
          </span>
        </p>
        <p class="mt-2 ">Nivel de cuidado: {{ pet.nivelCuidado }}%</p>
        <p class="">Días activos: {{ pet.diasActivos }}</p>
      </div>

      <!-- Botón interactivo -->
      <button
        @click="acariciarPet"
        style="background-color: var(--color-principal);"
        class="mt-6 w-full py-2  text-white font-semibold rounded-xl hover:bg-pink-600 transition"
      >
        Acariciar 🖐️
      </button>
      <!-- Reiniciar mascota -->
<!-- <button
  @click="reiniciarPet"
  class="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
>
  Reiniciar mascota 🔄
</button> -->

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';



// Estado principal
const tipoMascota = ref('perro');

const pet = ref({
  nombre: 'Firulais',
  nivelCuidado: 70,
  nivelCrecimiento: 1,
  fechaUltimaConexion: '',
  diasActivos: 0,
});

const estadoPet = ref('normal');

// Función de fecha

const calcularDiasSinConexion = (ultimaFecha) => {
  const hoy = new Date(getToday());
  const ultima = new Date(ultimaFecha);
  return Math.floor((hoy - ultima) / (1000 * 60 * 60 * 24));
};

const getToday = () => new Date().toISOString().split('T')[0];

const actualizarEstadoPet = () => {
  console.log('Fecha guardada:', pet.value.fechaUltimaConexion);
console.log('Hoy:', getToday());
console.log('Días ausente:', calcularDiasSinConexion(pet.value.fechaUltimaConexion || getToday()));

  const hoy = getToday();

  // Si nunca se guardó fecha, usar hoy mismo como inicial
  if (!pet.value.fechaUltimaConexion) {
    pet.value.fechaUltimaConexion = hoy;
    pet.value.diasActivos = 1;
    return;
  }

  const diasAusente = calcularDiasSinConexion(pet.value.fechaUltimaConexion);

  pet.value.nivelCuidado -= diasAusente * 5;
  pet.value.nivelCuidado = Math.max(0, Math.min(100, pet.value.nivelCuidado + 2));

  // Sumar un solo día si no es el mismo día
  if (pet.value.fechaUltimaConexion !== hoy) {
    pet.value.diasActivos += 1;
  }

  pet.value.fechaUltimaConexion = hoy;

  if (pet.value.nivelCuidado >= 80) estadoPet.value = 'Feliz';
  else if (pet.value.nivelCuidado >= 40) estadoPet.value = 'normal';
  else estadoPet.value = 'descuidado';
};


const acariciarPet = () => {
  pet.value.nivelCuidado += 1;
  pet.value.nivelCuidado = Math.min(85, pet.value.nivelCuidado);
  actualizarEstadoPet();
};

// Inicialización
onMounted(() => {
  const guardado = localStorage.getItem('miPet');
  if (guardado) {
    const parsed = JSON.parse(guardado);
    const nombreGuardado = parsed.nombre || 'Firulais';
    Object.assign(pet.value, parsed);
    actualizarEstadoPet();
    pet.value.nombre = nombreGuardado; // <--- Esto preserva el nombre después del update
  } else {
    actualizarEstadoPet();
  }
});


// Guardado automático
watch(pet, () => {
  localStorage.setItem('miPet', JSON.stringify(pet.value));
}, { deep: true });

// Rutas de imagen
const svgPerro = {
  Feliz: '/svgs/perro_feliz.png',
  normal: '/svgs/perro_normal.png',
  descuidado: '/svgs/perro_descuidado.png'
};

const svgGato = {
  Feliz: '/svgs/gato_feliz.svg',
  normal: '/svgs/gato_normal.svg',
  descuidado: '/svgs/gato_descuidado.svg'
};

// Imagen actual dinámica
const svgActual = computed(() => {
  const tipo = tipoMascota.value;
  const estado = estadoPet.value;
  return tipo === 'perro' ? svgPerro[estado] : svgGato[estado];
});

// const reiniciarPet = () => {
//   pet.value = {
//     nombre: 'Firulais',
//     nivelCuidado: 70,
//     nivelCrecimiento: 1,
//     fechaUltimaConexion: getToday(),
//     diasActivos: 1,
//   };
//   localStorage.removeItem('miPet');
//   localStorage.setItem('miPet', JSON.stringify(pet.value));
//   actualizarEstadoPet();
// };

</script>


<style>

input, select {
  transition: border-color 0.3s ease;
  border: 2px solid #e2e8f0; /* Gray-200 */
  background-color: var(--bg) /* Gray-100 */
}
</style>