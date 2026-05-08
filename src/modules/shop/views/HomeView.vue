<template>
  <div class="pt-32 bg-white">
    <h1 class="text-center text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
  </div>

  <div class="flex flex-wrap items-center overflow-x-auto overflow-y-hidden py-10 justify-center bg-white text-gray-800">
    
    <button 
      @click="changeCategory('')"
      :class="selectedCategory === '' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2"
    >
      <span>Todos</span>
    </button>

    <button 
      @click="changeCategory('1')" 
      :class="selectedCategory === '1' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2"
    >
      <span>Camisetas</span>
    </button>

    <button 
      @click="changeCategory('2')"
      :class="selectedCategory === '2' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600'"
      class="flex items-center flex-shrink-0 px-5 py-3 space-x-2"
    >
      <span>Diseños 3D</span>
    </button>
  </div>

  <div v-if="!products" class="text-center h-[500px]">
    <h1 class="text-xl font-semibold">Cargando productos...</h1>
    <p class="text-gray-500">Estamos preparando tus diseños</p>
  </div>
  
  <ProductList v-else :products="products" />
    
  <ButtonPagination 
    :has-more-data="page < lastPage"
    :is-firts-page="page === 1"
    :page="page"
  />
</template>

  <script lang="ts" setup>

import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { getProductsAction, lastPage } from '@/modules/products/actions';
import ProductList from '@/modules/products/components/ProductList.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch, watchEffect } from 'vue';
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

	const { data:products = [] } = useQuery({
    queryKey:['products', { page: page, category_id: selectedCategory }],
    queryFn: () => getProductsAction(page.value, selectedCategory.value)
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
			queryKey:['products', { page: page.value + 1, category_id: selectedCategory }],
			queryFn: () => getProductsAction(page.value + 1, selectedCategory.value)
		});

	});

   

  </script>