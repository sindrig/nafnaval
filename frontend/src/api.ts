import axios from 'axios';
import { Name } from './store/names/types';

// TODO: Pull from terraform
const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface NamesResponse {
  names: Name[]
}

interface CreateStateResponse {
  Location: string
}

export const getNameState = async (id: string): Promise<NamesResponse> => {
  try {
    const response = await apiClient.get<NamesResponse>(`/state/${id}`);
    return response.data;
  } catch (err) {
    if (err && err.response) {
      return err.response.data;
    }
    throw err;
  }
}

export const createState = async (email1: string, email2: string, sex: string): Promise<CreateStateResponse> => {
  try {
    const response = await apiClient.post<CreateStateResponse>(`/state/`, {email1, email2, sex});
    return response.data;
  } catch (err) {
    if (err && err.response) {
      return err.response.data;
    }
    throw err;
  }
}

