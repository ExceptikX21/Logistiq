<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white"
        :class="toastClass"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const props = defineProps({
    message: String,
    type: {
      type: String,
      default: 'info', // info | success | error | warning
    },
  })
  
  const visible = ref(true)
  
  onMounted(() => {
    setTimeout(() => {
      visible.value = false
    }, 3500)
  })
  
  const toastClass = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500 text-black',
  }[props.type]
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  </style>
  