<template>
  <div class="p-0 w-[100%] h-full flex flex-col items-center justify-start bg-gray-950 text-white" style="overflow-x: none; overflow-y: none;">
    <div class="mb-80 mt-9 text-center">
      <h1 class="text-1xl font-bold">Val4nd0x</h1>

    </div>

    <div
      class="relative mb-2 flex items-center justify-center  rounded-full  shadow-2xl cursor-pointer" 
      @mousedown="!handsFreeMode && startRecognition()"
      @mouseup="!handsFreeMode && stopRecognition()"
      @touchstart.prevent="!handsFreeMode && startRecognition()"
      @touchend.prevent="!handsFreeMode && stopRecognition()"
    >
  <span v-if="isListening" class="w-44 h-44  relative bottom-40 avatar2 "> <img :src="Logo" alt=""> <span class="absolute top-0 left-[-80%] opacity-20 avatar2"> Escuchando... </span>  </span>
<span v-else-if="speaking" class="w-64 h-64 avatar "> <img :src="Logo" alt="">  <span class="absolute mt-7 mb-7 top-1/6 left-16 transform -translate-x-100%] -translate-y-1/2">Respondiendo... </span> </span>
<span v-else><img :src="Logo" class="w-64 h-64  rounded-full" alt="Logo" ></span>
    </div>

    <!-- Texto del usuario -->
    <!-- <div class="mt-6 w-[90%] max-w-md p-4 rounded-lg shadow-md">
      <p class="text-sm text-gray-400 mb-1">Tú:</p>
      <p class="text-base">{{ transcript || '...' }}</p>
    </div> -->

    <!-- Respuesta de la IA -->
    <div class="mt-3 mb-80 w-[90%] max-w-md  p-4 rounded-lg shadow-md">
      <p class="text-sm text-gray-400 mb-1 mt-12">Val4ndrox:</p>
      <p class="text-base">{{ response || '...' }}</p>



    </div>


<div class="relative flex items-center justify-center bottom-36 p-4 cursor-pointer" @click="stopProcess"> Interrumpir</div>


    <div class=" relative mb-10 left-4 ml-10 relative grid grid-cols-2 gap-60" >
      <button
  @click="toggleHandsFree"
  class="microphone   ml-15 mt-8 px-6 py-2 rounded-full transition flex items-center gap-2"
>
  <i class="text-1xl" :class="handsFreeMode ? 'fas fa-phone-slash' : 'fas fa-phone'"></i>
  {{ handsFreeMode ? 'Finalizar llamada' : 'Iniciar llamada' }}
</button>



    <div
      class="relative flex microphone items-center justify-center w-20 h-26 rounded-full bg-gradient-to-br shadow-2xl cursor-pointer"
      @mousedown="!handsFreeMode && startRecognition()"
      @mouseup="!handsFreeMode && stopRecognition()"
      @touchstart.prevent="!handsFreeMode && startRecognition()"
      @touchend.prevent="!handsFreeMode && stopRecognition()"
    >
    <span v-if="isListening"><i class="text-3xl fas fa-microphone"></i> </span>
<span v-else-if="speaking"><i class="text-3xl fa-solid fa-volume-xmark"></i> </span>
<span v-else><i class="text-2xl fas fa-microphone-alt " ></i></span>

    </div>
    </div>

  </div>
</template>

<script>



import Logo from "@/assets/logoV40.png";
import Swal from "sweetalert2";

