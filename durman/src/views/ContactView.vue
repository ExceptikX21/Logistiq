<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const getProgress = () => `${(currentStep.value - 1) * 33.3}%`
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-2xl mt-12 transition-all duration-300 ease-in-out">
    <!-- Título -->
    <div class="mb-10">
      <h2 class="text-3xl font-extrabold text-gray-900 text-center">Finaliza tu pedido</h2>
      <p class="mt-2 text-center text-gray-600">Completa los siguientes pasos para confirmar tu compra</p>
    </div>

    <!-- Barra de progreso -->
    <div class="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
      <div
        class="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-500"
        :style="{ width: getProgress() }"
      ></div>
    </div>

    <!-- Formulario -->
    <form @submit.prevent class="space-y-6">
      <!-- Paso 1 -->
      <div v-if="currentStep === 1" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Juan Pérez" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input type="email" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+57 320 123 4567" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Calle 123 #45-67" />
        </div>
      </div>

      <!-- Paso 2 -->
      <div v-if="currentStep === 2" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">País</label>
          <input type="text" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Colombia" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Código postal</label>
          <input type="text" class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="110111" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Notas adicionales</label>
          <textarea class="w-full mt-1 px-4 py-2 border rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500" placeholder="Indicaciones de entrega, referencias, etc."></textarea>
        </div>
      </div>

      <!-- Paso 3 -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-800">Resumen del pedido</h3>

        <div class="space-y-4">
          <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
            <div class="flex items-center gap-4">
              <img src="https://i.imgur.com/yYu3Hbl.jpg" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p class="font-semibold">Macbook Air</p>
                <p class="text-gray-500 text-sm">Cantidad: 1</p>
              </div>
            </div>
            <span class="font-bold text-gray-800">$290</span>
          </div>

          <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
            <div class="flex items-center gap-4">
              <img src="https://www.businessinsider.in/thumb/msid-70101317,width-600,resizemode-4,imgsize-87580/tech/ways-to-increase-mobile-phone-speed/13d0e0722dbca5aa91e16a8ae2a744e5.jpg" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p class="font-semibold">Xiaomi Phone</p>
                <p class="text-gray-500 text-sm">Cantidad: 1</p>
              </div>
            </div>
            <span class="font-bold text-gray-800">$124</span>
          </div>
        </div>

        <div class="flex justify-between items-center border-t pt-4 mt-4">
          <p class="text-gray-700 font-medium">Subtotal</p>
          <p class="text-xl font-bold text-gray-900">$414</p>
        </div>
      </div>

      <!-- Paso 4 -->
      <div v-if="currentStep === 4" class="text-center space-y-6">
        <svg class="mx-auto w-24 h-24 text-green-500" viewBox="0 0 130.2 130.2">
          <circle fill="none" stroke="currentColor" stroke-width="6" cx="65.1" cy="65.1" r="62.1" />
          <polyline fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"
            points="100.2,40.2 51.5,88.8 29.8,67.5" />
        </svg>
        <h3 class="text-2xl font-bold text-green-600">¡Pedido confirmado!</h3>
        <p class="text-gray-600">Pronto recibirás un correo con la información de seguimiento.</p>
      </div>

      <!-- Botones -->
      <div class="flex justify-between items-center pt-6">
        <button
          type="button"
          @click="prevStep"
          class="px-5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          :disabled="currentStep === 1"
        >
          Atrás
        </button>

        <button
          type="button"
          v-if="currentStep < 4"
          @click="nextStep"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Siguiente
        </button>

        <button
          v-if="currentStep === 4"
          type="submit"
          class="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          Finalizar
        </button>
      </div>
    </form>
  </div>
</template>
