<template>
    <div class="huver flex items-center gap-2 px-2 py-1 rounded-full border" :style="{ borderColor: color }">
      <!-- Muestra de color -->
<!-- Muestra solo si existe `label` -->
<span v-if="label" class="w-5 h-5 rounded-md border border-gray-300 " :style="{ backgroundColor: label }"></span>
<span v-if="label" class="text-sm font-medium 0">{{ label }}</span>

<!-- Muestra solo si existe `label2` -->
<span v-if="label2" class="w-4 h-4 rounded-md   mr-4" :style="{ backgroundColor: label2 }"></span>
<span v-if="label2" class="text-sm font-medium ">{{ label2 }}</span>

      
    </div>
      <!-- Muestra de color -->
      
      
 


  </template>
  <script setup>
  defineProps({
    label: String,
    color: String,
    h2: String,
    label2: String,

    
  })
  </script>
  <style scoped>
  .huver:hover {
  
    box-shadow: 0 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: var(--color-secundario);
    transition: background-color 0.3s ease;
  }
  .huver::after {
    background-color: var(--color-principal);
    color: var(--color-secundario);
  }

  body{

    background-color: var(--bg);
    color: var(--text);
  }
  </style>
  