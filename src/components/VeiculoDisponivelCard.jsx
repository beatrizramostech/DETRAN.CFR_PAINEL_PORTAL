import '../styles/Veiculos.css';

const VeiculoDisponivelCard = ({ veiculo }) => {
  return (
    <div className="disponivel-card">
      <div className="disponivel-header">
        {veiculo.marca} {veiculo.modelo}
      </div>
      <div className="disponivel-body">
        {veiculo.placa}
      </div>
    </div>
  );
};

export default VeiculoDisponivelCard;

