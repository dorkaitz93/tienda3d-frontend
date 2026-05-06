
import { shopApi } from "@/api/shopApi";
import type { ProductResponse } from "../interfaces/product.interface";

export const getProductsAction = async (page: number = 1) => {
  try {   
    const data = await shopApi(`/products?page=${page}`) as ProductResponse;

    console.log(data.data);
    return data.data;
    
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los productos');
  }
};