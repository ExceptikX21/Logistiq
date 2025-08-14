
<template>
  <div class="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <!-- Encabezado -->
      <header class="flex justify-between items-center mb-8">
        <div @mouseenter="showV40" @mouseleave="hideNormal" v-show="isVal4Visible"
        class="header-val text-2xl font-bold text-gray-800" :class="{ 'letter-spacing': isAnimating}" ><span class="text-red-500">V</span>al<span class="text-red-500">4</span>ndr<span class="text-red-500">0</span>x</div>
       <div class="header-v">
        <span class="text-red-500 text-2xl font-bold v40" v-show="isV40Visible" >V<span class="text-white ">4</span>O</span>
       </div>
       
       
       
        <div class="flex space-x-4">
          <router-link to="/">
            <button class="text-gray-400 hover:text-white bg-gray-800/20 hover:bg-blue-600 opacity-70 hover:opacity-100    ">
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
          </router-link>


        </div>
      </header>
  
      <!-- Notificación -->
      <div class="notification border-4 border-double border-cyan-900 text-blue-300 py-2 px-4 rounded-lg mb-8 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="noti-text">¡Nuevo! Soporte para generación de reportes PDF</span>
      </div>
  
      <!-- Contenido Principal -->
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center mb-4">¿Qué deseas hacer hoy?</h1>
        <p class="text-xl text-center text-gray-400 mb-8">
          Gestiona <span class="text-blue-500">productos</span> y <span class="text-blue-500">proveedores</span> de forma eficiente.
        </p>
  
        <!-- Ventana de Chat -->
        <div ref="chatContainer"  class="bg-gray-800/50 rounded-lg p-4 mb-6 h-96 overflow-y-auto">
          <button 
  @click="toggleVoice"
  :class="{
    'bg-green-500 text-white': voiceEnabled,
    'bg-gray-300 text-gray-700': !voiceEnabled
  }"
  class="p-2 rounded-full transition-colors duration-300"
>
  <svg v-if="voiceEnabled" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clip-rule="evenodd" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
  </svg>
</button>

<!-- Indicador visual de estado -->
<div v-if="isSpeaking" class="text-sm text-green-500 mt-1 flex items-center">
  <span class="animate-pulse">🔊</span> Reproduciendo...
</div>
          <div v-for="(msg, index) in messages" 
               :key="index" 
               :class="['message mb-4 p-3 rounded-lg', 
                       msg.sender === 'Tú' ? 'bg-blue-600 ml-auto' : 'bg-gray-700']"
               :style="{'max-width': '80%'}">

               <div class="font-semibold mb-1 ">{{ msg.sender }}</div>
               <div class="received" >
               
                <img :src="require('@/assets/log4.png')" v-if="msg.sender !== 'Tú'"  class="rounded-full w-80" alt=""> 
            <div style="width: 40rem;"> 

              <AnimatedText   @animation-complete="scrollToBottom" :text="msg.text" :speed="50" class="text-gray-300"></AnimatedText> 

              
            </div>
               </div>

          </div>
          <MasiveCarga v-show="showImportar" ></MasiveCarga>
        </div>
  
        <!-- Área de Input -->
        <div class="flex gap-4">
          <div class="flex-1 relative">
            <input 
    v-model="userMessage" 
    @keyup.enter="sendMessage" 
    class="w-full bg-gray-800/50 text-white rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="¿Cómo puedo ayudarte hoy?"
  />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">

            </div>
          </div>
          <button 
            @click="sendMessage"
            class="bgcolor hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <i class="fa-solid fa-paper-plane text-1xl"></i>
          </button>
          <div>

            
            <button 
  @click="startRecognition"
  :class="{
    'text-red-500 bg-blue-200': isRecording,
    'text-white bg-blue-500/40 ': !isRecording
  }"
  class="p-2 rounded-full transition-colors"
  ref=""
>
<svg v-if="isRecording" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
  <!-- Puntos suspensivos animados -->
  <circle cx="4" cy="12" r="2" class="opacity-40">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0s"/>
  </circle>
  <circle cx="12" cy="12" r="2" class="opacity-40">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
  </circle>
  <circle cx="20" cy="12" r="2" class="opacity-40">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
  </circle>
</svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10v2a7 7 0 01-14 0v-2" />
  </svg>
</button>

<p v-if="recognizedText" class="text-gray-400 mt-2">{{ recognizedText }}</p>
    <p> </p>
  </div>
          <button 
            @click="callMode"
            class="bg-gray-800 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
          <i class="fa-solid fa-phone mirrored text-red-500" ></i>
           
          </button>
        </div>
  
        <!-- Acciones Rápidas -->
        <div class="mt-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"  v-if="showAllActions">
            <button 
              v-for="action in showAllActions ? quickActions : quickActions.slice(0, 6)" 
              :key="action.text"
              @click="handleQuickAction(action.command)"
              class="bg-gray-800/50 hover:bg-gray-700/50 text-white p-4 rounded-lg text-left transition-colors"
            >
              <div class="font-semibold mb-1">{{ action.text }}</div>
              <div class="text-sm text-gray-400">{{ action.description }}</div>
            </button>
          </div>
          <div v-if="quickActions.length > 6" class="mt-4 text-center">
            <button 
              @click="showAllActions = !showAllActions"
              class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {{ showAllActions ? 'Ver menos' : 'Ver más' }}
            </button>
          </div>
        </div>
      </div>
    </div>
      <button title="Cerrar Logs"
  v-if="mostrarTerminal" 
  @click="cerrarTerminal" 
  class="cerrar-btn grid place-items-end fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
>
  X
</button>
    <LogsView  v-if="mostrarTerminal" />


  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import LogsView from '@/components/LogsView.vue';
  import AnimatedText from '@/components/AnimatedText.vue';

  import MasiveCarga from '@/components/MasiveCarga.vue';
  

  const respuestasDeInicio = [
  "Bienvenido a LogistIQ, tu inventario bajo control 🔒",
  "Hola, ¿listo para automatizar tu gestión? 🤖",
  "¡Arrancamos! Vamos a organizar esos productos 📦",
  "Sistema activo. Puedes comenzar cuando quieras ⏱️",
  "¡Hola! LogistIQ está listo para ayudarte 💡",
  "¡Hola! ¿Cómo puedo ayudarte hoy? 🤔",
  "Hola 🧘 Soy Val4ndr0x. Respira, estoy aquí para ayudarte paso a paso 🫶",
  "¡Hola, hola! 💥 Aquí Val4ndr0x con toda la energía. ¿Qué solucionamos juntos hoy? ",
];

// Generar una respuesta aleatoria
const respuestaAleatoria = respuestasDeInicio[Math.floor(Math.random() * respuestasDeInicio.length)];

  
import api from '@/services/api';

