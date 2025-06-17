
<template>
    <div>
      <div class="form-l"></div>
      <div class="wrapper">
        <form @submit.prevent="registerUser">

          <div class="input-group">
            <h2 style="font-size: 15px; margin-bottom: 10px;">Registro</h2>

            <span class="icon">
              <ion-icon name="person"></ion-icon>
            </span>
            <input type="email" v-model="email" placeholder="Email" required />
          </div>

          <div class="input-group">
            <span class="icon">
              <ion-icon name="person"></ion-icon>
            </span>
            <input type="text" v-model="username" placeholder="Username" required />
          </div>
          <div class="input-group">
           
              <input type="text" v-model="empresa_id" placeholder="ID de la empresa" required />

          </div>


          <div class="input-group">
            <span class="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input type="password" v-model="password" placeholder="Password" required />
          </div>
          <div class="input-group">
            <span class="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
          </div>
          <div class="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
                  <!-- Mensajes de éxito o error -->
        <p v-if="message" style="color: green;">{{ message }}</p>
        <p v-if="error" style="color: red;">{{ error }}</p>
          <button type="submit" class="btn" >Register</button>
          <div class="sign-link">
            <p>Already have an account? <router-link to="/loginview" class="login-link">Iniciar sesión</router-link></p>
          </div>
        </form>

      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';

  
  export default {
    data() {
      return {
        username: '',
        password: '',
        email: '',
        confirmPassword: '',
        message: '',
        error: ''
      };
    },
    methods: {
      async registerUser() {
        // Validar que las contraseñas coincidan
        if (this.password !== this.confirmPassword) {
          this.error = 'Las contraseñas no coinciden';
          return;
        }
  
        try {
          const response = await api.post('https://192.168.0.14:443/register', {
            email: this.email,
            username: this.username,
            password: this.password,
            empresa_id: this.empresa_id

            
          });
  
          // Mostrar mensaje de éxito
          this.message = response.data.message;
          this.error = '';
  
          // Limpiar el formulario después del registro exitoso
          this.email = '';
          this.username = '';
          this.password = '';
          this.confirmPassword = '';

          alert('Usuario registrado correctament, sera redirigido en unos segundos');

            // Redirigir al usuario a la página de login
            setTimeout(() => {

            this.$router.push('/loginview');
        // Redirige a la ruta de login
        }, 2000); 
        } catch (err) {
          if (err.response && err.response.data && err.response.data.code === 'ER_DUP_ENTRY') {
    this.error = 'El usuario ya existe, por favor elige otro  email.';
  }
   else {
    this.error = err.response ? err.response.data.error : 'Error al registrar el usuario';
    this.message = '';
   }
          // Mostrar mensaje de error

        }
      }
    }
  };
  </script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
* {
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
    
    background-position: center;
}
.form-l{
    position: absolute;
    top: 0%;
    z-index: -1;

    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://durman.com.co/wp-content/uploads/2023/05/riego-por-goteo.jpg');
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
.input-group .icon {
    position: absolute;
    display: block;
    left: 10px;
    color: #fff;
    font-size: 1.2em;
    line-height: 45px;
}
input:focus{
    box-shadow: var(--color-principal) 0 0 5px;



}
.input-group input:not(:placeholder-shown) {
      border-color: #28a745;
      background-color: #00000036;
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
}
.btn {
    position: relative;
    width: 100%;
    height: 40px;
    background: #00c2a7;
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