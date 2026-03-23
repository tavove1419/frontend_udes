import { useAuthStore } from "src/stores/auth-store";
import { type NavigationGuard } from "vue-router";

export const AuthGuard: NavigationGuard = (to, from, next) => {
  const store = useAuthStore()
  if(store.isAuthenticated) {
    next()
  } else {
    next({path: '/login'})
  }
}

export default AuthGuard
