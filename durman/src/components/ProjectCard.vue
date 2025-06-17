<template>
    <div class="p-4 border rounded border-gray-200 shadow-sm hover:shadow-md transition">
      <h4 class="font-semibold text-white text-lg mb-1">{{ title }}</h4>
      <p class="text-sm text-white mb-2">{{ description }}</p>


    <ul>

        <li class="text-sm text-white mb-1">{{ tag }}</li>
        <li class="text-sm text-white mb-1">{{ tagtwo }}</li>

   
    </ul>

      
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    description: String,
    tag: String,
    tagtwo: String
  })
  </script>
  