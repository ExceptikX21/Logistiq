<template>
    <section class="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl font-extrabold text-gray-900">Elige el <span class="text-blue-900">Plan Perfecto</span> para ti</h2>
        <p class="mt-4 text-lg text-gray-600">Haz crecer tu negocio con opciones de precio flexibles. Comienza gratis y mejora cuando estés listo.</p>

      </div>
  
      <div class="mt-12 grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
        <!-- Starter -->
        <div class="border rounded-2xl p-6 shadow-sm">
          <div class="text-center">
            <i class="fas fa-leaf text-green-500 text-4xl mb-2"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Esencial</h3>
            <p class="text-gray-500 text-sm mb-2">Ideal para comenzar sin complicaciones</p>
            <p class="mt-4 text-3xl font-extrabold text-gray-900">$9 <span class="text-base font-medium">/mes</span></p>
          </div>
          <ul class="mt-6 space-y-2 text-gray-700">
            <li>✔ Hasta 5 proyectos</li>
            <li>✔ 10GB de almacenamiento</li>
            <li>✔ Analíticas básicas</li>
            <li>✔ Soporte por correo</li>
            <li>✔ Certificado SSL</li>
            <li>✔ Dominio personalizado</li>
          </ul>
          <button class="mt-6 w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Probar Gratis</button>
        </div>
  
        <!-- Professional -->
        <div class="border-2 border-blue-900 rounded-2xl p-6 shadow-md relative">
          <span class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white text-xs px-3 py-1 rounded-full font-semibold">★ Más Popular</span>
          <div class="text-center">
            <i class="fas fa-rocket text-blue-900 text-4xl mb-2"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Profesional</h3>
            <p class="text-gray-500 text-sm mb-2">Funciones avanzadas para equipos pequeños</p>
            <p class="mt-4 text-3xl font-extrabold text-gray-900">$29 <span class="text-base font-medium">/mes</span></p>
          </div>
          <ul class="mt-6 space-y-2 text-gray-700">
            <li>✔ Proyectos ilimitados</li>
            <li>✔ 100GB de almacenamiento</li>
            <li>✔ Analíticas avanzadas</li>
            <li>✔ Soporte prioritario</li>
            <li>✔ Certificado SSL</li>
            <li>✔ Dominio personalizado</li>
            <li>✔ Colaboración en equipo</li>
            <li>✔ Acceso a API</li>
            <li>✔ Integraciones personalizadas</li>
          </ul>
          <button class="mt-6 w-full py-2 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-md hover:from-blue-900 hover:to-black">Probar Gratis</button>
        </div>
  
        <!-- Enterprise -->
        <div class="border rounded-2xl p-6 shadow-sm">
          <div class="text-center">
            <i class="fas fa-building text-indigo-600 text-4xl mb-2"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Empresarial</h3>
            <p class="text-gray-500 text-sm mb-2">Soluciones personalizadas para grandes organizaciones</p>
            <p class="mt-4 text-3xl font-extrabold text-gray-900">$99 <span class="text-base font-medium">/mes</span></p>
          </div>
          <ul class="mt-6 space-y-2 text-gray-700">
            <li>✔ Todo ilimitado</li>
            <li>✔ 1TB de almacenamiento</li>
            <li>✔ Analíticas en tiempo real</li>
            <li>✔ Soporte dedicado 24/7</li>
            <li>✔ Certificado SSL</li>
            <li>✔ Dominio personalizado</li>
            <li>✔ Gestión avanzada de equipos</li>
            <li>✔ Acceso total a API</li>
            <li>✔ Integraciones a medida</li>
            <li>✔ Inicio de sesión único (SSO)</li>
            <li>✔ Seguridad avanzada</li>
            <li>✔ SLA personalizado</li>
          </ul>
          <button class="mt-6 w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">Contactar Ventas</button>
        </div>
      </div>
  
      <!-- Por qué elegirnos -->
      <!-- <div class="mt-20 max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900">¿Por qué elegir nuestra plataforma?</h3>

        <p class="mt-2 text-gray-600">Diseñada para escalar contigo, con lo último en tecnología, seguridad y rendimiento.</p>
        <div class="mt-8 grid grid-cols-2 gap-6 text-gray-700 text-sm relative">
            <Vue3Lottie
          :animationData="require('@/assets/animaciones/controltotal2.json')"
          :loop="true"
          :autoplay="true"
          style=" z-index: 1;width: 200px; height: 200px; margin: auto; display: hidden;"
          class="w-14 opacity-50 h-24 mb-0 absolute top-[-100%] left-1/2 transform -translate-x-1/2"
        />

          <div>⚡ 99.9% de disponibilidad garantizada</div>
          <div>🔐 Seguridad de nivel empresarial</div>

          <div>👥 Herramientas de colaboración en equipo</div>
          <div>📞 Soporte 24/7 personalizado</div>
        </div>
      </div>
   -->
      <!-- FAQ -->
      <div class="mt-20 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h3>
        <div class="mt-4 space-y-4 text-sm text-gray-700">
          <div><strong>¿Puedo cambiar de plan en cualquier momento?</strong><br />Sí, puedes mejorar o reducir tu plan en cualquier momento. El cambio se verá reflejado en tu próxima factura.</div>
          <div><strong>¿Ofrecen prueba gratuita?</strong><br />Sí, ofrecemos una prueba gratuita de 14 días para todos los planes. No necesitas tarjeta de crédito para comenzar.</div>
          <div><strong>¿Qué métodos de pago aceptan?</strong><br />Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias para planes empresariales.</div>
          <div><strong>¿Ofrecen reembolsos?</strong><br />Sí, tienes una garantía de reembolso de 30 días si no estás satisfecho.</div>
        </div>
      </div>
  
      <!-- CTA -->

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