<template>
  <div class="logs-container">
    <h1 class="title">Últimas Modificaciones Realizadas</h1>
    <div class="logs-list">
      <div


        class="log-card"
        v-for="(log, index) in logs"
        :key="index"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >


      <div 
      :class="{
      'log-insert':  log.accion === 'insert',
      'log-update':  log.accion === 'update',
      'log-delete': log.accion === 'delete',
    }"
  >

        <h1 class="log-id ">  {{ index + 1 }} </h1>
        <p class="log-time">📅 {{ formatFecha(log.fecha_hora) }}</p>
        <p><strong>👤 Usuario:</strong> {{ log.usuario }}</p>
        <p class="text-2xl"><strong>🔧  </strong><span style="font-weight: bold;" v-if="log.accion==='insert'" class=" text-green-600">INSERTO</span>
          
          <span style="font-weight: bold;" v-else-if="log.accion==='update'" class="text-yellow-600">ACTUALIZO</span>
          
          <span v-else class="text-red-600  font-bold" >ELIMINO</span> un producto</p>
        <p><strong>📦 Producto ID:</strong> #{{ log.producto_id }}</p>
        <p><strong>🌐 IP:</strong> {{ log.ip }}</p>

      </div>

      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/services/api';

  
  const logs = ref([])
  function formatFecha(fechaIso) {
  const date = new Date(fechaIso);
  const fecha = date.toLocaleDateString("es-ES");
  const hora = date.toLocaleTimeString("es-ES", { hour12: false });
  return `${fecha} ${hora}`;
}

  
  onMounted(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("https://192.168.0.14:443/logxas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      logs.value = res.data


      
    } catch (err) {
      console.error("Error al obtener logs:", err)
    }



    
  })
  </script>
  
  <style scoped>



.logs-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f63b3b, #ff8a8a); /* Degradado rojo */
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.logs-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: var(--bg);
  color: var(--text);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.8rem;
  margin-bottom: 20px;

  text-align: center;
  font-weight: 600;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.log-card {
  background-color: var(--bg);
  border-right: 4px solid var(--color-secundario);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
}

.log-card p {
  margin: 4px 0;
  font-size: 0.95rem;
  color: var(--text);
}

.log-time {
  font-size: 0.85rem;
  color: #6b7280;
}

.log-insert {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  border-radius: 8px;
color: var(--text);
  border-left: 5px solid #4caf50; /* Borde verde */
  padding: 10px;
}

.log-update {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
 

  border-left: 5px solid #2196f3; /* Borde azul */
  padding: 10px;
  border-radius: 8px;
}

.log-delete {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  border-radius: 8px;
  color: var(--text);
  border-left: 5px solid #f44336; /* Borde rojo (#f63b3b es similar) */
  padding: 10px;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(8px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
  
