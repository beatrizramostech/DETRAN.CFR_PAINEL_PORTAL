import { useState } from 'react';
import '../../styles/Veiculos.css';

const getViagemMaisProxima = (viagens, agora = new Date()) => {
  const viagensValidas = viagens.filter((v) => {
    const status = v.status.toLowerCase();
    return status !== 'cancelada' && status !== 'concluída';
  });

  const viagemIniciada = viagensValidas.find(
    (v) => v.status.toLowerCase() === 'iniciada'
  );
  if (viagemIniciada) return viagemIniciada;
  if (viagensValidas.length === 0) return null;

  return viagensValidas.reduce((maisProxima, atual) =>
    atual.dataHoraPartida < maisProxima.dataHoraPartida ? atual : maisProxima
  );
};

const VeiculoAgendadoCard = ({ veiculo }) => {
  const now = new Date();
  const [viagem, setViagem] = useState(getViagemMaisProxima(veiculo.viagens));
  if (!viagem) return;

  const dataPartidaString = `${viagem.dataPartida.split('T')[0]}T${
    viagem.horaPartida
  }`;
  const dataChegadaString = `${viagem.dataChegada.split('T')[0]}T${
    viagem.horaChegada
  }`;
  const dataPartida = new Date(dataPartidaString);
  const dataChegada = new Date(dataChegadaString);

  let cardClass = 'card-agendado card-verde';
  let statusTexto = 'Aguardando';
  if (veiculo.emViagem && now < dataChegada) {
    cardClass = 'card-agendado card-amarelo';
    statusTexto = 'Em Viagem';
  } else if (veiculo.emViagem && now > dataChegada) {
    cardClass = 'card-agendado card-vermelho';
    statusTexto = 'Fim - Atraso';
  } else if (!veiculo.emViagem && now > dataPartida) {
    cardClass = 'card-agendado card-vermelho';
    statusTexto = 'Início - Atraso';
  }

  return (
    <div className={cardClass}>
      <h4>{statusTexto}</h4>
      <p className="placa">{veiculo.placa}</p>
      {viagem.localDestino && (
        <>
          <p>
            {viagem.horaPartida} - {viagem.horaChegada}
          </p>
          <p className="motorista">{viagem.motorista}</p>
          <p>{viagem.localDestino}</p>
          <p>{viagem.municipioDestino}</p>
        </>
      )}
    </div>
  );
};

export default VeiculoAgendadoCard;
