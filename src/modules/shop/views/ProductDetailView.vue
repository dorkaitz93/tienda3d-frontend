<template>
  <div class="container mx-auto px-4 py-10 max-w-6xl">
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!product" class="text-center py-20 text-gray-500">
      <h2 class="text-2xl font-bold mb-2">Producto no encontrado</h2>
      <RouterLink to="/" class="text-blue-600 hover:underline font-semibold">Volver a la tienda</RouterLink>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-10">
      
      <div class="w-full md:w-1/2 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center min-h-[400px] shadow-sm">
        <img 
          :src="product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x600?text=Sin+Imagen'" 
          :alt="product.name" 
          class="object-cover w-full h-full"
        >
      </div>

      <div class="w-full md:w-1/2 flex flex-col justify-center">
        
        <span v-if="product.category" class="text-sm text-gray-500 uppercase tracking-widest font-semibold">
          {{ product.category.name || 'Categoría' }}
        </span>
        
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">{{ product.name }}</h1>
        <p class="text-4xl font-black text-blue-600 mb-6">{{ product.price }} €</p>
        
        <p class="text-gray-600 mb-8 leading-relaxed text-lg">
          {{ product.description }}
        </p>

        <div v-if="product.category_id === 1 || product.category_id === 2" class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {{ product.category_id === 1 ? 'Elige el tamaño de la figura' : 'Elige tu talla' }}
            </h3>
            <span v-if="mostrarErrorOpcion" class="text-xs font-bold text-red-500 animate-pulse">
              ¡Debes seleccionar una opción!
            </span>
          </div>

          <div class="flex flex-wrap gap-3">
            <template v-if="product.category_id === 1">
              <button 
                v-for="tamano in opcionesFiguras" 
                :key="tamano"
                @click="opcionSeleccionada = tamano"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200',
                  opcionSeleccionada === tamano 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ tamano }}
              </button>
            </template>

            <template v-else-if="product.category_id === 2">
              <button 
                v-for="talla in tallasCamisetas" 
                :key="talla"
                @click="opcionSeleccionada = talla"
                :class="[
                  'w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border transition-all duration-200',
                  opcionSeleccionada === talla 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ talla }}
              </button>
            </template>
          </div>
        </div>
        <div class="flex items-center gap-4 border-t border-gray-200 pt-8 mt-auto">
          
          <div class="flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
            <button 
              @click="decrementar" 
              class="px-5 py-3 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="cantidad <= 1"
            >
              -
            </button>
            <span class="px-5 py-3 font-bold text-gray-900 border-x-2 border-gray-200 w-16 text-center text-lg">
              {{ cantidad }}
            </span>
            <button 
              @click="incrementar" 
              class="px-5 py-3 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="cantidad >= product.stock"
            >
              +
            </button>
          </div>

          <button 
            @click="prepararParaCarrito"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="product.stock === 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-lg">{{ product.stock === 0 ? 'Agotado' : 'Añadir al carrito' }}</span>
          </button>
        </div>
        
        <div class="mt-4 flex items-center gap-2">
          <div :class="['w-3 h-3 rounded-full', product.stock > 0 ? 'bg-green-500' : 'bg-red-500']"></div>
          <p class="text-sm text-gray-600 font-medium">
            Stock disponible: <span class="font-bold text-gray-900">{{ product.stock }}</span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProductById } from '@/modules/products/actions';  
import type { Product } from '@/modules/products/interfaces/product.interface'; 

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const product = ref<Product | null>(null); 
const cantidad = ref(1);


const opcionSeleccionada = ref('');
const mostrarErrorOpcion = ref(false);

const opcionesFiguras = ['Pequeño (10cm)', 'Mediano (15cm)', 'Grande (20cm)'];
const tallasCamisetas = ['S', 'M', 'L', 'XL', 'XXL'];
// -----------------------------------------

const cargarProducto = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id as string;
    
    if (id === 'create') {
      router.push('/');
      return;
    }

    product.value = await getProductById(id);
    
  } catch (error) {
    console.error("Error al cargar:", error);
    product.value = null;
  } finally {
    isLoading.value = false;
  }
};

const incrementar = () => {
  if (product.value && cantidad.value < product.value.stock) {
    cantidad.value++;
  }
};

const decrementar = () => {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
};

const prepararParaCarrito = () => {
  if (!product.value) return;


  if ((product.value.category_id === 1 || product.value.category_id === 2) && opcionSeleccionada.value === '') {
    mostrarErrorOpcion.value = true;
    
    
    setTimeout(() => {
      mostrarErrorOpcion.value = false;
    }, 3000);
    
    return; 
  }

  const itemParaElCarrito = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images[0] || 'https://via.placeholder.com/150', 
    cantidad: cantidad.value,
    variante: opcionSeleccionada.value // Guardamos la talla/tamaño aquí
  };

  console.log("¡Listo para enviar a Pinia!", itemParaElCarrito);
  
  // Limpiamos la opción por si quiere seguir comprando otra talla del mismo producto
  opcionSeleccionada.value = '';
};

onMounted(() => {
  cargarProducto();
});
</script>