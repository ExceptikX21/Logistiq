
<template>

    <div class="form-l"></div>
       <div class="wrapper">

        
        <form action="" @submit.prevent="login">
            <div class="flex justify-center items-center mb-4">
      <img src="@/assets/logoo.svg" alt="LogistIQ Logo" class="w-20 h-20" />
    </div><p class="text-sm text-gray-400 mb-6 text-center">Bienvenido, inicia sesión</p>


            <div class="input-group">
                <span class="icon">
                    <ion-icon name="person"></ion-icon>
                </span>
                <input type="text" v-model="email" placeholder="Email" required>
            </div>
            <div class="input-group">
                <span class="icon">
                    <ion-icon name="business"></ion-icon>
                </span>
                <input type="number" v-model="empresa_id" placeholder="Empresa" required>
            </div>
            <div class="input-group">
                <span class="icon">
                    <ion-icon name="lock-closed"></ion-icon>
                </span>
                <input type="password" v-model="password" id="passwordInput" placeholder="Password" required>
                <button type="button" class="absolute right-2 top-2 " style="color:aquamarine;" @click=" togglePassword()">👁</button>
            </div>
            <div class="forgot-pass">
                <a href="#">Forgot Password?</a>
                <p v-if="error" style="color: aqua;">{{ error }}</p>
            </div>
            <button type="submit" class="btn">Login</button>
            <div class="sign-link">
                <p>Don't have an account? <router-link to="/registerview" class="register-link">Register</router-link></p>
            </div>
        </form>
    </div>
   



</template>
<script>
import api from '@/services/api';


export default {
    name: 'LoginView',
    data() {
        return {
            email: "",
      password: "",
      empresa_id: "",
      error: null,
        };
    },
    methods: {
        togglePassword() {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
  },

       async login(){



      api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    
});


try {
    console.log("Ejecutando login...");
        const response = await api.post("/login", {

          password: this.password,
            empresa_id: this.empresa_id,
            email: this.email // Asumiendo que el username es el email
        });
 // Verifica que "role" esté presente

 console.log(response.data.user.rol)
        // Guardar el token en localStorage
        sessionStorage.setItem('isFirstLogin', 'true');
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rol", response.data.user.rol);
        localStorage.setItem("configuracion", JSON.stringify(response.data.configuracion));
        
        console.log(" configuracion"+ response.data.configuracion); // ✅ AGREGA ESTO
        // localStorage.setItem("empresa_id", response.data.user.empresa_id);
        
        
        // Redirigir al usuario a la página protegida (perfil)
        this.$router.push("/profileview");
      } catch (err) {
        this.error = err.response?.data?.error || "Error en el inicio de sesión";
        sessionStorage.removeItem('isFirstLogin');
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("configuracion");
        console.log("Error en el inicio de sesión:", this.error);
      }



        }





        // Add your methods here
    },
    mounted() {
        // Add your mounted logic here
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
* {

    scroll-behavior: smooth;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    
    
}
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-size: cover;
    scroll-behavior: smooth;
    background-position: center;
}
.form-l{
    position: absolute;
    top: 0%;
    z-index: -1;

    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.pexels.com/photos/29738258/pexels-photo-29738258.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    filter: blur(.8px);
}

.form-l::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 38, 43, 0.6);
}
.wrapper {
    margin-top: 2.5%;
    position: relative;
    left: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 500px;
    box-shadow: 0 0 60px #000;
    border-radius: 10px;
}


h2 {
    font-size: 2em;
    color: #fff;
    text-align: center;
}
.input-group {
    position: relative;
    width: 320px;
    margin: 30px 0;
}
.input-group input {
    width: 100%;
    height: 40px;
    font-size: 1em;
    color: #fff;
    padding: 0 10px 0 35px;
    background: transparent;
    border: 1px solid #fff;
    outline: none;
    border-radius: 5px;
}
.input-group input::placeholder {
    color: rgba(255, 255, 255, .3);
}

input:focus{
    box-shadow: var(--color-principal) 0 0 5px;



}
.input-group input:not(:placeholder-shown) {
      border-color: #28a745;
      background-color: #00000036;
    }
.input-group .icon {
    position: absolute;
    display: block;
    left: 10px;
    color: #fff;
    font-size: 1.2em;
    line-height: 45px;
}
.forgot-pass {
    margin: -15px 0 15px;
}
.forgot-pass a {
    color: #fff;
    font-size: .9em;
    text-decoration: none;
}
.forgot-pass a:hover {
    text-decoration: underline;
    text-shadow: #77d8ac 1px 1px 5px;
  
}
.btn {
    position: relative;
    width: 100%;
    height: 40px;
    background: var(--color-principal);
    box-shadow: 0 2px 10px rgba(0, 0, 0, .4);
    font-size: 1em;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .5s;
}
.btn:hover {
    background: #fff;
    color: #00c2a7;
}
.sign-link {
    font-size: .9em;
    text-align: center;
    margin: 25px 0;
}
.sign-link p {
    color: #fff;
}
.sign-link p a {
    color: #00c2a7;
    text-decoration: none;
    font-weight: 600;
}
.sign-link p a:hover {
    text-decoration: underline;
}
</style>