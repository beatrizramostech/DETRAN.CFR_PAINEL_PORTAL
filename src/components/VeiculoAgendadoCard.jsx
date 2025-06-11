import '../styles/Veiculos.css'

const VeiculoAgendadoCard = ({ veiculo }) => {
  const viagem = veiculo.viagens[0];

  const now = new Date();
  const dataPartida = new Date(viagem.dataPartida + 'T' + viagem.horaPartida);
  const dataChegada = new Date(viagem.dataChegada + 'T' + viagem.horaChegada);

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
      <p className='placa'>{veiculo.placa}</p>
      {viagem.localDestino && (
        <>
          <p>
            {viagem.horaPartida} - {viagem.horaChegada}
          </p>
          <p>{viagem.localDestino}</p>
          <p>{viagem.municipioDestino}</p>
        </>
      )}
    </div>
  );
};

export default VeiculoAgendadoCard;
