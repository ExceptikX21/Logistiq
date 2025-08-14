<template>

  <div class="container">
    
    <img alt="A motocross rider in action on a dirt track" class="background-image" src="https://durman.com.co/wp-content/uploads/2023/05/riego-por-goteo.jpg"/>
    <div class="overlay"></div>
    <a
          style="background-color: var(--bg); color: var(--text);"
        
          class="  mr-8 left-8 cursor-pointer bg-gray-600 hover:bg-gray-700  top-6 ml-10 relative text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
          @click="$router.go(-1)"
        >
          ← Back
        </a>
        
    <div class="content">
      

    
          


        

                
      <h2 class="title">Descarga de reportes</h2>
      
      <h1 class="headline">
        Reportes en volumen,
        <span>Reportes unitarios</span>
      </h1>
      <p class="description">
        En esta sección, puedes generar y descargar reportes según tus necesidades.
        
       
        <br>
        --  Reportes en Volumen: Exporta grandes cantidades de datos en un 
        solo archivo para análisis masivo.
        <br>
        --  Reportes Unitarios: Obtén información detallada 
        de un solo producto o registro específico.      </p>
      <div class="buttons">

        <a class="button button-white" href="#" @click="generateReportVolumen">
            Reporte en VOLUMEN
          <i class="fas fa-arrow-right"></i>
        </a>

        <a class="button button-red" href="#" @click="downloadReportPDF">
            Reporte en VOLUMEN PDF
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
    <div class="footer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#33919496" fill-opacity="1" d="M0,288L48,282.7C96,277,192,267,288,245.3C384,224,480,192,576,197.3C672,203,768,245,864,250.7C960,256,1056,224,1152,229.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            reportType: '',

        }
    },
    methods: {
        

        async generateReportVolumen() {
            await this.downloadReport('volumen');
        },

        async downloadReport(type) {
            const api = api.create({
                baseURL: 'https://192.168.0.14:443',
                withCredentials: true,
                responseType: 'blob'
            });

            try {



                // Obtener el token de autenticación
                const token = localStorage.getItem('token');
                const response = await api.get(`/export-excel?type=${type}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        Authorization: `Bearer ${token}`,
                      }

                });

                // Crear un enlace para descargar el archivo
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const fecha = new Date().toISOString().slice(0, 10); // Obtiene la fecha en formato YYYY-MM-DD
link.setAttribute('download', `Reporte_${type} creado en ${fecha}.xlsx`);

                document.body.appendChild(link);
                link.click();
                link.remove();

                this.reportType = type;

            } catch (error) {
                console.error('Hubo un error al descargar el reporte', error);
            }
        },
        async downloadReportPDF(type) {
  const api = axios.create({
    baseURL: 'https://192.168.0.14:443',
    withCredentials: true,
    responseType: 'blob'
  });

  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/export-pdf?type=${type}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        Authorization: `Bearer ${token}`,
      }
    });

    // Crear enlace de descarga
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fecha = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Reporte_${type} creado en ${fecha}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    this.reportType = type;

  } catch (error) {
    console.error('Hubo un error al descargar el reporte PDF', error);
  }
}


        
    }
}
</script>

<style scoped>

*{
  
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    
   
}
body {
    
  font-family: Arial, sans-serif;


  color: white;
}
.container {
    margin: 0;
  position: relative;
  height: 100vh;
  overflow: hidden;
  max-width: 64rem;
  color: wheat;
  background-color: #1a202c;
  
}
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: .2;
  height: 100%;
  object-fit: cover;
  
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;


}
.content {
  position: relative;
  inset: 12% 10%;

  padding: 0%;
  max-width: 80%;
}
.title {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.headline {
  margin-top: 0.5rem;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  
}
.headline span {
  color: #3eb6e5;
}
.description {
    width: 90%;
  margin-top: 1rem;
  font-size: 0.875rem;
  text-shadow: #00d5ff16 1px 2px 5px;
}
.buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 5rem;
}
.button {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.button-red {
  background-color: #145da5;
  color: white;
}
.button-red:hover {
  background-color: #c53030;
}
.button-white {
  background-color: white;
  color: #1a202c;
}
.button-white:hover {
  background-color: #c53030;
}
.button i {
  margin-left: 0.5rem;
}

.footer{
    position: relative;
    top: 17%;
  

}
</style>