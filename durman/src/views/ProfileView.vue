<template>
<audio ref="messageSound" :src="messageSound" id="messageSound" preload="auto" />

<!-- <Loader v-if="loading"></Loader> -->
<div v-if="showLoading" class="splash-screen" >    <Loader ></Loader>
</div>
    
    <div v-else-if="error">Hubo un error al cargar los productos. Intenta nuevamente.</div>


    <div v-else style="background-color: var(--bg); color: var(--text);">
  <div class="flex" v-if="user">
    
    <!-- Sidebar -->
    <div class="sidebar" v-show="showSidebar" :class="{ 'sidebar-navegation': estaActiva }">
      <svg @click="toggleButton" class="mi-icono opacity-0" id="ButtonT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
      </svg>
      <div class="sidebar-header  " v-if="rol === 'admin_pro'" v-show="rol === 'admin_pro'" >
     
      <div class="absolute h-16 mb-8">
        <img class=" rounded-full relative top-0  mb-8 " :src="logo" width="90" height="90" alt="" :class="{ 'left-0': estaActiva }" >

      </div>
      
      </div>
      <div class="sidebar-header" v-if="rol === 'usuario'" v-show="rol === 'usuario'" >
      MY ACCOUNT
      </div>
      <nav class="sidebar-nav mt-8" id="sidebar-nav" v-show="rol === 'admin_pro'" >

<!-- 1. Estructura básica -->
<router-link to="/almacenes" class="sidebar-link"><div class="flex "><i class="pr-4"> <Warehouse width="15px" height="15px"  /> </i>Almacenes</div></router-link>
<router-link to="/proveedorview" class="sidebar-link"><div class="flex "><i class=" pr-4"> <HandPlatter width="15px" height="15px"></HandPlatter> </i>Proveedores</div></router-link>

<!-- 2. Gestión de productos -->
<router-link to="/productform" class="sidebar-link"><div class=" flex"><i class=" pr-4"> <PackagePlus width="15px" height="15px"></PackagePlus> </i>Agregar productos</div></router-link>
<router-link to="/updateproducts" class="sidebar-link"><div class="flex"><i class=" pr-4"> <PackageOpen width="15px" height="15px"></PackageOpen> </i> Productos</div></router-link>


<!-- 3. Flujo operativo -->
<router-link to="/pedidoview" class="sidebar-link"><div class="flex"><i class=" pr-4"> <CircleDollarSign width="15px" height="15px"></CircleDollarSign> </i>Solicitudes de compra</div></router-link>
<router-link to="/sellsview" class="sidebar-link"> <div class="flex"> <i class=" pr-4"> <SquareLibrary width="15px" height="15px"></SquareLibrary></i> Ventas</div> </router-link>

<!-- 4. Análisis y soporte -->
<router-link to="/generatereports" class="sidebar-link"> <div class="flex"><i class=" pr-4"> <ClipboardMinus width="15px" height="15px"></ClipboardMinus> </i>Reportes</div></router-link>
<router-link to="/chat-bot" class="sidebar-link"><div class="flex"><i class=" pr-4"> <BotMessageSquare width="15px" height="15px"></BotMessageSquare> </i>IA Asistente</div></router-link>

<!-- 5. Configuración personal -->
<router-link to="/profileconfig" class="sidebar-link"><div class="flex"> <i class=" pr-4"> <Settings2 width="cd15px" height="15px"></Settings2> </i>Personalización</div></router-link>

</nav>
<nav class="sidebar-nav" id="sidebar-nav" v-if="rol === 'usuario_demo'" v-show="rol === 'usuario_demo'" >

<!-- 1. Estructura básica -->
<router-link to="/proveedorview" class="sidebar-link">Proveedores</router-link>

<!-- 2. Gestión de productos -->
<router-link to="/productform" class="sidebar-link">Agregar productos</router-link>
<router-link to="/updateproducts" class="sidebar-link">Productos</router-link>

</nav>


    </div>
    <!-- Main Content -->
    <div class="main-content">
      <header class="header grid grid-cols-3 gap-9">
        
        <span class="header-title upp opacity-9 ">

          <i class="">


            <Menu @click="ShowSidebarClick" color="#718096" :size="25" class="hover:bg-gray-200"></Menu>



          </i>

          </span>


        <div class="header-search">
          <SearchView style="margin: 0px;" />
          <span class=" ">

<Bell class="m-0" style="margin: 5px; padding: 0px;"   color="#718096"
             :size="25" />

            
        </span>

        <span>
          <Moon  
          @click="OscureOn()"
          
          color="#718096"
          :size="25"
          style="margin: 5px;"/>
        </span>
        <span>


          
          <Minimize 
          @click="entrarPantallaCompleta()"
          color="#718096"
          :size="25"
          style="margin: 5px;"/>
        </span>
        <span>

