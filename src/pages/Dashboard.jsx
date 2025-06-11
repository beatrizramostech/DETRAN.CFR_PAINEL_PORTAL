import { useEffect, useState } from 'react';
import { getVeiculosDisponiveis, getVeiculosAgendados } from '../services/api';
import VeiculoDisponivelCard from '../components/VeiculoDisponivelCard';
import VeiculoAgendadoCard from '../components/VeiculoAgendadoCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [disponiveis, setDisponiveis] = useState([]);
  const [agendados, setAgendados] = useState([]);

  const fetchData = async () => {
    try {
      const [dispRes, agendRes] = await Promise.all([
        getVeiculosDisponiveis(),
        getVeiculosAgendados(),
      ]);

      setDisponiveis(dispRes.data);
      setAgendados(agendRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Atualiza a cada 60s
    return () => clearInterval(interval); // Limpa ao desmontar
  }, []);
  console.log('Disponiveis', disponiveis, 'Agendados', agendados);
  return (
    <div className='dashboard'>
      <section>
        <h2>Veículos Disponíveis</h2>
        <div className='grid'>
          {disponiveis.map((v) => (
            <VeiculoDisponivelCard key={v.id} veiculo={v} />
          ))}
        </div>
      </section>

      <section>
        <h2>Veículos Agendados</h2>
        <div className='grid'>
          {agendados.map((v) => (
            <VeiculoAgendadoCard key={v.id} veiculo={v} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