export default {
  data() {


    return {
      recognition: null,
      transcript: "",
      manuallyStopped: false,

      response: "",
      isListening: false,
      speaking: false,
      handsFreeMode: false,
      Logo: Logo,
    };
  },
  methods: {
    initRecognition() {
      if (this.recognition) return; // Evitar crear más de una instancia

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        Swal.fire({
          title: "Corex AI- V40",
          text: "Tu navegador no soporta reconocimiento de voz.",
          icon: "warning",
          confirmButtonText: "Aceptar",
          confirmButtonColor: 'var(--color-secundario)',
        })
        return;
      }
      

      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-ES";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {

        
        this.isListening = true;
      };

      this.recognition.onresult = async (event) => {
  this.transcript = event.results[0][0].transcript;
  this.isListening = false;

  // 🛑 Evitar reinicio inmediato por `onend`
  this.manuallyStopped = true;

  await this.sendToBackend(this.transcript);
};


      this.recognition.onerror = (event) => {
        console.error("Error de reconocimiento:", event.error);
        this.isListening = false;
        if (this.handsFreeMode) {
          // Reintenta en modo manos libres con un pequeño delay para evitar bucle rápido
          setTimeout(() => {
            try {
              this.recognition.start();
            } catch { error => console.error("Error al reiniciar reconocimiento:", error); }
          }, 500);
        }
      };

      this.recognition.onend = () => {
  this.isListening = false;

  if (this.handsFreeMode && !this.speaking && !this.manuallyStopped) {
    try {
      this.recognition.start();
    } catch (error) {
      console.error("Error al reiniciar reconocimiento:", error);
    }
  }
};


    },

    startRecognition() {
  if (!this.recognition) {
    this.initRecognition();
  }

  // Si el bot está hablando, cancelamos la voz
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    this.speaking = false;

    
  }

  if (this.recognition && !this.isListening) {
    try {
      this.recognition.start();
    } catch (e) {
      console.warn("No se pudo iniciar el reconocimiento:", e);
    }
  }
}
,

    stopRecognition() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();


      }
    },

    toggleHandsFree() {
      this.handsFreeMode = !this.handsFreeMode;
      if (this.handsFreeMode) {




        if (this.speak) {
          // Detener la voz si estamos hablando
          window.speechSynthesis.cancel();
          this.speaking = false;
        } else if (this.isListening) {
          // Detener el reconocimiento si estamos escuchando
          this.recognition.stop();
          this.isListening = false;
        } else {
          // Iniciar el reconocimiento
          this.isListening = false;
          
          this.stopRecognition();
        }


        const saludoArray = [
  "Hola, soy V40. Estoy aquí para ayudarte con lo que necesites.",
  "¡Bienvenido! Soy V40, tu asistente personal. ¿En qué puedo ayudarte hoy?",
  "Hola, soy V40. Todo está bajo control, dime cómo puedo asistirte.",
  "Saludos, habla V40. Estoy listo para ayudarte con lo que necesites.",
  "Hola, gracias por confiar en V40. ¿Qué necesitas hoy?",
  "Aquí V40. Estoy disponible para ayudarte en cualquier momento.",
  "Hola, soy V40. No estás solo, dime cómo puedo ayudarte.",
  "¡Hola! V40 al habla. Vamos a resolver esto juntos.",
  "Hola, soy V40. Tu tiempo es valioso, dime en qué te ayudo.",
  "Hola, bienvenido a tu Corex IA, V40. Tu aliado inteligente para resolver tareas.",
  "V40 te da la bienvenida. Estoy aquí para asistirte de forma clara y rápida.",
  "¡Hola! Soy V40, tu asistente. Hoy puede ser un gran día, ¿comenzamos?"
];

const saludo = saludoArray[Math.floor(Math.random() * saludoArray.length)];

        this.response = saludo;
    this.speak(saludo);


        
       
   setTimeout(() => {
          this.startRecognition();
        },7000); // Esperar 1 segundo antes de iniciar el reconocimiento
      } else {
        this.stopRecognition();
       
        
      }
    },

    async sendToBackend(input) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ input }),
        });

        const { response } = await res.json();
        this.response = response;
        this.speak(response);
      } catch (error) {
 if (error.response?.status === 401) {


            Swal.fire({
              title: "Corex AI- V40",
              text: "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
              icon: "warning",
              confirmButtonText: "Aceptar"
            })
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
console.error("Error al enviar la solicitud:",error.response?.data?.error || error);
          }
      }
    },

    speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.volume = 0.2;

    // 🔒 Detenemos reconocimiento *antes* de hablar
    this.manuallyStopped = true;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }

    // 🔁 Cuando empieza a hablar
    utterance.onstart = () => {
      this.speaking = true;
    };

    // ✅ Cuando termina de hablar
    utterance.onend = () => {
      this.speaking = false;
      this.manuallyStopped = false;

      if (this.handsFreeMode) {
        setTimeout(() => {
          this.startRecognition();
        }, 800);
      }
    };

    speechSynthesis.speak(utterance);
  }
}

,

    stopProcess() {
  // Cancelar cualquier voz en reproducción
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  // Detener reconocimiento
  if (this.recognition && this.isListening) {
    this.recognition.stop();
  }

  // Desactivar modo manos libres para evitar reinicios
  this.handsFreeMode = false;

  // Resetear estados
  this.isListening = false;
  this.speaking = false;
}

,
  },
};
</script>

<style scoped>

.avatar {

  background: #06021e78;
 
  box-shadow: #a2383848 1px 1px 55px 45px  ;


  animation: box-shadow 0.5s forwards infinite alternate;
  animation-delay: .2s;
  border-radius: 50%;
}

@keyframes box-shadow {
  to {
    box-shadow: #a238382a 1px 1px 35px 35px ;
  }
  from {
    box-shadow: #a238380f 1px 1px 85px 85px ;
  }
}

.avatar2 {

background: #06021e78;

box-shadow: #a2383848 1px 1px 55px 45px  ;


animation: box-shadow2 10s forwards infinite alternate;
animation-delay: .2s;
border-radius: 50%;
}

@keyframes box-shadow2 {
10% {
  box-shadow: #38a2482a 1px 1px 35px 35px ;
}
20% {
  box-shadow: #3856a20f 1px 1px 85px 85px ;
}
30% {
  box-shadow: #a2383848 1px 1px 55px 45px  ;
}
40% {
  box-shadow: #38a2482a 1px 1px 35px 35px ;
}
50% {
  box-shadow: #3856a20f 1px 1px 85px 85px ;
}
60% {
  box-shadow: #a2383848 1px 1px 55px 45px  ;
}
70% {
  box-shadow: #38a2482a 1px 1px 35px 35px ;
}
80% {
  box-shadow: #3856a20f 1px 1px 85px 85px ;
}
90% {
  box-shadow: #a2383848 1px 1px 55px 45px  ;
}
100% {
  box-shadow: #38a2482a 1px 1px 35px 35px ;     

}

}

.microphone:hover {
  color: #a23838;
  transition: all 0.3s ease;

  border: #f7a7a7 2px solid;


  background: linear-gradient(to right, #0d0d0d94,  #88464555, #0000007c);
}

.microphone{

  border: #f7a7a736 2px solid;
}

</style>
