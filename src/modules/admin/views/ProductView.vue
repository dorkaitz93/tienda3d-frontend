<template>
  <div> 
    <div class="bg-white px-5 py-2 rounded">
      <h1 class="text-3xl">Producto: <small class="text-blue-500">{{name}}</small></h1>
      <hr class="my-4" />
    </div>

    <form
    @submit="onSubmit"class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5">
      <div class="first-col">
        <div class="mb-4">
          <label for="title" class="form-label">Título</label>
          <CustomInput 
            v-model="name"
            v-bind="nameAttrs"
            :error="errors.name"
          />
        </div>

        <div class="mb-4">
          <label for="slug" class="form-label">Slug</label>
          <CustomInput 
            v-model="slug"
            v-bind="slugAttrs"
            :error="errors.slug"
          />
        </div>

        <div class="mb-4">
          <label for="description" class="form-label">Descripción</label>
          <CustomTextArea 
          v-model="description"
          v-bind="descriptionAttrs"
          :error="errors.description"
          />
        </div>

        <div class="flex flex-row gap-3">
          <div class="mb-4">
            <label for="price" class="form-label">Precio</label>
            <CustomInput 
            v-model.number="price"
            v-bind="priceAttrs"
            :error="errors.price"
          />
          </div>

          <div class="mb-4">
            <label for="stock" class="form-label">Stock</label>
            <CustomInput 
            v-model="stock"
            v-bind="stockAttrs"
            :error="errors.stock"
          />
          </div>
        </div>

        <div class="mb-6">
          <label class="form-label">Tipo de Producto</label>
          <div class="flex gap-4 mt-2 mb-4">
              <label class="inline-flex items-center">
                  <input type="radio" v-model="categoryId" :value="2" class="form-radio text-blue-500">
                  <span class="ml-2">Camiseta</span>
              </label>
              <label class="inline-flex items-center">
                  <input type="radio" v-model="categoryId" :value="1" class="form-radio text-blue-500">
                  <span class="ml-2">Figura 3D</span>
              </label>
          </div>
      </div>

      <div v-if="categoryId === 2" class="mb-4">
          <label class="form-label">Tallas</label>
          <div class="flex">
              <button v-for="size in allSizes" :key="size"
                  @click="toggleSize(size)"
                  type="button" 
                  :class="['cursor-pointer p-2 rounded w-14 mr-2 flex-1 transition-colors', {
                    'bg-blue-500 text-white': hasSize(size),
                    'bg-blue-100 text-gray-700 hover:bg-blue-300': !hasSize(size)
                  }]">
                  {{ size }}
              </button>
          </div>      
      </div>

      <div v-if="categoryId === 1" class="mb-4">
          <label class="form-label">Dimensiones</label>
          <CustomInput 
            v-model="dimensions"
            v-bind="dimensionsAttrs"
            :error="errors.dimensions"
          />
      </div>
    </div>
    

      <div class="first-col">
        <label for="stock" class="form-label">Imágenes</label>
        <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
          <div v-for="image in images" :key="image.value" class="flex-shrink-0">
            <img :src="image.value" :alt="name" class="w-[250px] h-[250px]" />
          </div>
        </div>
        
        <div class="col-span-2 my-2">
          <label for="image" class="form-label">Subir imagen</label>
          <input multiple type="file" id="image" class="form-control" />
        </div>

        <div v-if="categoryId === 2" class="mb-4">
          <label for="gender" class="form-label">Género</label>
          <select v-model="gender" v-bind="genderAttrs" class="form-control">
            <option value="">Seleccione</option>
            <option value="kid">Niño</option>
            <option value="women">Mujer</option>
            <option value="men">Hombre</option>
          </select>
          <span class="text-red-500" v-if="errors.gender">{{ errors.gender }}</span>
        </div>
        <div v-if="categoryId === 1" class="mb-4">
        <label class="form-label">Material</label>
        <CustomInput 
          v-model="material"
          v-bind="materialAttrs"
          :error="errors.material"
        />
      </div>

        <div class="my-4 text-right">
          <button
            :disabled="isPending"
            type="submit"
            class=" disabled:bg-gray-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>

    <div class="grid grid-cols-2 mt-2 flex-1" >
      <pre class="bg-blue-400 p-2">
        {{JSON.stringify(values, null, 2)}}
      </pre>
      <pre class="bg-red-400 p-2">
        {{JSON.stringify(errors, null, 2)}}
      </pre>
      <pre class="bg-green-400 p-2 col-span-2">
        {{JSON.stringify(meta, null, 2)}}
      </pre>
    </div>

  </div>
</template>

<script src="./ProductView.ts" lang="ts"></script>



<style scoped>


.form-label {

  @reference "tailwindcss";
  @apply block text-gray-500 text-sm font-bold mb-2;
}
.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none;
}
</style>