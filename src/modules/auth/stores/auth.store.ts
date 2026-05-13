import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthStatus, type User } from '../interfaces'
import { loginAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {

    const authStatus = ref(AuthStatus.Checking)
    const user = ref<User|undefined>();
    const token = ref(useLocalStorage('token', ''));


    const login = async(email: string, password: string) => {
        try{

            const loginResp = await loginAction(email, password);

            if(!loginResp.ok){
                logout();
                return false;
            }

            user.value = loginResp.user;
            token.value = loginResp.token;
            authStatus.value = AuthStatus.Authenticated;

            return true

        }catch(error){
            return logout();
        }
    };

    const logout = () =>{
        authStatus.value = AuthStatus.UnAuthenticated;
        user.value = undefined;
        token.value = '';

        return false;
    };

    return {
        user,
        token,
        authStatus,

        //getters

        isChecking: computed( () => authStatus.value === AuthStatus.Checking),
        isAuthenticated: computed( () => authStatus.value === AuthStatus.Authenticated),

        username: computed (() => user.value?.name),



        //accione
        login,
    }
})
