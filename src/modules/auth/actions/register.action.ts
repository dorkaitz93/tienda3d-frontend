import type { AuthResponse, User } from "../interfaces"


    interface RegisterError{
        ok:false;
        message: string;
    }

    interface RegisterSuccess {
        ok:true;
        user: User;
        token: string;
    }

    export const registerAction = async (name: string, email:string ,password: string) =>{
        try{
            
            const baseUrl = import.meta.env.VITE_SHOP_API_URL;

            const response = await fetch(`${baseUrl}/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name: name, email, password }) 
        });

        if(response.status === 400 || response.status === 422){
            return{
                ok:false,
                message: 'El correo introducido ya existe',
            }
        }

        if(!response.ok){
            throw new Error('Error en el servidor');
        }

        const data: AuthResponse = await response.json();

        return {
            ok:true,
            user:data.user,
            token:data.token
        }

        }catch(error){
            throw new Error('No se pudo realizar la peticion');
        }
    
    }