<template>
    <div class="relative w-full h-screen bg-black overflow-hidden">

        <div class="absolute inset-0 gap-[85vw] flex items-start justify-start z-10 text-white text-[2vw] alegreya-sc-black-italic ml-16 mt-4 tracking-wide z-20 animatetext"> V40X 

            <span style="animation-delay: 3.5s;" class="opacity-0 text-[1.5vw] alegreya-sc-black-italic items-end justify-end z-20 animate-slide-right">| | |</span>
        </div>
        
      <!-- Background image with red overlay -->
      <div class="absolute inset-0">
        <img
          alt="Background"
          src="https://images.pexels.com/photos/29652323/pexels-photo-29652323.jpeg"
          
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-blue-800 opacity-60 mix-blend-multiply"></div>
      
         <div class="absolute inset-0 flex items-center justify-center bg-red-800 opacity-10 mix-blend-multiply">



         </div>   
    
    </div>

    <div>
        <span  class="z-2 w-full h-full animate-frame-out    absolute top-0 left-0" style=" border: 80px solid white; animation-delay: 0.4s"> </span>
    </div>
  
      <!-- Grid overlay -->
      <div class="animationgrid  hidden absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0 border border-white border-opacity-10" style="animation-delay: 1.5s;">
        <div v-for="i in 12" :key="i" class="border border-white border-opacity-10"></div>
      </div>
  
      <!-- Text animation -->
<!-- Letras animadas -->
<div class="absolute inset-0 flex items-center justify-center z-10">
  <div class="animate-shadow flex space-x-2 text-white text-[16vw] alegreya-sc-black-italic tracking-wide" style="animation-delay: 3.4s;">
    <span class="animate-slide-in  opacity-0" style="animation-delay: 2.5s">L</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 2.6s">O</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 2.7s">G</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 2.8s">I</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 2.9s">S</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 3s">T</span>
    <span class="animate-slide-in opacity-0" style="animation-delay: 3.2s">I</span>
    <span class="animate-slide-in mt-4 relative opacity-0" style="animation-delay: 3.3s; font-size: 5rem;">Q</span>
  </div>
</div>

<!-- Filtro blur con mezcla visual -->
<div style="animation-delay:2.5s ;"  class="  opacity-0 absolute top-[34%] left-0 w-full h-52 bg-gray-700 animate-fade-in blur-effect z-20"></div>
<div style="animation-delay:3.5s ; "  class=" opacity-0 absolute top-[0%] left-0 w-6 h-[100%] bg-white  z-20 animate-slide-left">


  <span style="letter-spacing: 0.7em; animation-delay: 3.5s;" class="textdown flex items-center justify-center text-black mt-4 text-[1.5vw] tracking-wide ">

    Soluciones Inteligentes by InNata
  </span>
</div>

  
      <!-- Scroll indicator -->
      <div style="letter-spacing: 2em; animation-delay: 3.5s;" class="opacity-0 absolute bottom-6 w-full text-center text-xs tracking-widest text-white anim animate-slide-in" >
        By InNata
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ScreenLoader",
  };
  </script>
  
  <style scoped>


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
.animatetext{
  animation: animtext 2s ease-in-out forwards;

}

@keyframes animtext {
  0% {
    color: black;
    
    
  }
  100% {
    color: white;
   
  
  }
}

.alegreya-sc-extrabold-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 800;
  font-style: italic;
}
.blur-effect {
  filter: blur(10px);
  mix-blend-mode: overlay; /* Prueba también screen o overlay según el fondo */
  pointer-events: none; /* Para que no afecte interacciones */
}

.animate-shadow {
  animation: shadow 3s ease-in-out forwards;
 
}

.animate-slide-left{
  animation: slideLeft 1s ease-in-out forwards;


}
@keyframes slideLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
  

.textdown{
  background:white;

  writing-mode: vertical-rl;
  text-orientation:uprigth;
}

@keyframes shadow {
  0% {
    text-shadow: 0 0 0 rgba(255, 255, 255, 0);
    
   
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.378);
  }
  100% {
    text-shadow: 0 0 0 rgba(255, 255, 255, 0);
    color: transparent;
  }
}



.alegreya-sc-black-italic {
  font-family: "Alegreya SC", serif;
  font-weight: 900;
  font-style: italic;
}
  @keyframes slideIn {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  

  .animate-slide-right{
    animation: slideRight 2s ease-out forwards;
  }

  @keyframes slideRight {
    0% {
      transform: translateX(150%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

.animate-frame-out {
    display: inline-block;
    animation: frameOut 0.8s ease-out forwards;
  }

  .animate-slide-in {
    display: inline-block;
    animation: slideIn 0.8s ease-out forwards;
  }
  .animationgrid {
    opacity: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 0;
    animation: fadeIngrid 1s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeIngrid {
    from {
      opacity: 0;
      transform: translateY(-100px);
    }
    50% {
      opacity: 1;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }

  }
  
  @keyframes frameOut {
    from {
      border: 70px solid white
    }
    to {
      border: 0px solid white;
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 1.5s ease-out forwards;
  }
  </style>