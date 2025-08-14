<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Historial de movimientos</h2>
  
      <div class="mb-4">
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="includeInactive" />
          <span>Incluir productos inactivos</span>
        </label>
      </div>
  
      <table class="w-full table-auto border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Fecha</th>
            <th class="p-2 text-left">Producto</th>
            <th class="p-2 text-left">Tipo</th>
            <th class="p-2 text-left">Cantidad</th>
            <th class="p-2 text-left">Usuario</th>
            <th class="p-2 text-left">Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in filteredMovements" :key="mov.id" :class="mov.producto_inactivo ? 'text-gray-400 italic' : ''">
            <td class="p-2">{{ mov.fecha }}</td>
            <td class="p-2">{{ mov.producto_nombre }}</td>
            <td class="p-2">
              <span :class="mov.tipo === 'entrada' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                {{ mov.tipo }}
              </span>
            </td>
            <td class="p-2">{{ mov.cantidad }}</td>
            <td class="p-2">{{ mov.usuario }}</td>
            <td class="p-2">{{ mov.motivo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const includeInactive = ref(false)
  
  const movimientos = ref([
    {
      id: 1,
      fecha: '2025-05-15',
      producto_nombre: 'Tubo PVC 2"',
      tipo: 'entrada',
      cantidad: 100,
      usuario: 'Carlos R.',
      motivo: 'Compra proveedor',
      producto_inactivo: false,
    },
    {
      id: 2,
      fecha: '2025-05-17',
      producto_nombre: 'Tubo PVC 2"',
      tipo: 'salida',
      cantidad: 20,
      usuario: 'María L.',
      motivo: 'Venta cliente',
      producto_inactivo: false,
    },
    {
      id: 3,
      fecha: '2025-05-18',
      producto_nombre: 'Conector metálico',
      tipo: 'salida',
      cantidad: 5,
      usuario: 'Juan D.',
      motivo: 'Producto dañado',
      producto_inactivo: true,
    },
  ])
  
  const filteredMovements = computed(() =>
    includeInactive.value ? movimientos.value : movimientos.value.filter(m => !m.producto_inactivo)
  )
  </script>
  