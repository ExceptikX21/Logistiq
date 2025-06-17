<template>


  <div class="bg-white text-gray-800">
    <!-- Header -->
    <div class="header-main fixed w-full top-0 z-10 bg-white shadow-lg  alegreya-sc-regular rounded-b-2xl">
      <div class="max-w-7xl mx-auto h-20 px-6 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold text-gradient sedgwick-ave-display-regular">LogistIQ</div>
        <nav class="space-x-6 text-sm hidden md:block">
          <a href="#features" class="text-gray-900 hover:text-blue-900 font-medium transition">Características</a>
          <a href="#demo" class="text-gray-900 hover:text-blue-900 font-medium transition">Demo</a>
          <a href="#testimonials" class="text-gray-900 hover:text-blue-900 font-medium transition">Clientes</a>
          <a href="#cta" class="bg-gradient-to-r from-blue-500 to-gray-500 text-white px-4 py-2 rounded-full  hover:from-blue-900 hover:to-gray-900 shadow-lg transition font-semibold"
          
          >Empezar</a>
        </nav>
      </div>
    </div>

    <!-- Spacer for fixed header -->
    <div class="h-20" ></div>

    <!-- Hero -->
    <section  class="bg-gradient-to-r from-blue-900 to-gray-900 text-white py-20 px-6 mb-0 text-center rounded-b-3xl shadow-lg h-100">
      <h1 class="text-6xl md:text-8xl font-bold mb-2 sedgwick-ave-display-regular drop-shadow-lg uppercase mt-8">LogistIQ</h1>
     
     
     <TextWritter class="text-xs md:text-2xl   font-bold  mb-4 alegreya-sc-regular drop-shadow-lg"></TextWritter>
      <!-- <p class="text-xl md:text-2xl mb-6 upp alegreya-sc-regular">La SOLUCIÓN inteligente para tu GESTIÓN de inventarios</p> -->
      <button class=" 
      sedgwick-ave-display-regular
      text  font-semibold px-6 py-3 rounded-full shadow-xl hover:bg-blue-100 transition"
      
      :class="[
        'transition-all duration-500 p-3 text-white',
        isFixed ? 'relative  bg-w text-white top-5 right-5  shadow-xl z-50' : 'fixed z-50 bottom-5 sedgwick-ave-display-regular  right-5 bg-blue-900'
      ]"
      >Empezar ahora</button>
    </section>


    <!-- Features -->
    <section id="features"   class="py-10 mt-0 px-6 max-w-7xl mx-auto  alegreya-sc-regular">
      <h2 style="color:#002363" class="text-4xl font-bold text-center  mb-20 sedgwick-ave-display-regular" >¿Por qué LogistIQ?</h2>


      <section ref="triggerSection" class="parallax-container w-full p-0 m-0">
  <div id="parallax" class="parallax-item">
    <div class="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
          <div class="text-blue-900 mb-4 text-4xl">
              <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataControl"
  :loop="true"
  :autoplay="true"
/>


</div>
          <h3 class="font-semibold text-xl mb-2">Control Total</h3>
          <p>Administra el stock de productos, proveedores, pedidos, ubicaciones y ventas de manera centralizada.</p>
        </div>
  </div>
  <div class="parallax-item">
    <div class="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
         
      <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataInteligencia"
  :loop="true"
  :autoplay="true"
/>
          <h3 class="font-semibold text-xl mb-2">Inteligencia Integrada</h3>
          <p>Automatiza pedidos, genera reportes y responde consultas con Corex AI.</p>
        </div>
  </div>
  <div class="parallax-item">
    <div class="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
          


             <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataSeguridad"
  :loop="true"
  :autoplay="true"
/> 
          <h3 class="font-semibold text-xl mb-2 ">Seguridad y Escalabilidad</h3>
          <p>Usuarios, permisos y separación de entornos garantizan tu privacidad.</p>
        </div>
  </div>
  <div class="parallax-item">
    <div class="text-center miniparrax p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition" style="">
          

    <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataRendimiento"
  :loop="true"
  :autoplay="true"
/>

          <h3 class="font-semibold text-xl mb-2 ">Rendimiento en Tiempo Real</h3>
          <p>Consulta movimientos, stock y actividades al instante, sin recargar la página.</p>
        </div>
        

        <div class="parallax-item">

          <div class="miniparrax text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
            <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationDataPersonalizacion"
  :loop="true"
  :autoplay="true"
/>
  <h3 class="font-semibold text-xl mb-2">Personalización Total</h3>
  <p>Colores, logos y funcionalidades adaptadas a tu marca y estilo de trabajo.</p>
</div>
        </div>

        
  </div>
  <div class="parallax-item">
    <div class="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
      <Vue3Lottie
      style="width: 300px; height: 300px; margin: auto"
  class="w-64 h-64 mx-auto"
  :animationData="animationData"
  :loop="true"
  :autoplay="true"