import router from '@/router';


  
  export default {

    name: 'ChatBot',
    components: {
      LogsView,
      AnimatedText,
      MasiveCarga
    },
    data() {
      return {
        detectedText: '',
        recognition: null,
        isRecording: false, 
        voiceEnabled: false,
        isSpeaking: false,
        showImportar: false,
        
        

        sakudo: 'Hola, Bienvenido a Durman',
        showAllActions: false,
        userMessage: '',
        isV40Visible: false,
        isVal4Visible: true,
        isAnimating: false,
        messages: [
          { sender: 'V4O', text: respuestaAleatoria },
        ],
        quickActions: [
          { text: '➕ Agregar Producto', description: 'Gestionar Productos', command: 'agregar producto' },
          
          { text: '➕ Agregar Proveedor', description: 'Gestionar Proveedores', command: 'agregar proveedor' },

          { text: '🗳 Reporte Producto ', description: 'Genera en segundos un informe detallado de tus prductos', command: 'generar reportes productos' },
          { text: '🕵️ Buscar Proveedor', description: 'Accede rápidamente a la información completa de tus proveedores con un solo clic.', command: 'buscar proveedor' },

          { text: '🕵️ Buscar Producto', description: 'Dejame buscar el producto por ti, no te preocupes', command: 'buscar producto' },
          { text: '𓀠 Reporte Proveedores', description: 'Genera en segundos un informe detallado de tus proveedores actuales.', command: 'generar reportes proveedores' },
          { text: 'ᢪ Consolidado ventas Q3', description: 'Genera en segundos un informe detallado de tus ventas actuales.', command: 'generar reporte de ventas' },
          { text: 'ᡉ Reporte inventario', description: 'Genera en segundos un informe del inventario.', command: 'generar reportes de inventario' },
  
       // { text: '', description: '🗑 Eliminar Producto', command: 'eliminar producto' },
       // { text: '', description: '🗑 Eliminar proveedor', command: 'eliminar proveedor' },
       { text: '📉 Productos con stock bajo', description: 'Consulta los productos con stock bajo.', command: 'Consulta el stock que está muy bajo' },  
{ text: 'ᡚ Consulta el stock de tubos', description: 'Revisa el inventario disponible de tubos.', command: 'Consulta el stock de tubos' },  
{ text: '⚠️ ¿Stock general bajo?', description: 'Verifica si el stock general es bajo.', command: 'Verifica si el stock general es bajo' },  
{ text: '📊 Histórico de movimientos', description: 'Consulta los movimientos eliminados, modificados y agregados en el inventario.', command: 'Mostrar logs de modificaciones' }  
        ],

        awaitingData: false,
        awaitingProveedorData: false,
        awaitingProductData: false,
        awaitingDeleteConfirmation: false,
        awaitingDeleteProductoConfirmation: false,
  
        currentFlow: null,  isHeaderVisible: false,
        productForm: {
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        codigoBarras: '',
        tipo: 'general'
      }
        
      };
    },
    methods: {

      toggleVoice() {


        
    this.voiceEnabled = !this.voiceEnabled;
    
    if (!this.voiceEnabled) {
      

      
      this.stopVoice();
    } else {
      // Esto activa la API de voz en respuesta a la interacción del usuario


      const dummyUtterance = new SpeechSynthesisUtterance(" ");
      window.speechSynthesis.speak(dummyUtterance);
    }
  },
  
  stopVoice() {
    window.speechSynthesis.cancel();
  },

  removeEmojis(text) {
  // Elimina la mayoría de emojis
  return text.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F1E6}-\u{1F1FF}]/gu, '');
}
,
  
speakResponse(safeText) {
  if (!this.voiceEnabled || !window.speechSynthesis) return;

  this.stopVoice(); // Detener cualquier voz previa

  const cleanText = this.removeEmojis(safeText);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'es-ES'; // Priorizar español de España
  utterance.rate = 1.0;
  utterance.pitch = 1.0; // Grave

  utterance.volume = 1.0;

  utterance.onerror = (event) => {
    console.error("Error en síntesis de voz:", event.error);
  };

  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Lista de nombres de voces masculinas comunes en diferentes navegadores/sistemas
    const maleVoices = [

      'Google español masculino', 'Microsoft Pablo'
    ];

    // 1. Intentar encontrar una voz masculina exacta
    let selectedVoice = voices.find(v => 
      maleVoices.some(name => v.name.includes(name)) &&
      v.lang.startsWith('es')
    );

    // 2. Si no se encuentra, buscar cualquier voz en español que no sea claramente femenina
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.lang.startsWith('es') && 
        !v.name.toLowerCase().includes('female') &&
        !v.name.toLowerCase().includes('mujer') &&
        !v.name.toLowerCase().includes('woman')
      );
    }

    // 3. Si todo falla, usar la primera voz en español disponible
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('es'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Voz seleccionada:", selectedVoice.name, selectedVoice.lang);
    } else {
      console.warn("No se encontró ninguna voz en español. Usando predeterminada.");
    }

    window.speechSynthesis.speak(utterance);
  };

  // Solución para el problema de carga de voces
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    // Forzar la carga de voces en algunos navegadores
    setTimeout(setVoiceAndSpeak, 100);
  } else {
    setVoiceAndSpeak();
  }
}


