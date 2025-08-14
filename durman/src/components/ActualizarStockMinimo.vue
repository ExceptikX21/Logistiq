<template>
    <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl"
    
    style="background-color: var(--bg); color: var(--text);"
    >
      <h2 class="text-xl font-bold mb-4">Stock mínimo global</h2>
  
      <div v-if="cargando" class="text-sm text-gray-500">Cargando...</div>
  
      <div v-else>
        <p class="mb-2 ">
          Valor actual: <span class="font-semibold">{{ stockActual }}</span>
        </p>
  
        <form @submit.prevent="actualizarStock">
          <label class="block mb-2 text-sm font-medium text-gray-700">
            Nuevo stock mínimo:
          </label>
          <input
            type="number"
            v-model="nuevoStock"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Ej: 10"
          />
          <button
            type="submit"
            class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            :disabled="cargando || !esValido"
          >
            Guardar
          </button>
        </form>
  
        <p v-if="mensaje" :class="['mt-4 text-sm', exito ? 'text-green-600' : 'text-red-600']">
          {{ mensaje }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import api from '@/services/api';

import Swal from 'sweetalert2'
  
  const stockActual = ref(null)
  const nuevoStock = ref('')
  const mensaje = ref('')
  const exito = ref(false)
  const cargando = ref(false)
  
  const esValido = computed(() => {
    return nuevoStock.value !== '' && !isNaN(nuevoStock.value) && Number(nuevoStock.value) >= 0
  })
  

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const obtenerStock = async () => {
    try {
      cargando.value = true
      const res = await api.get('/api/configprofiles', 
        {
            headers: {
                Authorization: `Bearer ${token}`,
                
        }}

      ) // Asegúrate de tener un GET aquí
      stockActual.value = res.data?.configuracion?.stock_minimo_global ?? 'No definido'
    } catch (err) {
      mensaje.value = 'Error al obtener el stock'
      exito.value = false
    } finally {
      cargando.value = false
    }
  }
  
  const actualizarStock = async () => {
    try {
      cargando.value = true
      const res = await api.put('/api/configprofiles/stock', {
        stock_minimo_global: parseInt(nuevoStock.value)

        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
      })
      mensaje.value = res.data.message
      exito.value = true
      stockActual.value = res.data.configuracion.stock_minimo_global
      nuevoStock.value = ''

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Stock actualizado correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'var(--color-secundario)',
      })

    } catch (err) {
      mensaje.value = err.response?.data?.message || 'Error al actualizar'
      exito.value = false
    } finally {
      cargando.value = false
    }
  }
  
  onMounted(() => {
    obtenerStock()
  })
  </script>
  