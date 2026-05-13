<template>
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form @submit.prevent="onLogin">
    <!-- email Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Correo</label>
      <input
        v-model = "myForm.email"
        ref="emailInputRef"
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Contraseña</label>
      <input
        v-model = "myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">

      <input
       v-model = "myForm.rememberMe"
       type="checkbox" id="remember" name="remember" class="text-blue-500" />
      <label for="remember" class="text-gray-600 ml-2">Recordar Usuario</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Olvidates la contraseña?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Ingresar
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">Registrate</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from 'vue-toastification';


const authStore = useAuthStore();
const toast = useToast();
const emailInputRef = ref<HTMLInputElement|null>(null);
const passwordInputRef = ref<HTMLInputElement|null>(null);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


//agrupamos los campos del formulario
const myForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
})


const onLogin = async() => {

  //quitamos espacios
  myForm.email = myForm.email.trim();


  if (myForm.email === ""){
    toast.warning("Debes introducir el correo");
    return emailInputRef.value?.focus();
  }

  if(!emailRegex.test(myForm.email)){
    toast.warning('por favor introduce un correo electronico')
  }

  if(myForm.password.length < 8){
    toast.warning('lacontraseña debe de tener 8 caracteres')
    return passwordInputRef.value?.focus();
  }

  if (myForm.rememberMe){
    localStorage.setItem('email', myForm.email);
  }else{
    localStorage.removeItem('email');
  }


  const ok = await authStore.login(myForm.email, myForm.password);

  if(ok ) return;

 toast.error('el usuario o contraseña introducidos no son correctos');
};
</script>
