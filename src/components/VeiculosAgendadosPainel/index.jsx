import { useEffect, useState, useRef } from 'react';
import '../../styles/VeiculosDisponiveisPainel.css';
import VeiculoAgendadoCard from '../VeiculoAgendadoCard';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import { formatarData } from '../../utils/utils';

export const VeiculosAgendadosPainel = () => {
  const { setUltimaAtualizacao } = useVeiculoContext();
  const [todosVeiculos, setTodosVeiculos] = useState([]);
  const [veiculosVisiveis, setVeiculosVisiveis] = useState([]);

  const indiceAtualRef = useRef(0);

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        const res = await fetch(
          '/homo/cfr-painel/assets/mock_veiculos_agendados.json'
        );
        const veiculos = await res.json();
        setTodosVeiculos(veiculos);
        setVeiculosVisiveis(veiculos.slice(0, 12));
        indiceAtualRef.current = 12;
        setUltimaAtualizacao(formatarData(new Date()));
      } catch (error) {
        console.error('Erro ao carregar veículos disponíveis', error);
      }
    };

    carregarVeiculos();
  }, []);

  useEffect(() => {
    setVeiculosVisiveis(todosVeiculos.slice(0, 12));
    indiceAtualRef.current = 12;

    const intervalo = setInterval(() => {
      const novos = todosVeiculos.slice(
        indiceAtualRef.current,
        indiceAtualRef.current + 12
      );
      setVeiculosVisiveis(novos);

      if (indiceAtualRef.current + 12 >= todosVeiculos.length) {
        indiceAtualRef.current = 0;
      } else {
        indiceAtualRef.current += 12;
      }
    }, 10000);

    return () => clearInterval(intervalo);
  }, [todosVeiculos]);
  return (
    <div className="container-disponiveis">
      <div className="painel-grid-agendados">
        {veiculosVisiveis.map((veiculo) => (
          <VeiculoAgendadoCard key={veiculo.id} veiculo={veiculo} />
        ))}
      </div>
    </div>
  );
};
