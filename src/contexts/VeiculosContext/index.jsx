import { createContext, useContext, useEffect, useState } from 'react';
import {
  getVeiculosDisponiveis,
  getVeiculosAgendados,
} from '../../services/api';
import { formatarData } from '../../utils/utils';

const VeiculoContext = createContext();

export const VeiculoProvider = ({ children }) => {
  const [totalVeiculosDisponiveis, setTotalVeiculosDisponiveis] = useState(0);
  const [totalVeiculosAgendados, setTotalVeiculosAgendados] = useState(0);
  const [totalVeiculosEmViagem, setTotalVeiculosEmViagem] = useState(0);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        const resDisponiveis = await getVeiculosDisponiveis();
        const veiculosDisponiveis = resDisponiveis.data ?? [];

        const resAgendados = await fetch(
          '/homo/cfr-painel/assets/mock_veiculos_agendados.json'
        );
        const veiculosAgendados = (await resAgendados.json()) ?? [];

        const emViagemCount = veiculosAgendados.filter(
          (v) => v.emViagem
        ).length;

        setTotalVeiculosDisponiveis(veiculosDisponiveis.length);
        setTotalVeiculosAgendados(veiculosAgendados.length);
        setTotalVeiculosEmViagem(emViagemCount);
        setUltimaAtualizacao(formatarData(new Date()));
      } catch (error) {
        console.error('Erro ao carregar dados dos veículos:', error);
      }
    };

    carregarVeiculos();
  }, []);

  return (
    <VeiculoContext.Provider
      value={{
        totalVeiculosDisponiveis,
        totalVeiculosAgendados,
        totalVeiculosEmViagem,
        setUltimaAtualizacao,
        ultimaAtualizacao,
      }}
    >
      {children}
    </VeiculoContext.Provider>
  );
};

export const useVeiculoContext = () => useContext(VeiculoContext);
