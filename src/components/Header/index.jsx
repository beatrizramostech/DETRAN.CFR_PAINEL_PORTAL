import { useContext } from 'react';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import '../../styles/Header.css';

const Header = () => {
  const {
    totalVeiculosDisponiveis,
    totalVeiculosEmViagem,
    totalVeiculosAgendados,
    ultimaAtualizacao,
  } = useVeiculoContext();

  return (
    <header className="header-painel">
      <div className="vazio"></div>
      <div className="painel-info">
        <span>
          <strong>Agendados:</strong> {totalVeiculosAgendados}
        </span>
        <span>
          <strong>Em Viagem:</strong> {totalVeiculosEmViagem}
        </span>
        <span>
          <strong>Disponíveis:</strong> {totalVeiculosDisponiveis}
        </span>
      </div>

      <div className="painel-atualizacao">
        Última atualização: {ultimaAtualizacao}
      </div>
    </header>
  );
};

export default Header;
