<template>
<section class="bg-white py-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto text-center">
    <h2 class="text-4xl font-extrabold text-gray-900">
      Elige el <span class="text-blue-900">Plan Perfecto</span> para ti
    </h2>
    <p class="mt-4 text-lg text-gray-600">
      Haz crecer tu negocio con opciones flexibles. Comienza con lo básico o personaliza tu experiencia.
    </p>
  </div>

  <div class="mt-12 grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
    <!-- BASIC -->
    <div class="border rounded-2xl p-6 shadow-sm">
      <div class="text-center">
        <i class="fas fa-rocket text-green-500 text-4xl mb-2"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">BASIC</h3>
        <p class="text-gray-500 text-sm mb-2">Gestión Inteligente Centralizada</p>
        <p class="mt-4 text-3xl font-extrabold text-gray-900">$39.900 <span class="text-base font-medium">/mes</span></p>
      </div>
      <ul class="mt-6 space-y-2 text-gray-700 text-sm">
        <li>✔ Gestión total de productos y proveedores</li>
        <li>✔ Inventario editable con historial de movimientos</li>
        <li>✔ Administrador con acceso completo al sistema</li>
      </ul>
      <button class="mt-6 w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Comenzar</button>
    </div>

    <!-- STANDARD -->
    <div class="border-2 border-blue-900 rounded-2xl p-6 shadow-md relative">
      <span class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white text-xs px-3 py-1 rounded-full font-semibold">★ Más Popular</span>
      <div class="text-center">
        <i class="fas fa-leaf text-blue-900 text-4xl mb-2"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">STANDARD</h3>
        <p class="text-gray-500 text-sm mb-2">Sistema de Gestión Completo</p>
        <p class="mt-4 text-3xl font-extrabold text-gray-900">$79.900 <span class="text-base font-medium">/mes</span></p>
      </div>
      <ul class="mt-6 space-y-2 text-gray-700 text-sm">
        <li>✔ Gestión total de productos y proveedores</li>
        <li>✔ Gestión de stock en tiempo real con historial</li>
        <li>✔ Chatbot con IA para consultas y acciones rápidas</li>
        <li>✔ Generación de reportes (PDF y Excel)</li>
        <li>✔ Hasta 5 usuarios con un administrador principal</li>
      </ul>
      <button class="mt-6 w-full py-2 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-md hover:from-blue-900 hover:to-black">Probar Gratis</button>
    </div>

    <!-- BUSINESS -->
    <div class="border rounded-2xl p-6 shadow-sm">
      <div class="text-center">
        <i class="fas fa-building text-indigo-600 text-4xl mb-2"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">BUSINESS</h3>
        <p class="text-gray-500 text-sm mb-2">Infraestructura Personalizada y Escalable</p>
        <p class="mt-4 text-3xl font-extrabold text-gray-900">$149.900 <span class="text-base font-medium">/mes</span></p>
      </div>
      <ul class="mt-6 space-y-2 text-gray-700 text-sm">
        <li>✔ Chatbot con IA entrenado para tu operación</li>
        <li>✔ Gestión total y reportes exportables (PDF/Excel)</li>
        <li>✔ Base de datos exclusiva por empresa</li>
        <li>✔ Soporte técnico dedicado vía chat o llamada</li>
        <li>✔ Interfaz personalizable (colores, logo y más)</li>
        <li>✔ Usuarios ilimitados con gestión de roles</li>
        <li>✔ Gestión de movimientos en tiempo real</li>
        <li>✔ Seguimiento de acciones realizadas</li>
        <li>✔ Actualizaciones y mejoras continuas</li>
        <li>✔ Capacitación y soporte personalizado</li>
      </ul>
      <button class="mt-6 w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Contactar Ventas</button>
    </div>
  </div>
</section>

  </template>
  
  <script setup>
  // Puedes agregar lógica para cambiar precios mensual/anual si lo deseas
  </script>
  
  <style scoped>
  .toggle {
    @apply form-checkbox h-5 w-5 text-blue-900 rounded;
  }
  </style>