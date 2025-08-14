<template>




<div class="typewriter  w-70">
  <h1>SOLUCIÓN inteligente En GESTIÓN de inventarios y ventas </h1>
</div>


    
</template>

<style>

.typewriter h1 {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15em solid rgba(255, 255, 255, 0); /* The typwriter cursor */

 /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em; /* Adjust as needed */


  animation: 
  

  
    typing  3.5s steps(40, end) ,
    blink-caret 3.5s  ease-in-out ;
}

/* The typing effect */
@keyframes typing {
  from { width: 0;
    white-space:nowrap;


}
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent;}
  50% { border-color: rgb(255, 255, 255);  }
}
</style>