<template>
    <div class="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 class="text-xl font-bold">🔍 Debug de Firma de Venta</h2>
  
      <div class="space-y-2">
        <input
          v-model="ventaId"
          type="number"
          placeholder="ID de la venta"
          class="w-full border px-3 py-2 rounded"
        />
        <button
          @click="verificarFirma"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Verificar Firma
        </button>
      </div>
  
      <div v-if="resultado" class="mt-4 space-y-2">
        <p><strong>ID:</strong> {{ resultado.id }}</p>
        <p><strong>Firma guardada:</strong> <code>{{ resultado.firma_guardada }}</code></p>
        <p><strong>Firma calculada:</strong> <code>{{ resultado.firma_calculada }}</code></p>
        <p>
          <strong>Integridad:</strong>
          <span :class="resultado.coinciden ? 'text-green-600' : 'text-red-600'">
            {{ resultado.coinciden ? '✔ Coincide' : '✘ Alterada' }}
          </span>
        </p>
      </div>
  
      <div v-if="error" class="text-red-600 mt-2">
        ⚠ {{ error }}
      </div>
  
      <!-- Alerta para ventas con problemas -->
      <div v-if="ventasConProblemas.length > 0" class="mt-4">
        <div v-for="venta in ventasConProblemas" :key="venta.id" class="bg-yellow-100 p-4 rounded-lg">
          <p><strong>ID:</strong> {{ venta.id }}</p>
          <p><strong>Problema:</strong> Firma alterada</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '@/services/api';

  
  const ventaId = ref('')
  const resultado = ref(null)
  const error = ref(null)
  const ventasConProblemas = ref([])  // Aquí almacenaremos las ventas con problemas
  
  const verificarFirma = async () => {
    error.value = null
    resultado.value = null
    ventasConProblemas.value = []  // Resetear ventas con problemas antes de cada búsqueda
  
    if (!ventaId.value) {
      error.value = 'Por favor ingresa un ID de venta.'
      return
    }
  
    try {
      const res = await api.get(`/api/ventas/debug-firma/${ventaId.value}, `, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      resultado.value = res.data
  
      // Si la firma no coincide, agregarla a la lista de ventas con problemas
      if (!resultado.value.coinciden) {
        ventasConProblemas.value.push(resultado.value)
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al verificar firma'
    }
  }
  </script>
  