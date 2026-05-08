<template>
  <nav class="fixed top-0 left-0 z-20 w-full border-b border-gray-200 bg-white py-2.5 px-6 sm:px-4">
    <div class="container mx-auto flex max-w-6xl flex-wrap items-center justify-between">
      
      <RouterLink to="/" class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-3 h-6 text-blue-500 sm:h-9">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
        <span class="self-center whitespace-nowrap text-xl font-semibold hidden sm:block">Termcode</span>
      </RouterLink>

      <div class="flex-1 max-w-[150px] xs:max-w-xs mx-2 sm:mx-4 lg:max-w-md">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            v-model="searchTerm"
            @keyup.enter="onSearch"
            type="text" 
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Buscar..."
          >
        </div>
      </div>

      <div class="flex items-center md:order-2">
        <RouterLink to="/auth/login">
          <button type="button" class="mr-2 hidden border border-blue-700 py-1.5 px-4 text-center text-sm font-medium text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 md:inline-block rounded-lg">
            Login
          </button>
        </RouterLink>
        
        <RouterLink to="/auth/register">
          <button type="button" class="hidden bg-blue-700 py-1.5 px-4 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:inline-block rounded-lg">
            Registro
          </button>
        </RouterLink>

        <button 
          @click="isMenuOpen = !isMenuOpen"
          type="button" 
          class="inline-flex items-center rounded-lg p-2 ml-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
        >
          <span class="sr-only">Menú</span>
          <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <div 
        :class="{'hidden': !isMenuOpen, 'flex': isMenuOpen}"
        class="w-full items-center justify-between md:order-1 md:flex md:w-auto" 
        id="navbar-sticky"
      >
        <ul class="mt-4 flex flex-col w-full rounded-lg border border-gray-100 bg-gray-50 p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium">
          <li>
            <RouterLink to="/" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700" active-class="text-blue-700 font-bold">
              Inicio
            </RouterLink>
          </li>
          <li><a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">Nosotros</a></li>
          <li><a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">Servicios</a></li>
          <li><a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">Contacto</a></li>
        </ul>
      </div>

      </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';


const isMenuOpen = ref(false);
const router = useRouter();
const route = useRoute();
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const searchTerm = ref(route.query.search?.toString() || '');

const onSearch = () => {
  router.push({
    query: {
      ...route.query,
      search: searchTerm.value || undefined, // Si está vacío, eliminamos el parámetro
      page: 1 // Siempre volvemos a la página 1 al buscar
    }
  });
};
</script>