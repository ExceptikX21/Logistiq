<template>

<a
  class="cursor-pointer bg-gray-600 hover:bg-gray-700  top-6 ml-10 relative text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
  @click="$router.go(-1)"
>
  ← Back
</a>

<div
  v-if="producto"
  class="max-w-5xl mx-auto mt-12 p-8 rounded-3xl mb-12 shadow-2xl border border-zinc-200"
  style="background-color: var(--bg); color: var(--text);"
>
  <div class="grid md:grid-cols-2 gap-10">
    <!-- Galería de imágenes -->
    <div class="flex justify-center items-center">
      <img
        :src="producto.imagen || 'https://img.freepik.com/free-vector/realistic-stainless-steel-pipeline-background-pvc-plumbing_1017-51570.jpg'"
        alt="Imagen del producto"
        class="w-80 h-80 rounded-2xl object-cover shadow-lg ring-1 ring-zinc-300"
      />
    </div>

    <!-- Información del producto -->
    <div class="flex flex-col justify-between">
      <div>
        <h1 class="text-4xl font-bold tracking-tight capitalize mb-4 text-zinc-800">
          {{ producto.nombre }}
        </h1>

        <div class="flex items-center gap-3 mb-6 text-zinc-600">
          <span class="text-lg font-semibold text-yellow-500">🎫 {{ producto.id }}</span>
          <span class="text-sm">(ID del producto)</span>
        </div>

        <p class="text-base leading-relaxed mb-6 text-zinc-700">
          {{ producto.descripcion }}
        </p>

        <div class="grid grid-cols-1 gap-y-3 text-sm text-zinc-700">
          <p><span class="font-semibold">Código de Barras:</span> {{ producto.codigoBarras || 'N/A' }}</p>

          <p v-show="producto.precio"><span class="font-semibold">Precio por unidad:</span> ${{ producto.precio }}</p>
          <p v-show="producto.precio"><span class="font-semibold">Precio total:</span> ${{ producto.precio * producto.cantidad }}</p>

          <p v-show="producto.tipo" class="capitalize"><span class="font-semibold">Tipo:</span> {{ producto.tipo || 'N/A' }}</p>
        </div>
      </div>

      <!-- Stock -->
      <div class="mt-8 flex justify-between items-center">
        <p
          class="text-sm font-medium px-4 py-2 rounded-full transition-all"
          :class="producto.cantidad > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
        >
          Stock: {{ producto.cantidad }}
        </p>
      </div>
    </div>
  </div>
</div>




  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/services/api';

import Swal from 'sweetalert2'



  


  const producto = ref(null)
  const route = useRoute()



  
  
  onMounted(async () => {
    const id = route.params.id
    try {
              const res = await api.get(`https://192.168.0.14:443/products/${id}`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         }

        });
      producto.value = {
        ...res.data,
  
        reviews: [
          { usuario: 'LogistIQ', comentario: 'Me encantaron, se escuchan súper bien.' },
          { usuario: 'Val4ndr0x', comentario: 'Buena duración de batería y diseño.' }
        ],


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
            console.error("Error al obtener los productos:", error);
           
        }
    }
  })
  </script>
  