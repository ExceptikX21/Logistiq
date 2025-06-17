<template>
    <div>
      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls, .csv" />
      <button @click="enviarProductos">Cargar productos</button>
    </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import api from '@/services/api';

  
  export default {
    data() {
      return {
        productos: [],
      };
    },
    methods: {
  handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Opción 1: Filtrado automático con sheet_to_json (recomendado)
      const parsedData = XLSX.utils.sheet_to_json(firstSheet, {
        // Ignora celdas vacías y filas completamente vacías
        defval: null,
        blankrows: false,  // <- Esto evita filas vacías
      });

      // Opción 2: Filtrado manual (si la opción 1 no funciona)
      // const parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      //   .filter(fila => fila.some(celda => celda !== null && celda !== ""));

      // Mapeo seguro (evita undefined)
      this.productos = parsedData.map((fila) => ({
        nombre: fila["Nombre"] || fila[0] || "",  // Depende de si usas header: 1 o no
        codigoBarras: fila["Código de Barras"] || fila[1] || "",
        cantidad: fila["Cantidad"] || fila[2] || 0,
        precio: fila["Precio"] || fila[3] || 0,
        tipo: fila["Tipo"] || fila[4] || "",
      }));

      console.log("Productos cargados (filtrados):", this.productos);
    };

    reader.readAsArrayBuffer(file);
  },

  async enviarProductos() {
    if (!this.productos.length) {
      alert("No hay productos válidos para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        'https://192.168.0.14:443/api/productos/carga-masiva',
        { productos: this.productos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Respuesta del servidor:', response.data);
      alert(`¡Éxito! Se insertaron ${response.data.insertados || 0} productos.`);
    } catch (error) {

if (error.response?.status === 401) {
      alert('Tu sesión ha expirado. Vuelve a iniciar sesión.');
      this.$router.push('/loginview');
    }
    if (error.response?.status === 401) {
      alert('Error 401: No autorizado. Token inválido o expirado.');
    } 
    if (error.response?.status === 409) {
      alert('codigoBarras duplicado. Verifica el archivo.');
    } 



      console.error('Error:', error.response?.data || error.message);
      alert('Error al cargar. Verifica la consola.');
    }
  },
},
  };
  </script>
  