import { api } from 'src/boot/axios'
import { UserInterface } from 'src/interfaces'

export function saveUser(data: UserInterface) {
  return api.post('user/register/', data)
}
