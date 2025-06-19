<template>
    <div class="min-h-screen flex items-center justify-center px-4"
    style="background-color: var(--bg); color: var(--text);"
    >
      <div class="flex flex-col md:flex-row gap-6">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          :class="['rounded-lg shadow-xl p-6 text-white w-72 flex flex-col items-center', plan.bg]"
        >
          <div
            class="bg-white text-center text-gray-800 relative bottom-16 rounded-t-lg py-8 px-24 mb-0"
            style="box-shadow: black 0px 0px 10px;"
          >
            <h2 class="text-sm font-semibold">{{ plan.name }}</h2>
            <p class="text-2xl font-bold">${{ plan.price }}</p>
          </div>

          <div class="text-left text-2sm mb-4" v-if="plan.features?.length">
            <div
              v-for="(feat, i) in plan.features"
              :key="i"
              class="mb-3"
            >
              <h3 class="font-bold mb-1">{{ feat.icon }} {{ feat.title }}</h3>
              <p class="text-white text-1xs mb-1 opacity-80">{{ feat.description }}</p>
              <ul class="list-disc list-inside text-1xs space-y-1 text-white opacity-90">
                <li v-for="(f, idx) in feat.items" :key="idx">{{ f }}</li>
              </ul>
            </div>
          </div>
          <button class="bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition">
            Seleccionar Plan
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // ✅ Declarar la prop correctamente
  const props = defineProps({
    includedPlans: {
      type: Array,
      default: () => ['BASIC', 'STANDARD', 'BUSINESS']
    }
  });
  
  const allPlans = [
  {
      name: "BASIC",
      price: '39.900',

      bg: "bg-teal-800",
      features: [

  {
    icon: "🧠",
    title: "Gestión Inteligente Centralizada",
    description:
      "Administra productos, proveedores y usuarios desde un solo panel con control total sobre cada entidad del sistema.",
      items: [
  "Gestión total de productos y proveedores",
  "Inventario editable con historial de movimientos",
  "Administrador con acceso completo al sistema"
]

  }
]

    },
    {
      name: "STANDARD",
      price: '79.900',
      userCount: "1",
      featureOne: "1,000",
      featureTwo: 5,
      featureThree: 5,
      bg: "bg-red-500",
      features: [
      {
  icon: "📦",
  title: "Sistema de Gestión Completo",
  description:
    "Controla cada aspecto de tu operación desde un solo lugar, con herramientas inteligentes, exportación de datos y acceso multiusuario.",
  items: [
    "Gestión total de productos y proveedores",
    "Gestión de stock en tiempo real con historial",
    "Chatbot con IA para consultas y acciones rápidas",
    "Generación de reportes profesionales (PDF y Excel)",
    "Hasta 5 usuarios con un administrador principal"
  ]
}

      ]
    },
    {
      name: "BUSINESS",
      price: '149.900',
      userCount: "1",
      featureOne: "1,000",
      featureTwo: 5,
      featureThree: 5,
      bg: "bg-blue-800",
      features: [
      {
  icon: "🧬",
  title: "Infraestructura Personalizada y Escalable",
  description:
    "Potencia tu operación con IA, gestión total, soporte exclusivo y una plataforma adaptada a tu empresa desde la base de datos hasta el diseño.",
  items: [
    "Chatbot con IA entrenado para tu operación",
    "Gestión total y reportes exportables (PDF/Excel)",
    "Base de datos exclusiva por empresa",
    "Soporte técnico dedicado vía chat o llamada",
    "Interfaz personalizable (colores, logo y más)",
    "Usuarios ilimitados con gestión de roles",
    "Gestión de movimientos de stock en tiempo real con historial",
    "Seguimiento de acciones realizadas",

    
    "Actualizaciones y mejoras continuas",
    "Capacitación y soporte personalizado"

  ]
}

      ]
    }
  ];
  
  // ✅ Filtrar los planes según la prop
  const plans = allPlans.filter(plan => props.includedPlans.includes(plan.name));
  </script>
  

  <style>

ul li {
  list-style-type: none;
  padding: 4px;
}

input{

  background-color: var(--bg);
  color: var(--text);
  border: 1px solid var(--color-secundario);
  padding: 8px;
  border-radius: 4px;
}

</style>