,


  
  startRecognition() {
  if (this.isRecording) {
    // Si ya está grabando, detener
    this.stopRecognition();
    return;
  }

  if ('webkitSpeechRecognition' in window) {
    this.isRecording = true; // Actualizar estado al inicio
    
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-CO';
    
    this.recognition.onresult = (event) => {
      let currentText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      this.detectedText = currentText;
      this.userMessage = currentText;
    };

    this.recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      this.isRecording = false; // Actualizar estado en error
    };

    this.recognition.onend = () => {
      this.isRecording = false; // Actualizar estado al terminar
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error al iniciar:', error);
      this.isRecording = false;
    }
  } else {
    console.error('API no disponible');
    this.isRecording = false;
  }
},

stopRecognition() {
  if (this.recognition) {
    this.recognition.stop();
  }
  this.isRecording = false; // Asegurar que se actualiza
},

    

      
      

      cerrarTerminal() {
        alert("al interactuar con el chat se cerrara la terminal");
        this.mostrarTerminal = false;
      },
      handleQuickAction(command) {
        this.userMessage = command;
        this.sendMessage();
      },
      callMode() {

        router.push({ name: 'callview' });

      },
async downloadReport(downloadUrl, filename) {

  console.log("📂 Intentando descargar:", downloadUrl, "con nombre:", filename);
  try {
    // Solicitar el archivo en formato blob
    const response = await api.get(downloadUrl, { responseType: 'blob' });

    // Crear un Blob a partir de la respuesta
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Crear una URL de objeto para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace invisible para forzar la descarga
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'reporte.pdf');

    document.body.appendChild(link);
    link.click();

    // Limpiar el objeto URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ Error al descargar el reporte:', error);
    this.messages.push({ sender: 'Val4ndr0x', text: 'Error al descargar el reporte, el link esta dañado,verífica la linea 192, por favor Intenta nuevamente.' });
  }
}


,
  