/>

  <h3 class="font-semibold text-xl mb-2">¡Lo Mejor de Todo!</h3>
  <p>Toma decisiones con confianza, mejora tu eficiencia y centraliza todo en una sola plataforma.</p>
</div>

  </div>
</section>
      <div class="grid md:grid-cols-3 gap-10">



      </div>
    </section>

    <!-- Visual Demo -->
    <section id="demo" class="bg-gray-50 py-16 px-6">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img src="https://images.pexels.com/photos/31781189/pexels-photo-31781189/free-photo-of-faro-naranja-brillante-contra-montanas-nevadas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Demo del sistema" class="rounded-3xl shadow-xl transform hover:scale-105 transition" />
        <div>
          <h2 class="text-3xl font-bold mb-4">Diseñado para la eficiencia</h2>
          <p class="mb-6">Nuestra interfaz moderna está optimizada para minimizar errores, mejorar la productividad y adaptarse a cualquier dispositivo.</p>
          <button class="bg-gradient-to-r from-blue-500 to-gray-500 text-white px-5 py-3 rounded-full hover:from-blue-900 hover:to-gray-900 shadow-lg transition font-semibold">Solicitar una demo</button>
        </div>
      </div>
    </section>

  
  <section id="testimonials" class="py-16 px-6 bg-white overflow-hidden">
    <h2 class="text-3xl font-bold mb-12 text-center relative">
     ¡Así evolucionamos!
      <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[30%] h-1 bg-blue-900 mt-2"></span>
    </h2>
    
    <div ref="chatContainer" class="relative">
      <!-- Carrusel -->
      <div class="testimonials-carousel">
        <transition-group name="carousel" tag="div" class="carousel-track">
          <div 
            v-for="msg in displayedMessages" 
            :key="msg.id" 
            class="carousel-slide"
            :style="{ transform: `translateX(${currentOffset}px)` }"
          >
            <div class="testimonial-card">
              <div class="flex items-start">
                <img :src="msg.avatar" alt="avatar" class="w-10 h-10 rounded-full mr-4 avatar" />
                <div class="bubble">
                  <div class="client-name">{{ msg.name }}</div>
                  <div class="text-yellow-600 text-sm rating">★★★★★</div>
                  <span class="typing-text">{{ msg.displayText }}</span>
                  <span class="typing-dots" v-if="msg.typing && !msg.completed">...</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
      
      <!-- Controles -->
      <button 
    
        @click="prevSlide" 
        class="carousel-control prev"
        :disabled="currentSlide === 0"
      >
        &lt;
      </button>
      <button 
        @click="nextSlide" 
        class="carousel-control next"
        :disabled="currentSlide >= displayedMessages.length - 1"
      >
        &gt;
      </button>
    </div>
  </section>

    <!-- Call to Action -->
    <section id="cta" class="bg-gradient-to-r from-blue-900 to-gray-900 text-white py-16 text-center rounded-t-3xl shadow-lg">
      <h2 class="text-3xl font-bold mb-4">¿Listo para transformar tu inventario?</h2>
      <p class="text-lg mb-6">Prueba LogistIQ y lleva tu negocio al siguiente nivel.</p>
      <button class=" bg-white text-blue-900 px-6 py-3 font-semibold rounded-full hover:bg-blue-100 shadow-xl transition font-bold">Crear cuenta gratuita</button>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6 text-center rounded-t-2xl">
      <p class="text-sm sedgwick-ave-display-regular">&copy; 2025 LogistIQ. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import TextWritter from '@/components/TextWritter.vue';
import { ref, onMounted, onBeforeUnmount, computed  } from 'vue';
const chatContainer = ref(null);
let observer = null;
const triggerSection = ref(null)
const isFixed = ref(false)
import animationData from '@/assets/animaciones/confianza.json' // tu animación JSON
import animationDataControl from '@/assets/animaciones/5eb520b4-eee9-49f7-8a62-f40735243cb1.json'
import animationDataInteligencia from '@/assets/animaciones/Corex.json'
import animationDataRendimiento from '@/assets/animaciones/rendimiento.json'
import animationDataSeguridad from '@/assets/animaciones/seguridada.json'

import animationDataPersonalizacion from '@/assets/animaciones/personalizacion.json'


let animationStarted = false;
const displayedMessages = ref([]);
const currentSlide = ref(0);
const slideWidth = 320; // Ancho aproximado de cada slide

const currentOffset = computed(() => {
  return -currentSlide.value * slideWidth;
});

