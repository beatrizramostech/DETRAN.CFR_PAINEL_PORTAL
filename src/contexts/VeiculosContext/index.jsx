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
  const [timer, setTimer] = useState(10000);

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        const resDisponiveis = await getVeiculosDisponiveis();
        const veiculosDisponiveis = resDisponiveis.data ?? [];
        // const resAgendados = await getVeiculosAgendados();
        const resAgendados = await fetch(
          `/homo/cfr-painel/assets/mock_veiculos_agendados.json`
        );
        // const veiculosAgendados = resAgendados.data ?? [];
        if (!resAgendados.ok)
          throw new Error('Erro ao carregar mock_veiculos_agendados.json');

        const veiculosAgendados = await resAgendados.json();

        const emViagemCount = veiculosAgendados.filter(
          (v) => v.emViagem
        ).length;

        const veiculosComViagensValidas = veiculosAgendados
          .map((veiculo) => {
            const viagensValidas = veiculo.viagens.filter((viagem) => {
              const status = viagem.status.toLowerCase();
              return status !== 'cancelada' && status !== 'concluída';
            });

            return {
              ...veiculo,
              viagens: viagensValidas,
            };
          })
          .filter((veiculo) => veiculo.viagens.length > 0);

        setTotalVeiculosDisponiveis(veiculosDisponiveis.length);
        setTotalVeiculosAgendados(veiculosComViagensValidas.length);
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
        timer,
        setTimer,
      }}
    >
      {children}
    </VeiculoContext.Provider>
  );
};

export const useVeiculoContext = () => useContext(VeiculoContext);
