
import { shopApi } from "@/api/shopApi";
import type { ProductResponse } from "../interfaces/product.interface";
import { getProductImageAction } from "./get-products-image.actions";

export const getProductsAction = async (page: number = 1) => {
  try {   
    const data = await shopApi(`/products?page=${page}`) as ProductResponse;

    
    return data.data.map( (product) =>({
        ...product,
        images: [getProductImageAction(product.image)]
    }));
    
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los productos');
  }
};