<router-link to="/profileconfig">
  <Settings  
          
          color="#718096"
          :size="25"
          style="margin: 5px;"/>
</router-link>

        </span>

          <img  alt="User avatar" @click="ShowProfileOptions()" class="user-avatar cursor-pointer" src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1742573452~exp=1742577052~hmac=48c7c8f9821ee325037cc89c5eeb29c96999fff4466de8d2ded5e202cc2d700c&w=740" style="width: 40px;" />
          <h3 class="name"></h3>


          <div class="flex items-center bg-red-500">
            <ul v-show="profileOptions" class="profile-options absolute top-10 right-0 bg-white shadow-md p-2">
<Transition name="fade-slide">

   <div class="sidebar-upgrade p-6 bg-white rounded-xl shadow-lg w-full max-w-xs">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">{{ user.username }}</h1>
    
    <ul class="space-y-3">
      <li>
        <router-link to="/profileconfig" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
          <Settings2 class="mr-3 text-blue-500" width="18" height="18" />
          <span>Personalización</span>
        </router-link>
      </li>

      <li>
        <router-link to="/profileview" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
          <Settings2 class="mr-3 text-blue-500" width="18" height="18" />
          <span>Perfil</span>
        </router-link>
      </li>

      <li>
        <router-link to="/loginview" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
          <Settings2 class="mr-3 text-blue-500" width="18" height="18" />
          <span>Configuración</span>
        </router-link>
      </li>
    </ul>

    <button 
      @click="logout"
      class="mt-8 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200"
    >
      Cerrar Sesión
    </button>
  </div>

</Transition>
            </ul>
          </div>
          
        </div>




      </header>
      <div class="dashboard p-0 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-xl font-bold mt-8 mb-2 opacity-90">Dashboard</h1>
          <p class=" mb-6">Visualiza y gestiona el estado de <b> {{ nameCompany }}</b> en un solo lugar  </p>

          <!-- Tarjetas resumen -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-0 mb-6" v-show="rol === 'admin_pro'">


            <div class=" rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full  mr-4">
                  <i class="fas fa-shopping-cart text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p class=" text-sm">Ventas totales</p>
                  <h3 class="text-2xl font-bold">{{ totalventas }}</h3>
                </div>
              </div>
          </div>
          <div class=" rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4">
                  <i class="fas fa-people-carry text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p class=" text-sm">Unidades vendidas</p>
                  <h3 class="text-2xl font-bold">{{ totalUnidadesVentas}}</h3>
                </div>
              </div>
          </div>

            <div class="  rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4">
                  <i class="fas fa-box-open text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p class=" text-sm">Productos totales</p>
                  <h3 class="text-2xl font-bold">{{ totalProducts }}</h3>
                </div>
              </div>
            </div>

            <div class=" rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full mr-4">
                  <i class="fas fa-chart-line text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p class=" text-sm">Unidades totales</p>
                  <h3 class="text-2xl font-bold">{{ totalUnidades }}</h3>
                </div>
              </div>
          </div>



            
          </div>
       


    
          <!-- Grid de productos -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">


</div>




        <div class=" rounded-lg mb-8 shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4" v-show="rol === 'admin_pro'">
  
          <div class="h-[280px] max-w-[800px]">
    <Doughnut
    v-if="chartTopProducts2"
    :data="chartTopProducts2"
    :options="chartOptions2"
  />
</div>
    <div>
      <Bar v-if="chartTopProducts" :data="chartTopProducts" :options="chartOptions" />


    </div>

  </div>





<transition name="slide" v-show="rol === 'admin_pro'"> 
  <LogsView v-if="showLogs" />

</transition>

<button v-show="rol === 'admin_pro'"
:class="showLogs ? 'bg-red-500 hover:bg-red-700 ' : 'bg-blue-500 hover:bg-blue-700 '"
class=" text-white font-bold py-2 px-4 rounded mt-4 ml-4" 
@click="toggleLogs">
  {{ showLogs ? 'Ocultar Logs' : 'Mostrar Logs' }}
</button>


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <!-- Gráfico de racha -->
                <div class=" rounded-lg shadow p-6">
            <h3 class="text-xl font-bold mb-4">Racha de días activos</h3>
            <div class="aspect-w-16 aspect-h-9" style="height: 300px;">
              <Line :data="streakData" :options="streakOptions" />
  </div>

  
          </div>

      <div class="messages" v-show="rol === 'admin_pro'">
