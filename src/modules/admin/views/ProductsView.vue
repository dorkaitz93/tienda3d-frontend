<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl font-semibold text-gray-800">Productos</h1>
        
    <div class="py-8 w-full">
        <div class="overflow-x-auto w-full shadow rounded-lg border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">Imagen</th>
              <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
              <th class="hidden md:table-cell w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Descripcion</th>
              <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="hidden md:table-cell w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Talla</th>
              <th class="hidden md:table-cell w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Dimensiones</th>
              <th class="hidden md:table-cell w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Stock</th>
              <th class="w-1/6 text-center py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          
          <tbody class="text-gray-700">
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-4 text-gray-500 font-medium">
                Cargando el catalogo de productos
              </td>
            </tr>

            <tr v-else v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
              
              <td class="text-left py-3 px-4">
                <img
                  v-if="product.image || product.images?.[0]"
                  :src="product.image || product.images[0]"
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded shadow-sm bg-gray-100"
                />
              </td>

              <td class="text-left py-3 px-4 font-medium text-gray-900">
                <RouterLink :to ="`/admin/products/${product.id}`"
                class="hover:text-blue-500 hover:underline"
                >
                  {{ product.name }}
                </RouterLink>
              </td>

              <td class="hidden md:table-cell text-left py-3 px-4 font-medium text-gray-900">
                {{ product.description }}
              </td>

              <td class="text-left py-3 px-4 font-semibold text-gray-900">
                ${{ product.price }}
              </td>

              <td class="hidden md:table-cell text-left py-3 px-4">
                <span class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono font-bold">
                  {{ product.size }}
                </span>
              </td>

              <td class="hidden md:table-cell text-left py-3 px-4">
                <span class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono">
                  {{ product.dimensions }}
                </span>
              </td>

              <td class="hidden md:table-cell text-left py-3 px-4">
                <span class="inline-block text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono">
                  {{ product.stock }}
                </span>
              </td>

              <td class="text-center py-3 px-4">
                <button 
                  @click="onDeleteProduct(product.id)"
                  class="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 font-bold py-1.5 px-3 rounded text-sm shadow-sm"
                >
                  Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <ButtonPagination :page="page"
          :has-more-data="page < lastPage"
          :is-firts-page="page === 1"
        />
      </div>
    </div>
  
</template>
<script lang="ts" setup>

    import { watchEffect, watch } from 'vue';
    import { useQuery,useMutation, useQueryClient } from '@tanstack/vue-query';
    import { getProductsAction, lastPage } from '@/modules/products/actions';
    import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
    import { usePagination } from '@/modules/common/composables/usePagination';


    const queryClient = useQueryClient();

    const {page,search,selectedCategory} = usePagination();
    


    const { data: products, isLoading } = useQuery<any>({
    queryKey: ['products', { page: page, category_id: selectedCategory, search: search }],
    queryFn: () => getProductsAction(page.value, selectedCategory.value, search.value)
    });

    const deleteProduct = async (id: string) => {
        const apiUrl = import.meta.env.VITE_SHOP_API_URL;
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error borrando');
        return true;
    };

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });

    const onDeleteProduct = (id: string) => {
        if (window.confirm("desea eliminar este producto?")) {
            deleteMutation.mutate(id);
        }
    };

    watch(products, (newProducts) => {
        if (newProducts && newProducts.length > 0) {
            console.log("🕵️‍♂️ PRIMER PRODUCTO DE LARAVEL:", newProducts[0]);
        }
    }, { immediate: true });

    watchEffect(() =>{
      queryClient.prefetchQuery({
          queryKey: ['products', { page: page.value + 1, category_id: selectedCategory.value, search: search.value }],
          queryFn: () => getProductsAction(page.value + 1, selectedCategory.value, search.value)
    });
  })
</script>