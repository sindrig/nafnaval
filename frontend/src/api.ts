import axios from 'axios';
import { Name } from './store/names/types';

// TODO: Pull from terraform
const BASE_URL = 'https://egh9asmxq1.execute-api.us-west-1.amazonaws.com';

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
