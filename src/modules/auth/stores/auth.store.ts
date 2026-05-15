import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';
import { registerAction } from '../actions/register.action';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);

      if (!loginResp.ok) {
        logout();
        return false;
      }

      user.value = loginResp.user;
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      return logout();
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.UnAuthenticated;
    user.value = undefined;
    token.value = '';

    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const registerResp = await registerAction(name, email, password);
      if (!registerResp.ok) {
        return { ok: false, message: registerResp.message };
      }

        user.value = registerResp.user;
        token.value = registerResp.token;
        authStatus.value = AuthStatus.Authenticated;

        return { ok: true, message: '' };
      }catch (error) {
      return { ok: false, message: 'No se pudo registrar el usuario' };
    }
  };

  const checkAuthstatus = async(): Promise<boolean> =>{
    try {
      const statusResp = await checkAuthAction();

      if(!statusResp.ok){
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      user.value = statusResp.user;
      token.value = statusResp.token;
      return true

    } catch (error) {
      logout();
      return false;
    }
  }

  return {
    user,
    token,
    authStatus,

    //getters

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    username: computed(() => user.value?.name),

    //accione
    login,
    register,
    checkAuthstatus,
  };
});
