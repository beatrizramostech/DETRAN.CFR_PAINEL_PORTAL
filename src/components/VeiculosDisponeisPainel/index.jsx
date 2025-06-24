import { useEffect, useState, useRef } from 'react';
import VeiculoDisponivelCard from '../VeiculoDisponivelCard';
import '../../styles/VeiculosDisponiveisPainel.css';
import { getVeiculosDisponiveis } from '../../services/api';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import { formatarData } from '../../utils/utils';

export const VeiculosDisponiveisPainel = () => {
  const { setUltimaAtualizacao, timer } = useVeiculoContext();
  const [todosVeiculos, setTodosVeiculos] = useState([]);
  const [veiculosVisiveis, setVeiculosVisiveis] = useState([]);
  const [tamanhoTela, setTamanhoTela] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [filtro, setFiltro] = useState({
    placa: '',
    modelo: '',
    marca: '',
    unidade: '',
    tipoVeiculo: '',
  });

  const indiceAtualRef = useRef(0);

  const aplicarFiltro = () => {
    let resultado = [...todosVeiculos];
    resultado = resultado.filter(
      (v) =>
        (v.placa ?? '')
          .toLowerCase()
          .includes((filtro.placa ?? '').toLowerCase()) &&
        (v.modelo ?? '')
          .toLowerCase()
          .includes((filtro.modelo ?? '').toLowerCase()) &&
        (v.marca ?? '')
          .toLowerCase()
          .includes((filtro.marca ?? '').toLowerCase()) &&
        (v.unidade ?? '')
          .toLowerCase()
          .includes((filtro.unidade ?? '').toLowerCase()) &&
        (v.tipoVeiculo ?? '')
          .toLowerCase()
          .includes((filtro.tipoVeiculo ?? '').toLowerCase())
    );
    return resultado;
  };

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
        const res = await getVeiculosDisponiveis();
        const veiculos = res.data;
        setTodosVeiculos(veiculos);
        setVeiculosVisiveis(veiculos.slice(0, 25));
        setUltimaAtualizacao(formatarData(new Date()));
        indiceAtualRef.current = 25;
      } catch (error) {
        console.error('Erro ao carregar veículos disponíveis', error);
      }
    };

    carregarVeiculos();

    const intervalo = setInterval(() => {
      carregarVeiculos();
    }, timer * 5);

    return () => clearInterval(intervalo);
  }, [timer]);

  useEffect(() => {
    const todosFiltrados = aplicarFiltro();
    const alturaUtil = tamanhoTela.height - 180;
    const larguraUtil = tamanhoTela.width - 80;

    const linhas = Math.max(Math.trunc(alturaUtil / 100), 1);
    const colunas = Math.max(Math.trunc(larguraUtil / 270), 1);
    const numeroCards = linhas * colunas;

    setVeiculosVisiveis(todosFiltrados.slice(0, numeroCards));
    indiceAtualRef.current = numeroCards;

    const intervalo = setInterval(() => {
      const novos = todosFiltrados.slice(
        indiceAtualRef.current,
        indiceAtualRef.current + numeroCards
      );
      setVeiculosVisiveis(novos);

      if (indiceAtualRef.current + numeroCards >= todosFiltrados.length) {
        indiceAtualRef.current = 0;
      } else {
        indiceAtualRef.current += numeroCards;
      }
    }, timer);

    return () => clearInterval(intervalo);
  }, [filtro, todosVeiculos, tamanhoTela, timer]);

  return (
    <div className="container-disponiveis">
      <form className="painel-filtro">
        {['placa', 'modelo', 'marca', 'unidade'].map((campo) => (
          <input
            key={campo}
            className="input-filtro"
            placeholder={`${campo}`}
            value={filtro[campo]}
            onChange={(e) => setFiltro({ ...filtro, [campo]: e.target.value })}
          />
        ))}
        <select
          name="tipoVeiculo"
          id="tipoVeiculo"
          className="input-filtro"
          onChange={(e) =>
            setFiltro({ ...filtro, tipoVeiculo: e.target.value })
          }
        >
          <option value="">TIPO DE VEICULO</option>
          <option value="CAMINHÃO">CAMINHÃO</option>
          <option value="CAMINHONETE">CAMINHONETE</option>
          <option value="CARRO">CARRO</option>
          <option value="FURGÃO">FURGÃO</option>
          <option value="MICROÔNIBUS">MICROÔNIBUS</option>
          <option value="ÔNIBUS">ÔNIBUS</option>
          <option value="PICKUP">PICKUP</option>
          <option value="VAN">VAN</option>
        </select>
      </form>
      <div className="painel-grid">
        {veiculosVisiveis.map((veiculo) => (
          <VeiculoDisponivelCard key={veiculo.id} veiculo={veiculo} />
        ))}
      </div>
    </div>
  );
};
