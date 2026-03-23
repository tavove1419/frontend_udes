import { AxiosResponse } from 'axios'
import { api } from 'src/boot/axios'
import { GetApplicants } from 'src/interfaces'

export function getListApplicant(id_user?: string): Promise<AxiosResponse<GetApplicants[]>> {
  return api.get('applications/', {
    params: {
      user_id: id_user
    }
  });
}

export function saveCompleteForm(data: FormData, id: string) {
  return api.post(`applications/${id}/complete/`, data)
}

export function getApplicationById(id: string) {
  return api.get(`applications/${id}`)
}

export function updateApplicant(data: FormData, id: string) {
  return api.post(`applications/${id}/update/`, data)
}

export function approvedRyc(id: string, observation?: string) {
  return api.post(`applications/${id}/approved/`, observation)
}

export function correctionRyc(id: string, observation?: string) {
  return api.post(`applications/${id}/correction/`, observation)
}

export function resolveCpg(id: string, status: string, observation?: string) {
  const data = {
    status: status,
    observation: observation
  }
  return api.post(`applications/${id}/resolve/`, data)
}
