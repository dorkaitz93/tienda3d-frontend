
import { shopApi } from "@/api/shopApi";
import type { ProductResponse } from "../interfaces/product.interface";
import { getProductImageAction } from "./get-products-image.actions";
import { ref } from 'vue';

export const lastPage = ref(999);


export const getProductsAction = async (page: number = 1, categoryId: string = '', search: string = '') => {
  try {

    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    // Solo añadimos category_id si tiene un valor real
    if (categoryId) {
      params.append('category_id', categoryId);
    }
    if (search) params.append('search', search);
    const data = await shopApi(`/products?${params.toString()}`) as any;


    if(data.meta?.last_page){
      lastPage.value = data.meta.last_page;
    }
    
    return data.data.map( (product: any) =>({
        ...product,
        images: [getProductImageAction(product.image)]
    }));
    
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los productos');
  }
};