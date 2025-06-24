import { useEffect, useState } from 'react';
import '../../styles/Dashboard.css';
import { VeiculosDisponiveisPainel } from '../../components/VeiculosDisponeisPainel';
import { VeiculosAgendadosPainel } from '../../components/VeiculosAgendadosPainel';
import Header from '../../components/Header';
import { useVeiculoContext } from '../../contexts/VeiculosContext';

const Dashboard = () => {
  const { totalVeiculosAgendados } = useVeiculoContext();
  const [mudaTela, setMudaTela] = useState(false);

  return (
    <div className="dashboard">
      <Header />
      <section className="conteudo">
        {!mudaTela && (
          <section>
            <div className="title">
              <h2>Veículos Disponíveis</h2>
              {totalVeiculosAgendados != 0 && (
                <button onClick={() => setMudaTela(true)}>
                  Ver Veiculos agendados
                </button>
              )}
            </div>
            <VeiculosDisponiveisPainel />
          </section>
        )}

        {mudaTela && (
          <section>
            <div className="title">
              <h2>Veículos Agendados</h2>
              <button onClick={() => setMudaTela(false)}>
                Ver Veiculos Disponíveis
              </button>
            </div>
            <VeiculosAgendadosPainel />
          </section>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
