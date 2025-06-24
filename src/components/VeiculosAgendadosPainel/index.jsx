import { useEffect, useState, useRef } from 'react';
import '../../styles/VeiculosDisponiveisPainel.css';
import VeiculoAgendadoCard from '../VeiculoAgendadoCard';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import { formatarData } from '../../utils/utils';
import { getVeiculosAgendados } from '../../services/api';

export const VeiculosAgendadosPainel = () => {
  const { setUltimaAtualizacao, timer } = useVeiculoContext();
  const [todosVeiculos, setTodosVeiculos] = useState([]);
  const [veiculosVisiveis, setVeiculosVisiveis] = useState([]);
  const [tamanhoTela, setTamanhoTela] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const indiceAtualRef = useRef(0);

  useEffect(() => {
    const atualizarTamanho = () => {
      setTamanhoTela({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', atualizarTamanho);

    return () => {
      window.removeEventListener('resize', atualizarTamanho);
    };
  }, []);

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        // const res = await getVeiculosAgendados();
        // const veiculos = res.data;
        const res = await fetch(
          `/homo/cfr-painel/assets/mock_veiculos_agendados.json`
        );
        // const veiculosAgendados = resAgendados.data ?? [];
        if (!res.ok)
          throw new Error('Erro ao carregar mock_veiculos_agendados.json');

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

    const intervalo = setInterval(() => {
      carregarVeiculos();
    }, timer * 5);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (todosVeiculos.length === 0) return;

    const alturaUtil = tamanhoTela.height - 130;
    const larguraUtil = tamanhoTela.width - 80;

    const linhas = Math.max(Math.trunc(alturaUtil / 260), 1);
    const colunas = Math.max(Math.trunc(larguraUtil / 220), 1);
    const numeroCards = linhas * colunas;
    setVeiculosVisiveis(todosVeiculos.slice(0, numeroCards));
    indiceAtualRef.current = numeroCards;

    const intervalo = setInterval(() => {
      const novos = todosVeiculos.slice(
        indiceAtualRef.current,
        indiceAtualRef.current + numeroCards
      );

      setVeiculosVisiveis(
        novos.length > 0 ? novos : todosVeiculos.slice(0, numeroCards)
      );

      if (indiceAtualRef.current + numeroCards >= todosVeiculos.length) {
        indiceAtualRef.current = 0;
      } else {
        indiceAtualRef.current += numeroCards;
      }
    }, timer);

    return () => clearInterval(intervalo);
  }, [todosVeiculos, tamanhoTela]);
  console.log(todosVeiculos);
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
