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
            <p class="text-3xl font-bold">${{ plan.price }}</p>
          </div>

          <div class="text-left text-sm mb-4" v-if="plan.features?.length">
            <div
              v-for="(feat, i) in plan.features"
              :key="i"
              class="mb-3"
            >
              <h3 class="font-bold mb-1">{{ feat.icon }} {{ feat.title }}</h3>
              <p class="text-white text-xs mb-1 opacity-80">{{ feat.description }}</p>
              <ul class="list-disc list-inside text-xs space-y-1 text-white opacity-90">
                <li v-for="(f, idx) in feat.items" :key="idx">{{ f }}</li>
              </ul>
            </div>
          </div>
          <button class="bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition">
            BUY NOW
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
      price: 29,

      bg: "bg-teal-800",
      features: [
        {
          icon: "🚀",
          title: "Automatización Avanzada",
          description: "Automatiza tareas como pedidos, alertas y actualizaciones de stock sin intervención manual.",
          items: [
            "Pedidos automáticos a proveedores",
            "Alertas inteligentes personalizadas"
          ]
        },

      ]
    },
    {
      name: "STANDARD",
      price: 59,
      userCount: "1",
      featureOne: "1,000",
      featureTwo: 5,
      featureThree: 5,
      bg: "bg-red-500",
      features: [
        {
          icon: "🚀",
          title: "Automatización Avanzada",
          description: "Automatiza tareas como pedidos, alertas y actualizaciones de stock sin intervención manual.",
          items: ["Pedidos automáticos a proveedores", "Alertas inteligentes personalizadas"]
        },
        {
          icon: "📊",
          title: "Reportes Avanzados",
          description: "Accede a informes personalizados y analíticas en tiempo real sobre tu inventario.",
          items: ["Reportes PDF / Excel personalizados", "Métricas visuales con gráficos detallados"]
        }
      ]
    },
    {
      name: "BUSINESS",
      price: 119,
      userCount: "1",
      featureOne: "1,000",
      featureTwo: 5,
      featureThree: 5,
      bg: "bg-blue-800",
      features: [
        {
          icon: "🔐",
          title: "Seguridad Extendida",
          description: "Controla accesos, crea permisos por roles y protege tu información con backups automáticos.",
          items: ["Gestión de usuarios y roles", "Backups automáticos diarios"]
        },
        {
          icon: "🤖",
          title: "IA Operativa",
          description: "Asistente inteligente que te ayuda a gestionar el inventario y sugerir acciones.",
          items: [
            "Chatbot con lógica empresarial",
            "Sugerencias de reabastecimiento",
            "Consultas inteligentes de stock y proveedores",
            "Generación automática de reportes"
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