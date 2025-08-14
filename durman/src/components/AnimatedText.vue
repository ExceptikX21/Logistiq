<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 0, // milisegundos entre letras
  }
});

const displayedText = ref('');
let index = 0;
let interval = null;

const startTyping = () => {
  displayedText.value = '';
  index = 0;
  clearInterval(interval);

  interval = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index];
      index++;
    } else {
      clearInterval(interval);

      emit('animation-complete');
    }
  }, 35);
};

onMounted(startTyping);

// Si cambia el texto, volver a escribirlo
watch(() => props.text, () => {
  startTyping();
});

const emit = defineEmits(['animation-complete']);


</script>

<template>
  <pre class=" whitespace-pre-wrap font-mono text-red-200">{{ displayedText }}</pre>
</template>

<style scoped>
/* Puedes personalizarlo tipo consola o ciberpunk */
</style>
