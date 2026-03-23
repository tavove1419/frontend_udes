import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Dialog } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:8000/api/' });

export default boot(({ app, router }) => {
  const authStore = useAuthStore();
  // for use inside Vue files (Options API) through this.$axios and this.$api
  api.interceptors.response.use(
    (res) => res,
    (er: AxiosError) => {
      if (er.response?.status === 401 && er.config?.url !== '/login') {
        Dialog.create({
          title: 'Inicio de sesion',
          message: (er.response.data as Record<string, string>).message || 'Sesión finalizada',
          html: true,
          ok: {
            label: 'Aceptar'
          }
        }).onOk(() => {
          authStore.logOut();
          router.replace('/login').catch(() => null)
        })
      } else {
        return Promise.reject(er.response?.data)
      }
    }
  )

  api.interceptors.request.use((config) => {
    const token = useAuthStore().accesToken || null;
    if(token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
