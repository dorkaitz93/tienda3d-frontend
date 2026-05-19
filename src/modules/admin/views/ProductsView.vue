<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl font-semibold text-gray-800">Productos</h1>
        
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Imagen</th>
              <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
              <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Descripcion</th>
              <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Talla</th>
              <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Dimensiones</th>
              <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Stock</th>
            </tr>
          </thead>
          
          <tbody class="text-gray-700">
            <tr v-if="isLoading">
              <td colspan="4" class="text-center py-4 text-gray-500 font-medium">
                Cargando el catalogo de productos
              </td>
            </tr>

            <tr v-else v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
              
              <td class="text-left py-3 px-4">
                <img
                  v-if="product.images?.[0]"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="w-12 h-16 object-cover rounded shadow-sm bg-gray-100"
                />
                <span v-else class="text-gray-400 text-xs">Sin imagen</span>
              </td>

              <td class="text-left py-3 px-4 font-medium text-gray-900">
                {{ product.name }}
              </td>

              <td class="text-left py-3 px-4 font-medium text-gray-900">
                {{ product.description }}
              </td>

              <td class="text-left py-3 px-4 font-semibold text-blue-600">
                ${{ product.price }}
              </td>

              <td class="text-left py-3 px-4">
                <span 
                  class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono font-bold"
                >
                  {{ product.size }}
                </span>
              </td>

              <td class="text-left py-3 px-4">
              <span 
              class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono"
              >
                {{ product.dimensions }}
              </span>
            </td>

              <td class="text-left py-3 px-4">
              <span 
              class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono"
              >
                {{ product.stock }}
              </span>
            </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

    import { computed, watch, watchEffect } from 'vue';
    import { useRoute} from 'vue-router';
    import { useQuery, useQueryClient } from '@tanstack/vue-query';
    import { getProductsAction } from '@/modules/products/actions';

    const route = useRoute();

    const queryClient = useQueryClient();

    const page = computed(() => Number(route.query.page || 1));
    const search = computed(() => route.query.search?.toString() || '');

    const selectedCategory = computed(() => route.query.category_id?.toString() || '');

    const { data: products, isLoading } = useQuery<any>({
    queryKey: ['products', { page: page, category_id: selectedCategory, search: search }],
    queryFn: () => getProductsAction(page.value, selectedCategory.value, search.value)
    });

        watch(
    () => route.query.page,
    () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    watchEffect(() =>{
      queryClient.prefetchQuery({
          queryKey: ['products', { page: page.value + 1, category_id: selectedCategory.value, search: search.value }],
          queryFn: () => getProductsAction(page.value + 1, selectedCategory.value, search.value)
    });
  })





</script>