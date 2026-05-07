
import { shopApi } from "@/api/shopApi";
import type { ProductResponse } from "../interfaces/product.interface";
import { getProductImageAction } from "./get-products-image.actions";
import { ref } from 'vue';

export const lastPage = ref(999);


export const getProductsAction = async (page: number = 1) => {
  try {   
    const data = await shopApi(`/products?page=${page}`) as any;


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