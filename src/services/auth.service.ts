import { AxiosResponse } from 'axios'
import { api } from 'src/boot/axios'
import { AuthInterface } from 'src/interfaces'

export function authentication(credentials: {email: string, password: string}): Promise<AxiosResponse<AuthInterface>> {
  return api.post('auth/login/', credentials);
}
