import { useEffect, useState, useRef } from 'react';
import VeiculoDisponivelCard from '../VeiculoDisponivelCard';
import '../../styles/VeiculosDisponiveisPainel.css';
import { getVeiculosDisponiveis } from '../../services/api';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import { formatarData } from '../../utils/utils';

export const VeiculosDisponiveisPainel = () => {
  const { setUltimaAtualizacao } = useVeiculoContext();
  const [todosVeiculos, setTodosVeiculos] = useState([]);
  const [veiculosVisiveis, setVeiculosVisiveis] = useState([]);
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
  }, []);

  useEffect(() => {
    const todosFiltrados = aplicarFiltro();

    setVeiculosVisiveis(todosFiltrados.slice(0, 25));
    indiceAtualRef.current = 25;

    const intervalo = setInterval(() => {
      const novos = todosFiltrados.slice(
        indiceAtualRef.current,
        indiceAtualRef.current + 25
      );
      setVeiculosVisiveis(novos);

      if (indiceAtualRef.current + 25 >= todosFiltrados.length) {
        indiceAtualRef.current = 0;
      } else {
        indiceAtualRef.current += 25;
      }
    }, 5000);

    return () => clearInterval(intervalo);
  }, [filtro, todosVeiculos]);

  return (
    <div className="container-disponiveis">
      <form className="painel-filtro">
        {['placa', 'modelo', 'marca', 'unidade', 'tipoVeiculo'].map((campo) => (
          <input
            key={campo}
            className="input-filtro"
            placeholder={`${campo}`}
            value={filtro[campo]}
            onChange={(e) => setFiltro({ ...filtro, [campo]: e.target.value })}
          />
        ))}
      </form>
      <div className="painel-grid">
        {veiculosVisiveis.map((veiculo) => (
          <VeiculoDisponivelCard key={veiculo.id} veiculo={veiculo} />
        ))}
      </div>
    </div>
  );
};
