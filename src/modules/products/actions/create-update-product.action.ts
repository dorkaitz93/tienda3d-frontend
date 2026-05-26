import { shopApi } from "@/api/shopApi";
import type { Product } from "../interfaces/product.interface";


export const createUpdateProductAction = async(product : Partial<Product>) =>{

    const productId = product.id;
    product = cleanProductForCreateUpdate(product)

    if(productId && productId !== ''){
        return await updateProduct(productId,product);
    }

    return await createProduct(product);

}

const cleanProductForCreateUpdate = (product: Partial<Product>) => {

    const images: string[] = product.images?.map(image =>{

        if(image.startsWith('http')){
            const imagenName = image.split('/').pop();
            return imagenName ? image : '';
        }

        return image

    }) ?? [];


    
    delete product.id;
    product.images = images;


    return product;
}


const updateProduct = async(productId: string, product: Partial<Product>) =>{
    try {

        const apiUrl = import.meta.env.VITE_SHOP_API_URL;

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('_method', 'PUT');


        Object.keys(product).forEach((key) => {
            const value = product[key as keyof Product];

            if (value !== undefined && value !== null) {
        
                if (key === 'image' && value instanceof File) {
                    formData.append('image', value);
                } 
                else if (Array.isArray(value)) {
                    value.forEach((item) => formData.append(`${key}[]`, item));
                }
                else if (value === null || value === undefined || value === '') {
                formData.append(key, '');
            }
                else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await fetch(`${apiUrl}/products/${productId}`, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if(!response.ok){
            const errorData = await response.json();
            console.log("Errores de Laravel:", errorData);
            throw new Error('Error en la Actualizacion')
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


const createProduct = async(product: Partial<Product>) =>{
    try {
        
        const apiUrl = import.meta.env.VITE_SHOP_API_URL;

        const token = localStorage.getItem('token');

        const formData = new FormData();


        Object.keys(product).forEach((key) => {
            const value = product[key as keyof Product];

            if (value !== undefined && value !== null) {
        
                if (key === 'image' && value instanceof File) {
                    formData.append('image', value);
                } 
                else if (Array.isArray(value)) {
                    value.forEach((item) => formData.append(`${key}[]`, item));
                }
                else if (value === null || value === undefined || value === '') {
                formData.append(key, '');
            }
                else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await fetch(`${apiUrl}/products`, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if(!response.ok){
            const errorData = await response.json();
            console.log("Errores de Laravel:", errorData);
            throw new Error('Error en la Actualizacion')
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}