<div class="chat-container" >
    <div class="header-chat">
      <i class="fas fa-chevron-left"></i>

      <span v-if="!receiver_id" class=" text-white font-bold">LogistIQ</span>
      <span  v-else style="font-weight: bold;">{{ users.find(u => u.id == receiver_id)?.username }} 


<span v-if="receiver_id"> - Chat</span>

      </span>
      


      <select v-model="receiver_id" class="select-user">
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
      </select>

          </div>


    <div class="chat-area" ref="chatContainer">


    <div v-if="messages.length === 0">
      <div 
      style="background-color: var(--bg);"
      class="grid grid-cols-1 items-start gap-4 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">


    <div class="flex-1">
      <div class="text-1xs relative top-0 right-0">

        <Vue3Lottie
          style="width: 200px; height: 150px"
          :animationData="animationDataThanks"
          :loop="true"
          :autoplay="true"
        />
      




      </div>
      <h3 class="text-lg font-semibold text-green-700 ">Gracias por marcar la <span >diferencia</span></h3>
      <p style="color: var(--text);" class="text-sm  mt-1" >
  Con <strong>LogistIQ</strong>, no solo optimizas tu inventario — también apoyas causas con propósito como ayudar animales y personas vulnerables. ❤️🐾
</p>


    </div>


    <!-- Modal -->
    <div
    v-if="mostrarInfo"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative animate-fade-in"
    >
      <!-- Botón de cierre -->
      <button
        @click="mostrarInfo = false"
        class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
        aria-label="Cerrar"
      >
        ✖
      </button>

      <!-- Título -->
      <h4 class=" text-2xl font-extrabold text-green-700 mb-4 text-center">
        Impulsando el Cambio
      </h4>

      <!-- Descripción principal -->
      <p class="text-base text-gray-700 leading-relaxed text-center">
        <strong>LogistIQ</strong> no solo responde a las necesidades de gestión empresarial.
        <br />
        Nace también del deseo genuino de aportar algo más: de sembrar tecnología con propósito.
        <br />
        Apoyamos iniciativas que conectan a quienes quieren ayudar con quienes más lo necesitan,
        incluyendo animales vulnerables. 🌱🐾
      </p>

      <!-- Lottie -->
      <div class="my-6 flex justify-center">
        <Vue3Lottie
          style="width: 150px; height: 150px"
          :animationData="animationData"
          :loop="true"
          :autoplay="true"
        />
      </div>

      <!-- Frase inspiradora -->
      <h6 class="text-sm font-medium text-gray-600 text-center">
        Todos somos parte del cambio: una comunidad comprometida con el bienestar del planeta y los seres que lo habitan.
      </h6>
    </div>
  </div>
  </div>
    </div>
    <button v-if="messages.length === 0"
        @click="mostrarInfo = true"
      style=" "
        class="mt-6 border-green px-4 py-1.5 text-green-800 text-xs font-medium rounded-xl hover:bg-green-200 transition"
      >
        Conoce más sobre nuestro propósito
      </button>
     
        <div v-for="msg in messages" :key="msg.id" :class="msg.sender_id === user?.id ? 'sent' : 'received'" class="chat-areaa">
          <img src="https://img.freepik.com/foto-gratis/hombre-negocios-confiado-caminando-metro-moderno-sonriendo-camara-generada-inteligencia-artificial_188544-130558.jpg?t=st=1742837512~exp=1742841112~hmac=508986cc1f2b489793727ece8d7b0dba621d7a4077cf33045ffe9d4fe7296565&w=996" >
        
          <p>{{ msg.message }}</p>
            </div>
          </div>

    <div class="input-area">
      <input class="enter-msg" v-model="newMessage" type="text" placeholder="Enter message" @keyup.enter="sendMessage" />
      <i class="fas fa-paper-plane" @click="sendMessage"></i>
    </div>
            </div>
          </div>


    </div>


        </div>

      
      </div>


      <div class="italic w-100  rounded-lg text-sm shadow p-6 text-center"> " {{ descriptionCompany }} "</div>
    </div>


    
  </div>
  <p v-else>Cargando...</p>



  <button 
  @click="restartTour"
  style="background-color: var(--color-secundario);"
  class=" fixed bottom-4 left-4  text-white px-4 py-2 rounded hover:bg-blue-700 transition">
  Tour
  <i class="fas fa-question-circle" ></i>
</button>
</div>

</template>

