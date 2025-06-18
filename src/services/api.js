import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

export const getVeiculosDisponiveis = () =>
  api.get('/paineis/veiculos/disponiveis');
export const getVeiculosAgendados = () =>
  api.get('/paineis/veiculos/agendados');
