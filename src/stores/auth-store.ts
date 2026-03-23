import { defineStore } from 'pinia'
import { AppStateInterface, AuthInterface } from 'src/interfaces'

const defaultState: AppStateInterface = {
  isAuthenticated: false,
  accesToken: null,
  userInfo: null,
}

export const useAuthStore = defineStore('auth', {
  state: () => Object.assign({}, defaultState),
  persist: true,
  actions: {

    successLogin(loginResponse: AuthInterface) {
      this.$patch({
        accesToken: loginResponse.access,
        isAuthenticated: true,
        userInfo: loginResponse.user
      })
    },


    logOut() {
      this.$patch({
        ...Object.assign({}, defaultState)
      })
    }
  }
})
