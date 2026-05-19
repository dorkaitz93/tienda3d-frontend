import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isAuthenticatedGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    ) => {
    
        const authStore = useAuthStore();

        if(authStore.authStatus === AuthStatus.Checking){
            await authStore.checkAuthstatus();
        }
    
        if (authStore.authStatus === AuthStatus.UnAuthenticated) {
        return { name: 'home' };
    }
    
    return true;
    };
export default isAuthenticatedGuard;