async sendMessage() {
  if (!this.userMessage.trim()) return;

  // Limpiar el mensaje del usuario
  this.showImportar = false;
  // Agregar mensaje del usuario
  this.messages.push({ sender: "Tú", text: this.userMessage });

  // Activar el estado de "typing"
  this.isTyping = true;

  const userMessage = this.userMessage;
  this.userMessage = "";

  try {
    let requestData = this.prepareRequestData(userMessage);

    const token = localStorage.getItem("token");
    if (!token) {
      this.messages.push({ 
        sender: "Val4ndr0x", 
        text: "🔐 Por favor inicia sesión primero" 
      });
      return;
    }

    // Enviar al backend
    const response = await api.post("/api/chat", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    console.log("📩 Respuesta completa del backend:", response.data);

    // Desactivar el estado de "typing" después de recibir la respuesta
    this.isTyping = false;

    // Manejar la respuesta
    this.handleBotResponse(response.data);
  } catch (error) {
    this.isTyping = false; // Asegúrate de desactivar el estado de "typing" en caso de error
    this.handleError(error);
  }
},



prepareRequestData(userMessage) {
  // Manejo del comando 'salir'
  if (userMessage.toLowerCase() === "salir" && this.awaitingData) {
    this.resetDataFlags();
    return { input: "salir" };
  }

  let requestData = {};

  // Intento de parseo en formato natural primero
  if (this.awaitingProductData) {
    const productoParseado = this.parseProductoNatural(userMessage);
    if (productoParseado) {
      return {
        input: "SUBMIT_PRODUCTO_DATA",
        data: productoParseado
      };
    }
  }

  if (this.awaitingProveedorData) {
    const proveedorParseado = this.parseProveedorNatural(userMessage);
    if (proveedorParseado) {
      return {
        input: "SUBMIT_PROVEEDOR_DATA",
        data: proveedorParseado
      };
    }
  }

  // Método por comas (backup)
  if (this.awaitingData) {
    const parts = userMessage.split(",").map(p => p.trim());
    
    if (this.awaitingProveedorData) {
      if (parts.length < 4) {
        this.showProveedorFormatError();
        return;
      }
      requestData = this.buildProveedorRequest(parts);
    } 
    else if (this.awaitingProductData) {
      if (parts.length < 5) {
        this.showProductFormatError();
        return;
      }
      requestData = this.buildProductRequest(parts);
    }
  } 
  else {
    requestData = { input: userMessage };
  }

  return requestData;
},

// Métodos auxiliares
resetDataFlags() {
  this.awaitingData = false;
  this.awaitingProductData = false;
  this.awaitingProveedorData = false;
}
,
showProveedorFormatError() {
  this.messages.push({ 
    sender: "Val4ndr0x", 
    text: `Formato incorrecto. Ejemplos válidos:
    ➡ Formato natural: "Agregar proveedor Ferretería Moderna, contacto Juan Pérez, teléfono 5551234567, email juan@ferreteria.com"
    ➡ Formato técnico: "Ferretería Moderna, Juan Pérez, 5551234567, juan@ferreteria.com"`
  });
},

showProductFormatError() {
  this.messages.push({ 
    sender: "Val4ndr0x", 
    text: `Formato incorrecto. Ejemplos válidos:
    ➡ Formato natural: "Agregar producto Martillo con 10 unidades valor $45, código M001, para carpintería"
    ➡ Formato técnico: "Martillo, Herramienta carpintería, 45.00, 10, M001"`
  });
},

buildProveedorRequest(parts) {
  return {
    input: "SUBMIT_PROVEEDOR_DATA",
    data: {
      nombre: parts[0],
      contacto: parts[1],
      telefono: parts[2],
      email: parts[3]
    }
  };
}
,
buildProductRequest(parts) {
  return {
    input: "SUBMIT_PRODUCTO_DATA",
    data: {
      nombre: parts[0],
      descripcion: parts[1],
      precio: parseFloat(parts[2]),
      cantidad: parseInt(parts[3]),
      codigoBarras: parts[4]
    }
  };
}
,
// Parsers para formato natural
parseProveedorNatural(texto) {
  // Expresión regular que captura solo los valores sin las palabras clave
  const regex = /(?:agregar\s+)?proveedor\s+(?<nombre>[^,]+?)(?:\s*,\s*|\s+contacto\s+)(?<contacto>[^,]+?)(?:\s*,\s*|\s+tel[ée]fono\s+)(?<telefono>[^,]+?)(?:\s*,\s*|\s+email\s+)(?<email>[^\s,]+)/i;
  
  const match = texto.match(regex);

  if (!match?.groups) {
    console.error("Formato de proveedor no reconocido:", texto);
    return null;
  }

  // Función para limpiar valores (remueve palabras clave)
  const limpiarValor = (valor, palabraClave) => {
    return valor.replace(new RegExp(palabraClave, 'i'), '').trim();
  };

  return {
    nombre: match.groups.nombre.trim(),
    contacto: limpiarValor(match.groups.contacto, 'contacto'),
    telefono: limpiarValor(match.groups.telefono, 'tel[ée]fono'),
    email: limpiarValor(match.groups.email, 'email')
  };
},
parseProductoNatural(texto) {
  const regex = /(?:agregar\s+)?producto\s+(?<nombre>.+?)\s+(?:con|de)\s+(?<cantidad>\d+)\s+unidades?.+?(?:valor|precio|a)\s*\$?\s*(?<precio>[\d.,]+).+?c[óo]digo\s*(?<codigo>[^\s,]+).+?(?:descripci[óo]n|para)\s*(?<descripcion>.*)/i;
  const match = texto.match(regex);
  
  if (!match?.groups) return null;

  return {
    nombre: match.groups.nombre.trim(),
    cantidad: parseInt(match.groups.cantidad),
    precio: parseFloat(match.groups.precio.replace(',', '.')),
    codigoBarras: match.groups.codigo.trim(),
    descripcion: match.groups.descripcion.trim() || "Sin descripción"
  };
},


handleBotResponse(data) {


  
  if (!data || !data.response) return;

  const botResponse = data.response;

  // 1. Manejo de modos (agregar producto/proveedor)
  if (typeof botResponse === 'string') {
    if (botResponse.includes("🔹 **Modo: Agregar producto**")) {
      this.awaitingData = true;
      this.awaitingProductData = true;
    } 
    else if (botResponse.includes("🔹 **Modo: Agregar proveedor**")) {
      this.awaitingData = true;
      this.awaitingProveedorData = true;
    }

    else if (botResponse.includes("Importacion de productos al mayor")) {
     this.showImportar = true;
 
    }
    else if (botResponse.includes("✅ Has salido del modo")) {
      this.awaitingData = false;
      this.awaitingProductData = false;
      this.awaitingProveedorData = false;
      
    }



    this.messages.push({ sender: "Val4ndr0x", text: botResponse });
    this.speakResponse(botResponse);
    return;
  }
  

  // 2. Manejo de reportes (OBJETO con downloadUrl)
  if (botResponse.downloadUrl) {
    console.log("🔗 URL de descarga:", botResponse.downloadUrl);
    const displayText = botResponse.text || "✅ Reporte generado. Descargando...";
    this.messages.push({ sender: "Val4ndr0x", text: displayText });
    this.downloadReport(botResponse.downloadUrl, botResponse.filename);
    this.speakResponse(displayText);
    return;
  }

  // 3. Manejo de logs (otro tipo de objeto)
  if (botResponse.logs) {
    const logText = botResponse.text || "🕵️‍♂️ Logs obtenidos:";
    this.messages.push({ sender: "Val4ndr0x", text: logText });
    this.logsDelChatbot = botResponse.logs;
    this.mostrarTerminal = true;
    this.speakResponse(logText);
    return;
  }

  // 4. Respuesta por defecto para objetos no reconocidos
  if (typeof botResponse === 'object') {
    const safeText = botResponse.text || "✅ Operación completada";
    this.messages.push({ sender: "Val4ndr0x", text: safeText });

    this.speakResponse(safeText);



    return;
  }

  // 5. Fallback para cualquier otro caso
  this.messages.push({ 
    sender: "Val4ndr0x", 
    text: "✅ Acción completada" 
  }


);


  
},

// Agrega un botón "Habilitar voz" que el usuario debe clickear primero
// enableVoice() {

//   console.log("Voz habilitada");
//   this.voiceEnabled = true;
//   const dummyUtterance = new SpeechSynthesisUtterance(" ");
//   window.speechSynthesis.speak(dummyUtterance);
// },
// speakResponse(text) {
//   // Verificar si el navegador soporta speechSynthesis
//   if (!window.speechSynthesis) {
//     console.warn("Tu navegador no soporta síntesis de voz");
//     return;
//   }

//   // Cancelar cualquier voz previa
//   window.speechSynthesis.cancel();

//   // Configurar el utterance
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = 'es-CO';
//   utterance.rate = 1.0;
//   utterance.pitch = 1.0;
//   utterance.volume = 1.0;

//   // Manejar errores
//   utterance.onerror = (event) => {
//     console.error("Error en síntesis de voz:", event.error);
//   };

//   // Hablar
//   window.speechSynthesis.speak(utterance);
// },

handleError(error) {
  if (error.response?.status === 404) {
    alert("No se pudo completar la solicitud.");
  } else if (error.response?.status === 401) {
    Swal.fire({
  title: "0xdeadfeed",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "La corrupción es inevitable. ¿Fue error o fue intención?",
  icon: "error",
  confirmButtonText: "Aceptar"
});
    this.$router.push("/loginview");
  } 
  
  else if (error.response?.status === 403) {
            Swal.fire({
  title: '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
  html: '¡UPS! Tu licencia ha expirado, por favor contacta a soporte',
  showConfirmButton: true,
  footer: "Ha ocurrido un error inesperado",
    confirmButtonText: "Aceptar",
    confirmButtonColor: 'var(--color-secundario)',

});

 
  }
  
  
  else {
    console.error("Error al comunicarse con Val4ndr0x:", error);
    this.messages.push({
      sender: "Val4ndr0x",
      text: "Lo siento, estoy teniendo problemas para responder. Por favor intenta nuevamente."
    });


    this.messages.push({
      sender: "Val4ndr0x",
      text: "Lo siento, estoy teniendo problemas para responder. Por favor intenta nuevamente."
    });


  }
  this.isTyping = false; // Asegúrate de desactivar el estado de "typing" en caso de error
},
    showV40() {
      this.isAnimating = true; // Inicia la animación
      setTimeout(() => {
        this.isAnimating = false; // Detén la animación
        this.isV40Visible = true; // Muestra el header-v40
        this.isVal4Visible = false; // Oculta el header-val

        // Vuelve al header-val después de un tiempo
        setTimeout(() => {
          this.isV40Visible = false; // Oculta el header-v40
          this.isVal4Visible = true; // Muestra el header-val
        }, 2000); // Tiempo que permanece en header-v40 (2 segundos)
      }, 190); // Duración de la animación (0.5 segundos)
    },


    scrollToBottom() {
      const chatContainer = this.$refs.chatContainer;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
}
,

  



  
  },





    mounted() {
      // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente
      this.isHeaderVisible = true;



// Función para ejecutar la verificación cada cierto tiempo, por ejemplo, cada 1 hora

    },

    watch: {
  messages() {
    // Estima tiempo basado en longitud del mensaje
    const lastMessage = this.messages[this.messages.length - 1];
    const baseDelay = 50; // tu velocidad
    const estimatedTime = lastMessage ? lastMessage.text.length * baseDelay : 1000;

    setTimeout(() => {
      this.scrollToBottom();
    }, estimatedTime);
  },
  detectedText(newText) {
    if (newText && newText.trim() !== '') {
      this.userMessage = newText;
      
      // Cancelar timeout previo si existe
      if (this.voiceTimeout) clearTimeout(this.voiceTimeout);
      
      this.voiceTimeout = setTimeout(() => {
        if (this.userMessage === newText) { // Verificar que no se haya modificado
          this.sendMessage();
        }
      }, 1000); // 800ms es un tiempo más natural
    }
  }
},
beforeUnmount() {
  this.stopVoice();
  if (this.recognition) {
    this.recognition.stop();
    this.recognition = null;
  }
}


  };
  </script>
  
  <style>
  .chatbot-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    
  }

  .mirrored {
    transform: scaleX(-1);
    display: inline-block; /* Necesario para que transform funcione correctamente */
}
  .notification{


    animation: notif 2s alternate infinite;



  }
  .v40{

    animation: notif 2s alternate infinite;
  }


  .header-val{
   
    font-weight: bold;
  
    text-align: center;
  
  }
  .received{
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 10px;
  }

  .header-val:hover {
    letter-spacing: -3px;
    transition: letter-spacing 0.9s ease;

    
  }
  @keyframes notif {
      10%{
        filter: drop-shadow(0 0 0.75rem rgba(255, 255, 255, 0.433));
      




      }
      30%{}
      50%{filter: drop-shadow(0 0 0.75rem rgba(255, 255, 255, 0.433));}
      70%{}
      90%{}
      100%{}

      
    }

    .noti-text{

      animation: salty 4s infinite alternate;
    }
    @keyframes salty {
            0%, 100% {
                
            }
            25% {
              
            }
            50% {
              font-size: 1.1rem;
               
            }
            75% {
               
            }
        }
  
  .chat-window {
    height: 400px;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    overflow-y: auto;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .bgcolor{
    background-color: var(--color-secundario);
    

  }

  pre {
    font-family: inherit; /* Usa la fuente normal de tu web, no la monospace */
  font-size: inherit;  
  color: inherit;  
  background: transparent;  
  border: none;  
  white-space: pre-wrap; /* Respeta saltos de línea pero no overflow */
  margin: 0; 
  }
  
  .message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 80%;
  }
  
  .Tú {
    background: #e3f2fd;
    margin-left: auto;
    margin-right: 10px;
  }
  
  .Bot {
    background: #f1f1f1;
    margin-right: auto;
    margin-left: 10px;
  }
  
  .input-area {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
  }
  
  .help-button {
    background-color: #2196F3 !important;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
  }
  
  button {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  

  </style>