<script>
import { Doughnut } from 'vue-chartjs'
import Loader from "@/components/ScreenLoader.vue";
import {Vue3Lottie} from "vue3-lottie";
import animationData from "@/assets/animaciones/animalcare.json";
import { Bell } from 'lucide-vue-next';
import { Minimize } from 'lucide-vue-next';
import { Warehouse } from 'lucide-vue-next';
import { Moon } from 'lucide-vue-next';
import { HandPlatter } from 'lucide-vue-next';
import { Menu } from 'lucide-vue-next';
import { ClipboardMinus } from 'lucide-vue-next';
import { Settings2 } from 'lucide-vue-next';
import { PackagePlus } from 'lucide-vue-next';
import { BotMessageSquare } from 'lucide-vue-next';
import { SquareLibrary } from 'lucide-vue-next';
import { CircleDollarSign } from 'lucide-vue-next';
import { Settings } from 'lucide-vue-next';
import animationDataThanks from "@/assets/animaciones/cathappy.json";
import { PackageOpen } from 'lucide-vue-next';
import Swal from "sweetalert2";
import SearchView from "@/components/SearchView.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement, ArcElement } from 'chart.js';

let blinkInterval = null;
  const originalTitle = document.title;
import notifySound from "@/assets/sounds/notify.mp3";
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement);

import LogsView from "@/components/LogsView.vue";
// Cache para los gradientes
const cache = new Map();
let width = 0;
let height = 0;

