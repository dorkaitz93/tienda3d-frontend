import { shopApi } from "@/api/shopApi";
import { getProductImageAction } from "./get-products-image.actions";
import type { Product } from "../interfaces/product.interface";


export const getProductById = async(productId: string):Promise<Product> => {

    if(productId ==='create'){
        return{
            id:'',
            name: '',
            slug: '',
            description:'',
            price: 0,
            stock: 0,
            images: [],
            size: '',
            dimensions: '',
            gender: '',
            material: '' as any,
            category: '' as any,
            category_id: 0
            
        }
    }


    try {
        
       
        const response = await shopApi(`/products/${productId}`) as any;

        const product = response.data ? response.data : response;
        return{
            ...product,
            images: product.image ? [getProductImageAction(product.image)] : [],
        }
    } catch (error) {
        
        console.log(error);
        throw new Error(`Error getting product by id ${productId}`)
    }

}