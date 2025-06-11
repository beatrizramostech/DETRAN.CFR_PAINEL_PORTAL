import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7092',
});

export const getVeiculosDisponiveis = () =>
  api.get('/paineis/veiculos/disponiveis');
export const getVeiculosAgendados = () =>
  api.get('/paineis/veiculos/agendados');
