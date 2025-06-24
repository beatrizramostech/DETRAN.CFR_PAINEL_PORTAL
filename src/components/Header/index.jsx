import { useEffect, useState } from 'react';
import { useVeiculoContext } from '../../contexts/VeiculosContext';
import { IoIosSunny } from 'react-icons/io';
import { IoMdMoon } from 'react-icons/io';

import '../../styles/Header.css';

const Header = () => {
  const { setTimer } = useVeiculoContext();
  const [tema, setTema] = useState('light');

  const {
    totalVeiculosDisponiveis,
    totalVeiculosEmViagem,
    totalVeiculosAgendados,
    ultimaAtualizacao,
  } = useVeiculoContext();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <header className="header-painel">
      <div className="vazio">
        <button className="button-theme" onClick={alternarTema}>
          {tema === 'light' ? <IoMdMoon size={24} /> : <IoIosSunny size={24} />}
        </button>
        <select
          className="input-timer"
          onChange={(e) => setTimer(e.target.value)}
        >
          <option value="10000">10 seg</option>
          <option value="30000">30 seg</option>
          <option value="60000">1 min</option>
          <option value="300000">5 min</option>
        </select>
      </div>
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
