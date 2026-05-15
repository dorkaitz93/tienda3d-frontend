<template>
  <h1 class="text-2xl font-semibold mb-4">Registrate</h1>
  <form @submit.prevent="onRegister">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="name" class="block text-gray-600">Nombre</label>
      <input
        v-model="myForm.name"
        ref="nameInputRef"
        type="text"
        id="name"
        name="name"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>

    <!-- Username Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="email"
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
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Crear Cuenta
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'login' }" class="hover:underline">Iniciar Sesion</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref} from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from 'vue-toastification';


const authStore = useAuthStore();
const toast = useToast();
const nameInputRef = ref<HTMLInputElement|null>(null);
const emailInputRef = ref<HTMLInputElement|null>(null);
const passwordInputRef = ref<HTMLInputElement|null>(null);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


//agrupamos los campos del formulario
const myForm = reactive({
  name: '',
  email: '',
  password: '',
})


const onRegister = async() => {

  //quitamos espacios
  myForm.email = myForm.email.trim();

  if(myForm.name === ""){
    toast.warning("Debes de introducir un nombre")
    return nameInputRef.value?.focus();
  }

  if(myForm.name.length < 2){
    toast.warning("El nombre tiene que tener mas de 2 letras")
    return nameInputRef.value?.focus();
  }

  if (myForm.email === ""){
    toast.warning("Debes introducir el correo");
    return emailInputRef.value?.focus();
  }

  if(!emailRegex.test(myForm.email)){
    toast.warning('Por favor introduce un correo electronico')
  }

  if(myForm.password.length < 8){
    toast.warning('La contraseña debe de tener 8 caracteres')
    return passwordInputRef.value?.focus();
  }



  const {ok,message}  = await authStore.register(myForm.name, myForm.email, myForm.password);

  if( ok ) return;

  toast.error(message);
};


</script>