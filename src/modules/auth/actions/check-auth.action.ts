
import { shopApi } from "@/api/shopApi";
import type {AuthResponse, User} from "../interfaces";

interface checkError{
    ok: false;
}

interface checkSucces{
    ok: true;
    user: User;
    token: string;
}
export const checkAuthAction = async (): Promise<checkError|checkSucces> =>{
    try{
    const localToken = localStorage.getItem('token');

    if(localToken && localToken.length < 10){
        return {ok: false};
    }

    const data: AuthResponse = await shopApi('/who');

    return{
        ok:true,
        user: data.user,
        token: data.token ?? localToken
    };
    }catch(error: any){
        if(error.message === 'Unauthorized' && error.message.includes('401')){
            return{
                ok:false,

            }
        }
        throw new Error('no se pudo verificar la sesion');
    }
}