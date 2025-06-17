<!-- <template>
    <div class="p-4">
      <video 
        id="video" 
        v-show="isShowing" 
        class="w-full rounded border" 
        autoplay 
        muted
      ></video>
      <p class="mt-2 font-semibold">Resultado: {{ result }}</p>
    </div>


<div style='text-align: center;' v-show="isShowing==false">

  <img alt='Barcode Generator TEC-IT'
       src='https://barcode.tec-it.com/barcode.ashx?data=Master-fuckeroster-12346&code=Code128&translate-esc=on'/>
</div>



  </template>
   -->
  <!-- <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { BrowserMultiFormatReader } from '@zxing/browser'
  
  const result = ref('')
  const isShowing = ref(false)
  const codeReader = new BrowserMultiFormatReader()
  let controls = null
  let videoStream = null // Guardamos el stream de video para limpiarlo luego
  
  const stopScanner = () => {
    if (controls) {
      controls.stop() // Detiene el escaneo
      controls = null
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop()) // Detiene la cámara
      videoStream = null
    }
    isShowing.value = false // Oculta el video
  }
  
  onMounted(async () => {
    try {
      isShowing.value = true
      controls = await codeReader.decodeFromVideoDevice(
        null, 
        'video', 
        (res, err) => {
          if (res) {
            result.value = res.getText()
            stopScanner() // Detiene todo al leer el código
          }
          if (err) console.error('Error escaneando:', err)
        }
      )
      // Guardamos el stream de video para limpiarlo después
      const videoElement = document.getElementById('video')
      videoStream = videoElement.srcObject
    } catch (err) {
      console.error('Error al iniciar escáner:', err)
      isShowing.value = false
    }
  })
  
  onBeforeUnmount(stopScanner) // Limpia al desmontar el componente
  </script> -->



  <template>
    
    <div class="min-h-screen" style="background-color: var(--bg); color: var(--text);">
      
      <!-- Header -->
      <header class=" shadow-sm sticky top-0 z-10">
        <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
  
          <button
            @click="isManualEntryVisible = !isManualEntryVisible"
            class="p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle manual entry"
          >
            <span class="text-xl"> <i class="fas fa-keyboard"> </i></span>
          </button>
        </div>
      </header>
  
      <main class="max-w-4xl mx-auto pb-24">
        <div style='text-align: center;' v-show="isShowing==true">
  
  <img alt='Barcode Generator TEC-IT'
     src='https://barcode.tec-it.com/barcode.ashx?data=Master-fuckeroster-12346&code=Code128&translate-esc=on'/>
  </div>
        <!-- Manual Entry -->
        <div v-if="isManualEntryVisible" class="w-full max-w-md mx-auto mb-6 px-4">
          <div class=" rounded-xl shadow-md overflow-hidden">
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-3">
                Enter Barcode Manually
              </h3>
              <form @submit.prevent="handleManualSubmit" class="flex gap-2">
  
                
                <input
                  type="text"
                  v-model="codigoBarras"
                  placeholder="Enter barcode number"
                  style="background-color: var(--bg); color: var(--text);"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
                /> 
                <button
                  type="submit"
                  class="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span class="text-lg">🔍</span>
                </button>
              </form>
              <!-- <button @click="stopScanner" class="bg-red-500 mt-6 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-red-600 transition-colors"> stop scanner</button> -->
              <p class="text-xs text-gray-500 mt-2">
                Try codes: 12345, 23456, 34567, 45678, 56789
              </p>
            </div>
          </div>
        </div>
  
        <!-- Scanner View -->
        <div class="relative w-full max-w-md mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
          <!-- Camera simulation -->
          <div class="h-full w-full flex items-center justify-center bg-gray-900 relative">
            <!-- Scan animation -->
            <div v-if="scanStatus === 'scanning' && !isLoading" 
              class="w-full h-[2px]  absolute animate-scanline z-10"
              style="box-shadow: 0 0 10px rgba(59, 130, 246, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)"
            ></div>
            
            <!-- Scan overlay -->
            <div class="border-2 border-white/50 overflow-hidden rounded-lg w-4/5 h-1/2 flex items-center justify-center relative">
                 <div class="p-4">
                  <video 
        id="video" 
         width="100%"
         
        class="w-full relative  rounded border" 
        autoplay 
        muted
      ></video>

      
    </div>
  
  
              
              <!-- Loading state -->
              <div v-if="isLoading" class="flex flex-col items-center">
                <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p class="text-white text-sm font-medium">Accessing camera...</p>
              </div>
              
              <!-- Scanning state -->
              <div v-if="scanStatus === 'scanning' && !isLoading" class="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                
                  class="/20 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 hover:/30 transition-all"
                >
                  <span class="text-lg">⌨️</span>
                  <span>ubica el código de barras en la cámara </span>
                </button>
              </div>
              
              <!-- Success state -->

            </div>
            <div v-if="scanStatus === 'success'" class="bg-green-500/90 text-white p-4 rounded-full animate-pulse">
                <span class="text-2xl">✓</span>
              </div>
              
              <!-- Error state -->
              <div v-if="scanStatus === 'error'" class="text-center">
                <div class="bg-red-500/90 text-white p-4 rounded-full flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-2">
                  <span class="text-2xl">⚠️</span>
                  <p class="text-white text-sm font-medium bg-black/50 py-1 px-3 rounded-full">
                  Product not found
                </p>
                </div>

              </div>
          </div>
          
        </div>
        <p class="mt-2 font-semibold">Resultado: {{ result }} </p>
        <!-- Scan controls -->
        <div class="mt-6 flex justify-center gap-4">
          <button 
            v-if="scanStatus === 'scanning'"
            @click="resetScan" 
            class="bg-gray-200  p-3 rounded-full hover:bg-gray-300 transition-colors"
            aria-label="Cancel scan"
          >
            <span class="text-xl">✕</span>
          </button>
          
          <button 
            v-if="scanStatus === 'success' || scanStatus === 'error'"
            @click="startScanning" 
            class="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <span class="text-lg">↻</span>
            <span>Scan Again</span>
          </button>
        </div>
  
        <!-- Camera permission error -->
        <div v-if="hasCameraPermission === false" class="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm max-w-md mx-auto text-center">
          Camera access is required to scan barcodes. Please allow camera access in your browser settings.
        </div>
  
        <!-- Scan History -->
        <div v-if="scannedProducts.length > 0" class="w-full max-w-md mx-auto mt-8 px-4">
          <div class=" rounded-xl shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h3 class="text-lg font-semibold flex items-center gap-2 ">
                <span class="text-blue-500 text-lg">🕒</span>
                Recent Scans
              </h3>
            </div>
            <ul class="divide-y divide-gray-100">
              <li v-for="product in recentScans" :key="product.id" class="hover: transition-colors">
                <button
                  class="w-full py-3 px-4 flex items-center justify-between"
                  @click="showProductDetails(product)"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        :src="product.imagen || 'https://via.placeholder.com/100?text=No+Image'" 
                        :alt="product.nombre" 
                        class="w-full h-full object-cover" 
                      />
                    </div>
                    <div class="text-left">
                      <h4 class="font-medium ">{{ product.nombre }}</h4>
                      <p class="text-sm text-gray-500">
  {{ typeof product.precio === 'number' ? `$${product.precio.toFixed(2)}` : 'N/A' }}
  </p>
  
                    </div>
                  </div>
                  <span class="text-gray-400 text-lg">›</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </main>
  
      <!-- Product Details Sheet -->
      <div 

      style=" background-color: var(--bg); color: var(--text);"
        class="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out z-20"
        :class="{ 'translate-y-0': isProductDetailsVisible, 'translate-y-full': !isProductDetailsVisible }"
      >
        <div class=" rounded-t-3xl shadow-2xl max-h-[80vh] overflow-auto pb-8">
          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-1" @click="isProductDetailsVisible = false">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          <!-- Product header -->
          <div class="flex justify-between items-start px-6 pt-2 pb-4">
            <h2 class="text-2xl font-bold ">{{ selectedProduct?.nombre }}</h2>
            <button 
              @click="isProductDetailsVisible = false"
              class="p-1 rounded-full hover:bg-gray-100"
            >
              <span class="text-gray-500 text-xl">⌄</span>
            </button>
          </div>
          
          <!-- Product image -->
          <div class="px-6 mb-6" v-if="selectedProduct">
            <div class="bg-gray-100 rounded-xl overflow-hidden">
              <img 
                :src="selectedProduct.imagen || 'https://via.placeholder.com/400x300?text=No+Image+Available'" 
                :alt="selectedProduct.nombre" 
                class="w-full h-56 object-cover"
              />
            </div>
          </div>
          
          <!-- precio and stock -->
          <div class="px-6 flex justify-between mb-6" v-if="selectedProduct">
            <div>
              <p class="text-3xl font-bold ">${{ typeof selectedProduct.precio === 'number' ? selectedProduct.precio.toFixed(2)  : 'N/A' }}</p>
              <p class="text-sm text-gray-500">Barcode: {{ selectedProduct.codigoBarras }}</p>
            </div>
            <div class="flex items-center">
              <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                selectedProduct.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`">
                {{ selectedProduct.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
          </div>
          
          <!-- Description -->
          <div class="px-6 mb-6" v-if="selectedProduct">
            <h3 class="text-lg font-semibold mb-2 ">descripcion</h3>
            <p class="">{{ selectedProduct.descripcion }}</p>
          </div>
          
          <!-- Details -->
          <div class="px-6 mb-8" v-if="selectedProduct">
            <h3 class="text-lg font-semibold mb-3 ">Details</h3>
            <div class="grid grid-cols-1 gap-4">
              <div class="flex items-center gap-3 p-3  rounded-lg">
                <span class="text-blue-500 text-xl">🏷️</span>
                <div>
                  <p class="text-sm text-gray-500">Category</p>
                  <p class="font-medium ">{{ selectedProduct.tipo}}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3  rounded-lg">
                <span class="text-blue-500 text-xl">🏭</span>
                <div>
                  <p class="text-sm text-gray-500">Manufacturer</p>
                  <p class="font-medium ">hola</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add to cart -->
          <div class="px-6" v-if="selectedProduct">
            <button 
              @click="addToCart"
              class="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <span class="text-xl">🛒</span>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'; 
  import api from '@/services/api';

  import { ref, computed, onMounted } from 'vue';
  import { BrowserMultiFormatReader } from '@zxing/browser'
  
  
  const isShowing = ref(false)
  let videoStream = ref(null)
  let controls = null
  const codeReader = new BrowserMultiFormatReader()
  const result = ref('')
  const producto = ref(null)
  const mensaje = ref('')
  
  export default {
  
    data() {
    return {

   

  
    }
  },
    props: {
      title: {
        type: String,
        default: 'Barcode Scanner'
      }
    },
  
  
    methods: {
    async startScanner() {
      try {
        this.isShowing = true
        this.controls = await this.codeReader.decodeFromVideoDevice(
          null,
          'video',
          (res, err) => {
            if (res) {
              this.result = res.getText()
              
            }
            if (err) console.error('Error escaneando:', err)
          }
        )
        const videoElement = document.getElementById('video')
        this.videoStream = videoElement.srcObject
      } catch (err) {
        console.error('Error al iniciar escáner:', err)
        this.isShowing = false
      }
    },
    stopScanner() {
      if (this.controls) {
        this.controls.stop()
        this.controls = null
      }
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop())
        this.videoStream = null
      }
      this.isShowing = false
    }
  },
  mounted() {
    this.startScanner()
  },
  beforeUnmount() {
    this.stopScanner()
  },
  onBeforeUnmount() {
    this.stopScanner();
  },
  
    setup() {
      // Scanner state
      const scanStatus = ref('idle'); // 'idle', 'scanning', 'success', 'error'
      const hasCameraPermission = ref(null);
      const isLoading = ref(false);
      
      // Manual entry state
      const isManualEntryVisible = ref(false);
      const codigoBarras = ref('');
      
      // Product state
      const scannedProducts = ref([]);
      const selectedProduct = ref(null);
      const isProductDetailsVisible = ref(false);
      
    
      
      // Computed
      const recentScans = computed(() => scannedProducts.value.slice(0, 3));
      
      // Methods
      
  
      
      const startScanning = () => {
        scanStatus.value = 'scanning';
        hasCameraPermission.value = true; // Simulate permission granted
      };
      
      const resetScan = () => {
        scanStatus.value = 'idle';
      };
      
      
      const lookupProduct = async (barcode) => {
  mensaje.value = ''
  producto.value = null
  scanStatus.value = 'idle'
  
  try {
    const token = localStorage.getItem('token')
  
    const res = await api.get(`https://192.168.0.14:443/api/products/barcode/${barcode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  
    const product = res.data
  
    // Mostrar detalles
    showProductDetails(product)
  
    // Agregar a historial si no está
    if (!scannedProducts.value.some(p => p.id === product.id)) {
      scannedProducts.value.unshift(product)
    }
  
    scanStatus.value = 'success'
  } catch (err) {

    if (err.response?.status === 404) {

            Swal.fire({
              title: "Corex AI- V40",
              footer: "verifica el código de barras", // Usamos 'footer' para el subtítulo
              text: "No se pudo encontrar el producto con el código de barras proporcionado.",
              icon: "error",
              confirmButtonText: "Aceptar"
            });

            
          } else if (err.response?.status === 401) {
           

            Swal.fire({
              title: "Corex AI- V40",
              footer: "Tu sesión ha expirado", // Usamos 'footer' para el subtítulo
              text: "Por favor, vuelve a iniciar sesión.",
              icon: "warning",
              confirmButtonText: "Aceptar"
            })
            this.$router.push("/loginview");

          } 

          
          else {
            console.error('Error buscando producto:', err);
            scanStatus.value = 'error';
            mensaje.value = 'Error al buscar el producto. Inténtalo de nuevo más tarde.';
          }
  }
  }
  
      
      const handleManualSubmit = () => {
        if (codigoBarras.value.trim()) {
          lookupProduct(codigoBarras.value.trim());
          codigoBarras.value = '';
        }
      };
      
      const showProductDetails = (product) => {
        selectedProduct.value = product;
        isProductDetailsVisible.value = true;
      };
      


  
  onMounted(async () => {
    try {
      isShowing.value = true
      controls = await codeReader.decodeFromVideoDevice(
        null, 
        'video', 
        (res, err) => {
          if (res) {

            const code = res.getText()
            result.value = code
            lookupProduct(code) // Busca el producto al escanear


            // Detiene todo al leer el código
          }
          if (err) console.error('Error escaneando:', err)
        }
      )
      // Guardamos el stream de video para limpiarlo después
      const videoElement = document.getElementById('video')
      videoStream = videoElement.srcObject
    } catch (err) {
      console.error('Error al iniciar escáner:', err)
      isShowing.value = false
    }
  })
      
      return {
        // State
        scanStatus,
        hasCameraPermission,
        isLoading,
        isManualEntryVisible,
        codigoBarras,
        scannedProducts,
        selectedProduct,
        isProductDetailsVisible,
        mensaje,
        producto,
        result,
        isShowing,
        controls,
        videoStream,
        // Methods

        
        // Computed
        recentScans,
        
        // Methods
        startScanning,
        resetScan,
       
        handleManualSubmit,
        showProductDetails,
      };
    },
    
  };
  </script>
  
  <style>
  /* Scan line animation */
  @keyframes scanline {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }
  .animate-scanline {
    animation: scanline 2s linear infinite;
  }
  </style>
  
  