import { shopApi } from "@/api/shopApi";
import { getProductImageAction } from "./get-products-image.actions";


export const getProductById = async(productId: string) => {

    //TODO: pensar la creacion de un nuevo producto


    try {
        
        const response = await shopApi(`/products/${productId}`) as any;

        const product = response.data ? response.data : response;

        console.log(product);
        return{
            ...product,
            images: product.image ? [getProductImageAction(product.image)] : [],
        }
    } catch (error) {
        
        console.log(error);
        throw new Error(`Error getting product by id ${productId}`)
    }

}