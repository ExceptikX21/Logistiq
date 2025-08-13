import { createRouter, createWebHashHistory } from 'vue-router'
import { rolesAdmin, rolesAll, rolesPro } from '@/helpers/roles';




export const routes = [

  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { hideHeader: true, hidefooter: true }
  },

  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true, ForceReload: true, role: rolesAll, title: 'Panel Principal' }
  },

  {
    path: '/productform',
    name: 'productform',
    component: () => import('../components/ProductForm.vue'),
    meta: { requiresAuth: true, ForceReload: true, role: rolesAll, title: 'Agregar Producto' } 
  },

  {
    path: '/debugFir',
    name: 'debugFir',
    component: () => import('../views/DebugFirma.vue'),
    meta: { requiresAuth: true, ForceReload: true, hidePet: true, role: rolesPro, title: 'Depuración de Firma' } 
  },

  {
    path: '/barcode',
    name: 'barcode',
    component: () => import('../components/BarcodeScanner.vue'),
    meta: { requiresAuth: true, ForceReload: true, hidePet: true, role: rolesAdmin, title: 'Escáner de Código de Barras' } 
  },

  {
    path: '/pedidoview',
    name: 'pedidoview',
    component: () => import('../views/PedidoView.vue'),
    meta: { requiresAuth: true, ForceReload: true, role: rolesAdmin, title: 'Solicitudes de compra' } 
  },

  {
    path: '/proveedorview',
    name: 'proveedorview',
    component: () => import('../views/ProveedorView.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAll, title: 'Gestión de Proveedores' } 
  },

  {
    path: '/updateproducts',
    name: 'updateproducts',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAll, title: 'Gestión de Productos' } 
  },

  {
    path: '/generatereports',
    name: 'generatereports',
    component: () => import('../views/ReportsView.vue'),
    meta: { requiresAuth: true, hidePet: true, hideTour: true, role: rolesPro, title: 'Generación de Reportes' } 
  },

  {
    path: '/sellsview',
    name: 'sellsview',
    component: () => import('../components/VentasView.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAdmin, title: 'Historial de Ventas' } 
  },

  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true, hidePet: true, ForceReload: true, role: rolesAdmin, title: 'Órdenes de Compra' } 
  },

  {
    path: '/chat-bot',
    name: 'chatbot',
    component: () => import('../views/ChatBot.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesPro, title: 'Asistente IA' } 
  },

  {
    path: '/petall',
    name: 'detalles-mascota',
    component: () => import('../components/PetAll.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAll, title: 'Detalles de Mascota' } 
  },

  {
    path: '/profileconfig',
    name: 'profileconfig',
    component: () => import('../views/ConfigProfileView.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAdmin, title: 'Configuración de Perfil' } 
  },

  {
    path: '/almacenes',
    name: 'almacenes',
    component: () => import('../components/MapComp.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesPro, title: 'Ubicación de Almacenes' } 
  },

  {
    path: '/movementsinventory',
    name: 'movementsinventory',
    component: () => import('../components/MovementsInventory.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAdmin, title: 'Movimientos de Inventario' } 
  },

  {
    path: '/cargarproductos',
    name: 'cargarproductos',
    component: () => import('../components/MasiveCarga.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesPro, title: 'Carga Masiva de Productos' } 
  },

  {
    path: '/producto/:id',
    name: 'detallesproducto',
    component: () => import('../components/ProductoDetalle.vue'),
    meta: { requiresAuth: true, hidePet: true, role: rolesAdmin, title: 'Detalle de Producto' } 
  },

  {

    path:'/screenl',
    name:'screenl',
    component:( )=> import('../components/ScreenLoader.vue'),
    meta: { requiresAuth: true, hidePet: true , hideHeader: true, hidefooter: true, hideTour: true, ForceReload: true,  }
  },
  {

    path:'/callview',
    name:'callview',
    component:( )=> import('../components/CallComponent.vue'),
    meta: { requiresAuth: true, hidePet: true , hideHeader: true, hidefooter: true, hideTour: true, ForceReload: true, role:[rolesPro], title: 'Panel de Llamadas' }
  },

  {

    path:'/productslist',
    name:'productslist',
    component:( )=> import('../components/ProductList.vue'),
    meta: { requiresAuth: true, hidePet: true , hideTour: true, ForceReload: true, role:['admin_pro'] , title: 'Listado de Productos'  }
  },


  {

    path:'/loginview',

    name:'loginview',

    component:( )=> import('../views/LoginView.vue'),
    meta: { hideHeader: true, hidefooter: true, hideTour: true, ForceReload: true, hidePet: true  },

    
  } ,
  {
    path:'/mainview',

    name:'mainview',

    component:( )=> import('../views/MainView.vue'),
    meta: { hideHeader: true, hidefooter: true, hidePet: true },

    
  } ,

  {
    path:'/contactosales',

    name:'contactosales',

    component:( )=> import('../views/ContactView.vue'),
    meta: { hideHeader: true, hidefooter: true, hidePet: true },

    
  } ,
  
  {
    path:'/pricingview',

    name:'pricingview',

    component:( )=> import('../views/PayView.vue'),
    meta: { hideHeader: true, hidefooter: true, hidePet: true },

    
  } 
  ,

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/404View.vue'),
    meta: { hideHeader: true, hidefooter: true },

    


   },
  {
    path: '/profileview', // El ? hace que el parámetro sea opcional
    name: 'ProfileView',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: false, ForceReload: true,   title: 'Mi Perfil', role: rolesAll,   },
  },
  {

    path:'/registerview',

    name:'registerview',

    component:( )=> import('../views/RegisterView.vue'),
    meta: { hideHeader: true, hidefooter: true, hideTour: true, ForceReload: true, hidePet: true,  },
  }
  




]

const router = createRouter({
  history: createWebHashHistory(),
  routes,


  
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth'
          });
        }, 500); // espera 500ms antes de hacer scroll
      });
    }
  
    // Si no hay hash, sube al tope
    return { top: 0 };
  }
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/loginview");
  }

  const rol = localStorage.getItem("rol"); // Ej: "admin"
  console.log("Rol del usuario:", rol);

  if (to.meta.role) {
    const allowedRoles = to.meta.role;

    // Si `allowedRoles` es un array, validamos con includes
    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(rol)) {
        return next("/unauthorized");
      }
    } else {
      // Si es un string simple
      if (rol !== allowedRoles) {
        return next("/unauthorized");
      }
    }
  }

  next();
});


export default router