const nextSlide = () => {
  if (currentSlide.value < displayedMessages.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const messages = [
  {
    id: 1,
    name: 'Carlos Herrera – Distribuciones Andina',
    text: 'Con LogistIQ ya no cometemos tantos errores contando productos. Nos ahorra más de 15 horas cada semana y nos dice cuándo pedir más de lo que se vende.',
    avatar: 'https://i.pravatar.cc/40?u=cliente1'
  },
  {
    id: 2,
    name: 'Lucía Gómez – Ferretería Gómez & Cía',
    text: 'Organizamos todo nuestro inventario en 3 días. Son más de 8,000 productos y ahora encontramos todo rápido con fotos y escáner. ¡Una maravilla!',
    avatar: 'https://i.pravatar.cc/40?u=cliente2'
  },
  {
    id: 3,
    name: 'Andrés Mejía – Bodega El Pinar',
    text: 'Antes hacíamos los informes a mano, ahora los descargamos en segundos. Eso solo ya vale el cambio. Todo está más claro y ordenado.',
    avatar: 'https://i.pravatar.cc/40?u=cliente3'
  },
  {
    id: 4,
    name: 'Valentina Ruiz – Inversiones Agrícolas VR',
    text: 'Pasamos de tardar 10 minutos registrando productos a menos de un minuto. Además nos avisa cuando algo se está acabando.',
    avatar: 'https://i.pravatar.cc/40?u=cliente4'
  },
  {
    id: 5,
    name: 'Julián Torres – Grupo Logístico Ruta 7',
    text: 'Tenemos varias sedes y con LogistIQ todas trabajan igual. Cada empresa tiene su color y logo. Ahora sí sentimos que es nuestro sistema.',
    avatar: 'https://i.pravatar.cc/40?u=cliente5'
  },
  {
    id: 6,
    name: 'Natalia Castro – Café Verde Orgánico',
    text: 'Vimos que teníamos productos guardados que no se movían hace meses. Nos ayudó a organizar mejor y dejar de perder plata por vencimiento.',
    avatar: 'https://i.pravatar.cc/40?u=cliente6'
  },
  {
    id: 7,
    name: 'Miguel Ríos – Insumos Eléctricos MR',
    text: 'Tenemos más de 12,000 productos y ahora los encontramos en segundos. Buscar es tan fácil como escribir una palabra.',
    avatar: 'https://i.pravatar.cc/40?u=cliente7'
  },
  {
    id: 8,
    name: 'Laura Mendoza – BioFarmacéutica LM',
    text: 'El sistema nos dice cuándo pedir más productos y evita que se nos acaben cosas importantes. Este mes evitamos 5 fallos grandes solo por eso.',
    avatar: 'https://i.pravatar.cc/40?u=cliente8'
  },
  {
    id: 9,
    name: 'Sebastián Pérez – Coltech Solutions',
    text: 'Cada persona solo ve lo que necesita. Ya no hay desorden ni riesgo de que alguien toque lo que no debe.',
    avatar: 'https://i.pravatar.cc/40?u=cliente9'
  },
  {
    id: 10,
    name: 'Isabela Duarte – Moda Express',
    text: 'Tenemos más de 2,000 prendas con foto, talla y color. Ahora los vendedores muestran todo desde el celular, sin estar buscando en libretas.',
    avatar: 'https://i.pravatar.cc/40?u=cliente10'
  },
  {
    id: 11,
    name: 'Tomás Cárdenas – Agropecuaria del Norte',
    text: 'Podemos ver todo lo que se ha movido, quién lo sacó y cuándo. Si hay un error, lo encontramos enseguida.',
    avatar: 'https://i.pravatar.cc/40?u=cliente11'
  },
  {
    id: 12,
    name: 'Camila Navarro – Almacén Navarro',
    text: 'El sistema es fácil de usar, incluso para quienes no manejaban computadoras. En 1 semana ya todo el equipo lo usaba sin problemas.',
    avatar: 'https://i.pravatar.cc/40?u=cliente12'
  }
];



onMounted(() => {


  observer = new IntersectionObserver(
    ([entry]) => {
      isFixed.value = !entry.isIntersecting
    },
    {
      threshold: 0.2, // Cambia según qué tanto debe verse la sección para activarse
    }
  )

  if (triggerSection.value) {
    observer.observe(triggerSection.value)
  }

  observer = new IntersectionObserver((entries) => {
    // Cuando el elemento entra en la vista (isIntersecting: true)
    if (entries[0].isIntersecting) {
      if (!animationStarted) {
        animationStarted = true;
        showNextMessage(); // Inicia la animación
      }
    } 
    // Cuando el elemento sale de la vista (isIntersecting: false)
    else {
      animationStarted = false;
      currentMessageIndex = 0; // Reinicia el índice si quieres que empiece desde el principio
      displayedMessages.value = []; // Opcional: limpia los mensajes
    }
  }, {
    threshold: 0.5
  });

  if (chatContainer.value) {
    observer.observe(chatContainer.value);
  }
  const parallax = document.getElementById("parallax");

// Parallax Effect for DIV 1
window.addEventListener("scroll", function () {
  let offset = window.pageYOffset;
  parallax.style.backgroundPositionY = offset * 0.7 + "px";
  // DIV 1 background will move slower than other elements on scroll.
});


  let currentMessageIndex = 0;
  
  const showNextMessage = () => {
    if (currentMessageIndex >= messages.length) return;
    
    const message = {
      ...messages[currentMessageIndex],
      displayText: '',
      typing: true,
      completed: false
    };
    
    displayedMessages.value.push(message);
    typeMessage(message, 0);
    currentMessageIndex++;
  };

  const typeMessage = (message, charIndex) => {
    if (charIndex < message.text.length) {
      setTimeout(() => {
        message.displayText = message.text.substring(0, charIndex + 1);
        typeMessage(message, charIndex + 1);
      }, getRandomSpeed());
    } else {
      message.typing = false;
      message.completed = true;
      setTimeout(showNextMessage, 1500); // Pausa antes del siguiente mensaje
    }
  };

  const getRandomSpeed = () => {
    return Math.floor(Math.random() * 50) + 20; // Velocidad variable entre 20-70ms
  };

  // Iniciar el primer mensaje

});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();

  if (observer && triggerSection.value) {
    observer.unobserve(triggerSection.value)
  }
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

html {
  scroll-behavior: smooth;
}

.parallax-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: Montserrat, sans-serif;
  width: 100%;
  min-height: 100vh;
}

.parallax-item h2 {
  font-size: 3rem;
  text-transform: uppercase;
  background-color: rgb(245, 245, 245);
  padding: 1rem;
  border-radius: 1rem;
}

.parallax-item:first-child {
  background: url("https://images.unsplash.com/photo-1675050757561-741bd739bc06?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  
 backdrop-filter: blur(10px);
  
}

.parallax-item:nth-child(2) {
  background: #ffffff;
}


.parallax-item:nth-child(3) {
  background: url("https://images.unsplash.com/photo-1643228995868-bf698f67d053?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax Effect for DIV 3 */
  min-height: 600px;
 backdrop-filter: blur(10px);

}

.parallax-item:nth-child(4) {
  background: #ffffff91;
  
}


.parallax-item:nth-child(5) {
  background: url("https://images.pexels.com/photos/14805032/pexels-photo-14805032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax Effect for DIV 3 */
  min-height: 600px;
 backdrop-filter: blur(10px);

}

@media screen and (max-width: 768px) {
  .parallax-item h2 {
    font-size: 1.5rem;
  }
}


.miniparrax:first-child {
  background: url("https://images.pexels.com/photos/3944381/pexels-photo-3944381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax Effect for DIV 3 */

 backdrop-filter: blur(10px);
  
}
.miniparrax:nth-child(2) {
  background: url("https://images.pexels.com/photos/3944381/pexels-photo-3944381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax Effect for DIV 3 */

 backdrop-filter: blur(10px);
  
}


.sedgwick-ave-display-regular {
  font-family: "Sedgwick Ave Display", cursive;
  font-weight: 400;
  font-style: normal;
}

.text-gradient {
  background: linear-gradient(to right, #b61b1bc6, #0051ffc3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.alegreya-sc-regular {
  font-family: "Alegreya SC", serif;
  font-weight: 400;
  font-style: normal;
}

.alegreya-sc-medium {
  font-family: "Alegreya SC", serif;
  font-weight: 500;
  font-style: normal;
}

.alegreya-sc-bold {
  font-family: "Alegreya SC", serif;
  font-weight: 700;
  font-style: normal;
}
.testimonials-carousel {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
  width: max-content;
}

.carousel-slide {
  flex: 0 0 auto;
  width: 300px;
  margin-right: 20px;
  transition: all 0.3s ease;
}

.testimonial-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.carousel-control {
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
  background: #171e38;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;

  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
}

.carousel-control.prev {
  left: 10px;
}

.carousel-control.next {
  right: 10px;
}

.carousel-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: black;
}

.typing-indicator {
  color: #a0aec0;
  animation: pulse 1.5s infinite;
}

.testimonial-footer {
  display: flex;
  justify-content: flex-end;
}

.quote-icon {
  width: 24px;
  height: 24px;
  fill: #e2e8f0;
}

.testimonial-fade-enter-active {
  animation: fadeInUp 0.6s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.alegreya-sc-medium-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 500;
  font-style: italic;
}

.alegreya-sc-bold-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 700;
  font-style: italic;
}

.alegreya-sc-extrabold-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 800;
  font-style: italic;
}

.alegreya-sc-black-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 900;
  font-style: italic;
}

</style>
