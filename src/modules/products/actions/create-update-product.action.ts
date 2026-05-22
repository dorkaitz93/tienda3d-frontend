import { shopApi } from "@/api/shopApi";
import type { Product } from "../interfaces/product.interface";


export const createUpdateProductAction = async(product : Partial<Product>) =>{

    if(product.id && product.id !== ''){
        return await updateProduct(product);
    }

    throw new Error('No implementado')

}


const updateProduct = async(product: Partial<Product>) =>{

    const images: string[] = product.images?.map(image =>{

        if(image.startsWith('http')){
            const imagenName = image.split('/').pop();
            return imagenName ? image : '';
        }

        return image

    }) ?? [];


    const productId = product.id;
    delete product.id;
    product.images = images;


    try {

        const apiUrl = import.meta.env.VITE_SHOP_API_URL;

        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/products/${productId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });

        if(!response.ok){
            throw new Error('Error en la peticion')
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}