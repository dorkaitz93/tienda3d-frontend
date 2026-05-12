import type { AuthResponse, User } from "../interfaces";



interface LoginError{
    ok: false;
    message: string;
}

interface LoginSucces{
    ok: true;
    user: User;
    token: string;
}


export const loginAction = async(email: string, password: string): Promise<LoginError|LoginSucces> => {

    try {
        //coger url
        const baseUrl = import.meta.env.VITE_SHOP_API_URL;

        //fetch
        const response = await fetch(`${baseUrl}/login`,{
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // de objeto a texto
            body:JSON.stringify({email,password})
        });

        if (response.status === 401){
            return{
                ok:false,
                message: 'Usuario o contraseña incorrectos'
            }
        }
        // si nos devuelve algo que sea401 
        if(!response.ok){
            throw new Error('Error en el servidor');

        }

        //si todo okey...

        const data: AuthResponse = await response.json();

        return{
            ok: true,
            user: data.user,
            token: data.token
        };
    } catch (error) {
        throw new Error('No se pudo realizar la peticion');
    }   
}