import api from '@/services/api';

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Función para crear gradiente radial
function createRadialGradient3(context, c1, c2, c3) {
  const chartArea = context.chart.chartArea;
  if (!chartArea) {
    return null;
  }

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (width !== chartWidth || height !== chartHeight) {
    cache.clear();
  }
  let gradient = cache.get(c1 + c2 + c3);
  if (!gradient) {
    width = chartWidth;
    height = chartHeight;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = Math.min(
      (chartArea.right - chartArea.left) / 2,
      (chartArea.bottom - chartArea.top) / 2
    );
    const ctx = context.chart.ctx;
    gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.5, c2);
    gradient.addColorStop(1, c3);
    cache.set(c1 + c2 + c3, gradient);
  }

  return gradient;
}



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  components: { Line,
    LogsView,
    SearchView,
    Bar,
    Doughnut,
    Loader,
    Vue3Lottie,
    Bell,
    Moon,
    Settings,
    Minimize,
    Menu,
    Warehouse,
    HandPlatter,
    PackageOpen,
    PackagePlus,
    SquareLibrary,
    Settings2,

    CircleDollarSign,
    ClipboardMinus,
    BotMessageSquare

    
   },
  name: "ProfileView",
  data() {
    return {
      showLogs: true,
      user: null,
      users: [], // Lista de usuarios para seleccionar el receiver_id
      logo: "",
      isHidden: false,
      receiver_id: null,
      nameCompany:null,
      profileOptions: false,
      animationDataThanks: animationDataThanks,
      animationData: animationData,
      rol: localStorage.getItem("rol"),
      descriptionCompany: "Descripción de la empresa",   
       showLoading: true,
          
       messageSound: notifySound,
       mostrarInfo: false,
      newMessage: "",
      messages: [],
      showSidebar: true,
      socket: null,
      estaActiva : true,
      router: useRouter(), // ✅ Agregar router directamente aquí
      totalProducts: 0,
      totalUnidades: 0,
      modoOscuro : false,
      totalUnidadesVentas: 0,
      totalventas: 0,
      
      streakData: {
        labels: [],
        datasets: [{
          label: 'Días activos',
          data: [],
          borderColor: '#fff',
          backgroundColor: function(context) {
            return createRadialGradient3(
              context,
              '#FF6384',  // Rosa en el centro
              '#36A2EB',  // Azul en medio
              '#4BC0C0'   // Verde-azulado en el exterior
            );
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#36A2EB',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      streakOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '🌟 Tu Racha de Actividad 🌟',
            color: '#2693e6',
            font: {
              size: 20,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: {
              size: 16
            },
            bodyFont: {
              size: 14
            },
            callbacks: {
              label: function(context) {
                return `¡${context.parsed.y} días consecutivos! 🎯`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 14
              },
              color: getCssVar('--text')
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 14,
                weight: 'bold'
                
              },
              color: getCssVar('--text'),
            }
          }
        }
      }

      ,
      chartTopProducts: {
      labels: [],
      datasets: [
        {
          label: 'Productos Vendidos',
          data: [],
          data2: [],
          backgroundColor: [
            '#4caf50', '#ff9800', '#2196f3', '#f44336',
            '#9c27b0', '#00bcd4', '#e91e63', '#ffc107'
          ],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 30,
          hoverBackgroundColor: '#333'
        }
      ]
    },
      chartOptions: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: getCssVar('--text'),
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    title: {
      display: true,
      text: ` Productos Más Vendidos 🏆`,
      color: getCssVar('--text'),
      font: {
        size: 18,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 30
      }
    },
    tooltip: {
      //amarillo
      backgroundColor: '#FFFF00'
,
      titleColor: '#000',
      bodyColor: '#333',
      borderColor: '#ccc',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: getCssVar('--text'),
        callback: function(value) {
    return value.length > 10 ? value.slice(0, 10) + "..." : value;
  },
  maxRotation: 30,
  minRotation: 30,
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#eee'
      },
      ticks: {
        color: getCssVar('--text'),
        font: { size: 12 }
      }
    }
  },
  animation: {
    duration: 1500,
    easing: 'easeOutBounce'
  }
},
chartTopProducts2: {
  labels: ['Despachado', 'Enviado', 'Entregado'], // <- Etiquetas
  datasets: [
    {
      label: 'Estado de Ventas',
      data: [25, 40, 15], // <- Cantidades vendidas
      backgroundColor: [
        '#ff9800', '#2196f3 ', '#4caf50',

      ],
      hoverOffset: 15,
      borderColor: '#fff',
      borderWidth: 2
    }
  ]
  
},
chartOptions2: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: getCssVar('--text'),
        font: {
          size: 14,
          weight: 'bold'
        }
        
      }
      ,
      padding: 20
    },
    title: {
      display: true,
      text: ' Ventas de esta semana ',
      color: getCssVar('--text'),
      font: {
        size: 18,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 30
      }
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#000',
      bodyColor: '#333',
      borderColor: '#ccc',
      borderWidth: 1
    }
  },
  animation: {
    duration: 1500,
    easing: 'easeOutBounce'
  }
}



    
    };
    
  },

  

  async created() {

    this.stopTitleBlinking();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        this.router.push("/loginview");
        return;
      }

      const response = await api.get("https://192.168.0.14:443/profile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Actualizar la racha
      this.updateStreak();

      console.log("Datos recibidos:", response.data);
      this.user = response.data.user;

      // Obtener la lista de usuarios
      const usersResponse = await axios.get("https://192.168.0.14:443/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Obtener productos
      const productsResponse = await axios.get("https://192.168.0.14:443/productos", {
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true,
});

// Accede al total de productos desde la respuesta paginada
this.products = productsResponse.data.products; // Array de productos de la página actual
this.totalProducts = productsResponse.data.pagination.totalProducts; // Total de todos los productos
this.totalUnidades = productsResponse.data.pagination.totalUnidades; // Total de todas las unidades
      


const ventasResponse = await axios.get("https://192.168.0.14:443/api/ventas", {
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true,
});

// Accede al total de productos desde la respuesta paginada
this.ventas = ventasResponse.data.ventas; // Array de productos de la página actual
this.totalventas = ventasResponse.data.pagination.totalVentas; // Total de todos los productos
this.totalUnidadesVentas = ventasResponse.data.pagination.totalUnidades; // Total de todas las unidades
      


      this.users = usersResponse.data;

      // Verificaciones adicionales
      if (!this.user) {
        console.error("❌ Error: user es undefined");
        return;
      }

      if (!this.user.id) {
        console.error("❌ Error: user.id es undefined");
        return;
      }

      console.log(`✅ sender_id: ${this.user.id}`);

      // Conectar con Socket.IO
      this.socket = io("https://192.168.0.14:443", {
  auth: {
    token: localStorage.getItem('token')
  }
});


      // Escuchar mensajes entrantes
      this.socket.on('receiveMessage', (msg) => {
        this.messages.push(msg);



  // Verificar si el mensaje viene de otro usuario
  if (msg.sender_id !== this.user.id) {
    setTimeout(() => {
      const audio = this.$refs.messageSound;
      if (audio) audio.play().catch(err => console.warn("No se pudo reproducir el sonido:", err));
    });

    setTimeout(() => {
  this.startTitleBlinking()
})

  }



        setTimeout(() => {
    this.scrollToBottom();
  }, 50); // 
      });

    } catch (error) {
      if (error.response?.status === 404) {
            Swal.fire({
  title: "Corex AI- V40",
  text: "No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.",
  icon: "error",
  confirmButtonText: "Aceptar"
  
            })

            
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
          else if (error.response?.status === 409) {
            Swal.fire({
  title: "Corex AI- V40",
  footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
  text: "Se ha modificado el producto por otro usuario, por favor recargue la página",
  icon: "error",
  confirmButtonText: "Aceptar"
});
            
          }
          
          
          else {
            alert(
              error.response?.data?.error || "Ocurrió un error inesperado."
              

            );
            this.$router.push("/loginview");
          }
  
    }


    await this.fetchTopProducts();
  
    const configString = localStorage.getItem("configuracion");
if (!configString) {
    console.log("No hay configuración guardada");
    return;
}

 const configRaw = localStorage.getItem("configuracion");

  // Validar que sea un JSON válido y no esté vacío o sea "undefined"
  if (configRaw && configRaw !== "undefined" && configRaw !== "") {
    try {
      const config = JSON.parse(configRaw);
      this.logo = config.logo_url || "https://placehold.co/600x400";
      this.primaryColor = config.color_primario || "#0d3345";
      this.secondaryColor = config.color_secundario || "#0d3345";
      this.nameCompany = config.nombre_empresa || "Mi Empresa";
      this.descriptionCompany = config.descripcion || "Descripción de la empresa";

    } catch (error) {
      console.error("⚠️ Error al parsear la configuración:", error);
    }
  } else {
    console.warn("⚠️ No hay configuración válida en localStorage");
  }
  },

  setup() {
    const router = useRouter()

    function restartTour() {
      localStorage.removeItem('tourCompleted')
      router.push('/') // aquí router existe bien
    }

    return {
      restartTour
    }
  },

  methods: {

    OscureOn() {

      const root = document.documentElement;

if (!this.modoOscuro) {
  root.style.setProperty('--bg', '#1a202c');
  root.style.setProperty('--text', '#f7fafc');
  root.style.setProperty('--color-secundario', '#2d3748');
} else {
  root.style.setProperty('--bg', '#ffffff');
  root.style.setProperty('--text', '#000000');
  root.style.setProperty('--color-secundario', '#e2e8f0');
}

this.modoOscuro = !this.modoOscuro;



    },

    ShowSidebarClick() {
      // this.showSidebar = !this.showSidebar

      this.estaActiva = !this.estaActiva
    },
   startTitleBlinking() {
  if (blinkInterval) return; // Evitar múltiples intervalos

  let toggle = false;
  blinkInterval =  setInterval(() => {
    document.title = toggle ? "(1) Nuevo mensaje" : originalTitle;
    toggle = !toggle;
  }, 1000); // cambia cada 1 segundo
},
entrarPantallaCompleta() {
  const elem = document.documentElement; // toda la página

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE
    elem.msRequestFullscreen();
  }
}
,

// Función para detener el parpadeo
 stopTitleBlinking() {
  clearInterval(blinkInterval);
  blinkInterval = null;
  document.title = originalTitle;
},




// Cuando el usuario vuelve al tab, restaurar el título


    async fetchTopProducts() {
  const token = localStorage.getItem("token");
  const response = await axios.get("https://192.168.0.14:443/api/reportes/mas-vendidos", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const labels = response.data.map(p => p.nombre);
  const data = response.data.map(p => parseInt(p.total_vendidos, 10));
  const data2 = response.data.map(p => {
  const val = parseInt(p.total_vendidos, 10) - 100;
  return val < 0 ? 0 : val;  // no permito valores negativos
});

  console.log(data2);

  this.chartTopProducts = {
    labels,
    datasets: [
      {
        label: "Más vendidos",
        data,
        backgroundColor: "#4CAF50",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
      // {
      //   label: "Total vendidos",
      //   data: data2,  
        
      //   backgroundColor: "#FF6384",
      //   borderColor: "#FF6384",
      //   borderWidth: 1,
      // }
    ]
  };

  this.loading = false;
}
,


    updateStreak() {
      // Obtener la racha guardada
      let streak = JSON.parse(localStorage.getItem('loginStreak')) || {
        dates: [],
        lastLogin: null
      };

      const today = new Date().toISOString().split('T')[0];
      
      // Si es el primer login o es un día diferente al último login
      if (!streak.lastLogin || streak.lastLogin !== today) {
        streak.dates.push(today);
        streak.lastLogin = today;
        
        // Mantener solo los últimos 7 días
        if (streak.dates.length > 7) {
          streak.dates = streak.dates.slice(-7);
        }
        
        // Guardar la racha actualizada
        localStorage.setItem('loginStreak', JSON.stringify(streak));
      }

      // Actualizar el gráfico
      this.streakData.labels = streak.dates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      });
      
      // Agregar efecto de curva suave y crecimiento
      const consecutiveDays = streak.dates.map((_, index) => {
        const value = index + 1;
        return value * 1.2; // Factor de crecimiento para hacer la curva más pronunciada
      });
      
      this.streakData.datasets[0].data = consecutiveDays;
    },
    logout() {
      localStorage.removeItem("token");
      this.router.push("/loginview");
    },
    ShowProfileOptions() {

      if (this.profileOptions) {
        this.profileOptions = !this.profileOptions
      }

      else {
        this.profileOptions = !this.profileOptions
      }
      
   

    },
    scrollToBottom() {
      const chatContainer = this.$refs.chatContainer;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Opción con animación suave:
        // chatContainer.scrollTo({
        //   top: chatContainer.scrollHeight,
        //   behavior: 'smooth'
        // });
      }
    },

    toggleButton() {
      const routerlinks = document.getElementById("sidebar-nav");
      routerlinks.style.transform = "translateX(-110%)";
      routerlinks.offsetWidth;
      routerlinks.classList.toggle("hidden");
      this.isHidden = !this.isHidden;

      setTimeout(() => {
        routerlinks.style.transform = "translateX(0%)";
      }, 200);
    },

    async fetchMessages() {
      if (!this.receiver_id) {
        console.error("❌ Error: receiver_id es undefined");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const messagesResponse = await axios.get(
          `https://192.168.0.14/api/messages/${this.user.id}/${this.receiver_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.messages = messagesResponse.data;
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
      }
    },

    sendMessage() {

      this.stopTitleBlinking();
  if (this.newMessage.trim()) {
    const messageData = {
      sender_id: this.user.id,
      receiver_id: this.receiver_id,
      message: this.newMessage.trim(),
    };
    this.socket.emit('sendMessage', messageData);  // Envía el mensaje al servidor
    this.newMessage = ''; // Limpia el input
  }
      setTimeout(() => {
      this.showLoading = false;
     
      // Oculta el loading después del tiempo deseado
    }, 2000); // 2000ms = 2 segundos



}
,

    toggleLogs() {

      setTimeout(() => {
         this.showLogs = !this.showLogs;
        
      } , 300);
     
    }
 
  },
  beforeMount() {
    if (this.socket) {
      this.socket.off('receiveMessage');
    }


  },

  mounted() {

    const configRaw = localStorage.getItem("configuracion");
    if (configRaw) {
      
      const config = JSON.parse(configRaw);
      this.logo = config.logo_url || "https://placehold.co/600x400";

    } else {
      console.warn("⚠️ No hay configuración válida en localStorage");
    }



    // Simulamos un tiempo mínimo de carga (ej: 2 segundos)
    const isFirstLogin = sessionStorage.getItem('isFirstLogin') === 'true';

    if (isFirstLogin) {
      // Muestra el splash por 2 segundos (ajustable)
      setTimeout(() => {
        this.showLoading = false;
        sessionStorage.removeItem('isFirstLogin'); // Limpia el estado
      }, 6000);
    } else {
      this.showLoading = false; // No mostrar en recargas
    }

  },
  



  watch: {
    receiver_id(newVal) {
      if (newVal) {
        this.fetchMessages();
      }
      
    }
  }
};
</script>

<style scoped>





svg {

  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
.flex {
  display: flex;
}

.slide-enter-active, .slide-leave-active {

transition: transform 0.5s ease, opacity 0.5s ease; /* Duración y tipo de transición */

}
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white; /* Color de fondo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegura que esté por encima de todo */
}


.slide-enter {
  box-shadow: #48bb78 0px 0px 0px 2px;
  

transform: translateX(100%); /* Comienza fuera de la pantalla a la izquierda */

opacity: 0; /* Comienza con opacidad 0 */

}


.slide-leave-to {

transform: translateX(100%); /* Sale hacia la derecha */

opacity: 0; /* Finaliza con opacidad 0 */

}

.mi-icono {
  filter: brightness(0) invert(1);
  height: 27px;
  width: 18px;
  position: relative;
  margin: px;
  padding: 0;
  top: 0.7rem;
}

.sidebar {
  width: 14rem;
  background-color: #1A202C;
  height: 100vh;
  
  color: wheat;
}

.sidebar-navegation {
  position: relative;
  
  width: 3rem;

  
  overflow: hidden;
  background-color: #1A202C;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem 0;
 
}
.enter-msg, .select-user{
  color: rgb(22, 41, 59);
}

.sidebar-header {
  padding: 0rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;

  height: 2rem;
  margin-bottom: 40px;
  
}

.sidebar-nav {
  margin-top: 1rem;
  font-size: 0.62rem;
}

.sidebar-link {
  display: block;
  padding: 0.625rem 1rem;
  text-decoration: none;
}

.name {
  text-align: center;
  font-size: 8px;
  width: 23%;
  margin: 0;
  padding: 0.1rem;
}

.sidebar-link:hover {
  background-color: #4a5568;
}

.sidebar-upgrade {

  transition: all 0.3s ease;
  margin-top: 1rem;
  padding: 1rem;

  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {

    opacity: 0;
    transform: translateX(100%);
  }
  to {

    opacity: 1;
    transform: translateX(0);
  }
}

.upgrade-button {
  width: 100%;
  background-color: var(--color-principal);
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  white-space: nowrap;
  cursor: pointer;
}

.main-content {
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  padding: 1rem;
  position: relative;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text);


  background-color: var(--bg);
}

.header svg{


  cursor: pointer;
}

.header-title {
  font-size: .8rem;

 color: var(--text);
  width: 50%;
  left: 0%;
  margin-left: .5rem;
}

.header-search {
  display: flex;
  align-items: start;
  gap: 1rem;
  
  position: relative;
  left: 2rem;
 
}



.user-avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  bottom: 0rem;
  position: relative;
 
}

.dashboard {
  
  padding-left: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  font-size: .8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  text-align: center;
  font-size: 9px;
  margin-bottom: 0rem;
}

.stat {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.stat-title {
  color: #718096;
}

.stat-value {
  font-size: .7rem;
  font-weight: bold;
}

.dashboard-graph {
  width: 100%;
  height: 200px;
 
  
}

.task-item, .message-item {
  padding: .8rem;
}

.select-user{


  width: 1rem;
}
.tasks-messages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tasks, .messages {
  
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 11px;

}

.messages{


  width: 20rem;
}

.message-item, .task-item {
  color: #2d3748;
}

.fade-slide-enter-active {
  transition: all 0.4s ease;
}
.fade-slide-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-10px);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.message-item:hover {
  color: #ffffff;
}

.task-item:hover {
  color: #ffffff;
}

.tasks-title, .messages-title {
  font-size: .7rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.border-green{

  border: #48bb4c3e solid 1px;
  background-color: #4587380e;
}

.tasks-list, .messages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item, .message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: white;
}

.task-badge-red {
  background-color: #f56565;
}

.task-badge-yellow {
  background-color: #ecc94b;
}

.task-badge-green {
  background-color: #48bb78;
}

.message-avatar {
  border-radius: 50%;
  margin-right: 0.5rem;
}

.message-sender {
  font-weight: bold;
}

.message-text {
  color: #718096;
  font-size: 0.875rem;
}

.chat-container {
background-color: var(--bg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 80vh;
  font-family: Arial, sans-serif;
}
.header-chat, .input-area {
  background: var(--color-principal);
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-area {
 height: 90%;
  overflow-y: auto;
  
}
.chat-areaa {
  display: grid;
  grid-template-columns: 20px 1fr; /* Mensaje ocupa más espacio, imagen menos */
  align-items: center;
  background-color: var(--bg);
  gap: 10px;
}

.chat-areaa img {
  width: 15px; /* Tamaño de la imagen */
  height: 15px;
  border-radius: 50%;
}
.message {
  display: flex;
  margin-bottom: 10px;
}
.message p {
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;

}
.sent p {
  background: #5ab2f531;
  color: black;
  margin-left: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 15%;
}
.received p {
  background: rgba(166, 255, 139, 0.29);
  color: black;
  margin-bottom: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 7%;
}



.chat-area {

  overflow-y: auto;
  background-color: var(--color-principal);
}
.chat-areaa {
  display: grid;
  grid-template-columns: 20px 1fr; /* Mensaje ocupa más espacio, imagen menos */
  align-items: center;
  gap: 10px;
}

.chat-areaa img {
  width: 15px; /* Tamaño de la imagen */
  height: 15px;
  border-radius: 50%;
}
.message {
  display: flex;
  margin-bottom: 10px;
}
.message p {
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;

}
.sent p {
  background: #5ab2f531;
  color: black;
  margin-left: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 15%;
}
.received p {
  background: rgba(166, 255, 139, 0.29);
  color: black;
  margin-bottom: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 7%;
}


.chat-area {

  overflow-y: auto;
  background-color: var(--bg);
}
.chat-areaa {
  display: grid;
  grid-template-columns: 20px 1fr; /* Mensaje ocupa más espacio, imagen menos */
  align-items: center;
  gap: 10px;
}

.chat-areaa img {
  width: 15px; /* Tamaño de la imagen */
  height: 15px;
  border-radius: 50%;
}
.message {
  display: flex;
  margin-bottom: 10px;
}
.message p {
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;

}
.sent p {
  background: #5ab2f531;
  color: var(--text);
  margin-left: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 15%;
}
.received p {
  background: rgba(166, 255, 139, 0.29);
  color: var(--text);
  margin-bottom: auto;
  margin-bottom: 5px;
  padding: 3%;
  border-radius: 7%;
}

</style>


