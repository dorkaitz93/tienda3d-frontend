<template>
  <header class="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6 mt-14 shadow-lg">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto max-w-6xl relative z-10 text-center md:text-left">
      <div class="flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="md:w-1/2">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Diseños <span class="text-blue-200">Camisetas</span> y Diseños 3D <br>
          </h1>
          <p class="mt-6 text-lg text-blue-100">
            Desde figuras exclusivas impresas en 3D hasta las camisetas más top. 
            Calidad premium con envío desde el País Vasco.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a href="#catalogo" class="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              Explorar Catálogo
            </a>
            <RouterLink to="/auth/register" class="px-8 py-3 bg-blue-500 bg-opacity-30 border-2 border-blue-300 text-white font-bold rounded-xl hover:bg-opacity-40 transition-all">
              Crear Cuenta
            </RouterLink>
          </div>
        </div>
        <div class="hidden md:block md:w-1/3">
          <svg class="w-full h-auto text-blue-200 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
      </div>
    </div>
  </header>

  <main id="catalogo" class="max-w-6xl mx-auto px-4">
    
    <div class="flex flex-wrap items-center justify-center py-10 space-x-2 bg-white">
      <button 
        @click="changeCategory('')"
        :class="selectedCategory === '' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
        class="px-5 py-3"
      >
        <span>Todos</span>
      </button>

      <button 
        @click="changeCategory('1')" 
        :class="selectedCategory === '1' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
        class="px-5 py-3"
      >
        <span>Camisetas</span>
      </button>

      <button 
        @click="changeCategory('2')"
        :class="selectedCategory === '2' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
        class="px-5 py-3"
      >
        <span>Diseños 3D</span>
      </button>
    </div>

    <div v-if="!products?.length && !isLoading" class="text-center py-20 fade-in">
      <div class="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-8 rounded-2xl inline-block shadow-sm">
        <h2 class="text-2xl font-bold mb-2">No hay resultados para tu búsqueda</h2>
        <p class="text-blue-600">Te estamos devolviendo al catálogo principal...</p>
        
        <div class="w-full bg-blue-200 h-1.5 rounded-full mt-6 overflow-hidden">
          <div class="bg-blue-600 h-full animate-progress"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="isLoading" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mt-10">
      <div v-for="n in 4" :key="n" class="animate-pulse">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-xl bg-gray-200 h-72"></div>
        
        <div class="mt-4 h-5 w-3/4 rounded-lg bg-gray-200"></div>
        
        <div class="mt-3 h-4 w-1/4 rounded-lg bg-gray-200"></div>
      </div>
    </div>

    <ProductList v-else :products="products" class="fade-in" />

    <ButtonPagination 
      :has-more-data="page < lastPage"
      :is-firts-page="page === 1"
      :page="page"
    />
  </main>
</template>

  <script lang="ts" setup>

import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { getProductsAction, lastPage } from '@/modules/products/actions';
import ProductList from '@/modules/products/components/ProductList.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

	const route = useRoute();
	const router = useRouter();
	const page = computed(() => Number(route.query.page || 1));
	const queryClient = useQueryClient();
	const selectedCategory = computed(() => route.query.category_id?.toString() || '');

	const search = computed(() => route.query.search?.toString() || '');

	
	const changeCategory = (id: string) => {
		router.push({ 
        query: { 
            ...route.query, 
            page: 1, 
            category_id: id || undefined 
        } 
    });
	};

	const { data:products, isLoading } = useQuery<any>({
    queryKey:['products', { page: page, category_id: selectedCategory, search: search }],
    queryFn: () => getProductsAction(page.value, selectedCategory.value, search.value)
   });

	watch(
	() => route.query.page,
	() => {
		
		window.scrollTo({
		 top: 0,
		 behavior: 'smooth'
		})
	}
	);

	watchEffect(() => {
		queryClient.prefetchQuery({
			queryKey:['products', { page: page.value + 1, category_id: selectedCategory.value, search: search.value }],
			queryFn: () => getProductsAction(page.value + 1, selectedCategory.value, search.value)
		});

	});

  queryClient.prefetchQuery({
    queryKey: ['products', { page: 1, category_id: '1', search: '' }],
    queryFn: () => getProductsAction(1, '1', '')
  });

  queryClient.prefetchQuery({
    queryKey: ['products', { page: 1, category_id: '2', search: '' }],
    queryFn: () => getProductsAction(1, '2', '')
  });
  
  watch(() => products.value, (newProducts) => {
  
  // Guardamos la longitud en una constante para que TS no sufra
  const hasNoProducts = (newProducts as any[])?.length === 0;

  if (!isLoading.value && hasNoProducts && (search.value || selectedCategory.value)) {
    
    console.log('No se encontraron resultados, preparando redirección...');

    setTimeout(() => {
    
      if ((products.value as any[])?.length === 0) {
        changeCategory(''); 
        router.push({ query: {} }); 
      }
    }, 3500);
  }
});
  </script>

  <style scoped>

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 3.5s linear forwards;
}
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>