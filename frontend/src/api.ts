import axios from 'axios'
import { NameMovement } from './store/names/types'

// TODO: Pull from terraform on build time
const BASE_URL = process.env.REACT_APP_BASE_API_URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ErrorResponse {
  error: string
}

export interface NamesResponse {
  Remaining: string[]
  Selected?: string[]
  Rejected?: string[]
  StateId?: string
  Counterpart?: string
  Email?: string
}

export interface CreateStateResponse {
  stateId: string
}

export interface ComparisonResponse {
  names: string[]
  progress: {
    self: number
    counterpart: number
  }
}

export const getNameState = async (
  id: string,
): Promise<NamesResponse | ErrorResponse> => {
  try {
    const response = await apiClient.get<NamesResponse>(`/state/${id}`)
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    throw err
  }
}

export const getComparison = async (
  id: string,
): Promise<ComparisonResponse | ErrorResponse> => {
  try {
    const response = await apiClient.get<ComparisonResponse>(`/compare/${id}`)
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    throw err
  }
}

export const saveMovements = async (
  id: string,
  movements: Array<NameMovement>,
): Promise<NamesResponse> => {
  try {
    const response = await apiClient.post<NamesResponse>(`/state/${id}`, {
      movements,
      action: 'move',
    })
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    throw err
  }
}

export const createState = async (
  email1: string,
  email2: string,
  gender: string,
): Promise<CreateStateResponse | ErrorResponse> => {
  try {
    const response = await apiClient.put<CreateStateResponse>(`/state/`, {
      email1,
      email2,
      gender,
    })
    return response.data
  } catch (err) {
    if (err && err.response) {
      return err.response.data
    }
    throw err
  }
}
