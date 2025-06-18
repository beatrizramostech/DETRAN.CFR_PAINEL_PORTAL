import '../../styles/Veiculos.css';

const VeiculoDisponivelCard = ({ veiculo }) => {
  return (
    <div className="disponivel-card">
      <div className="disponivel-header">{veiculo.marca}</div>
      <div className="disponivel-body">{veiculo.placa}</div>
      <div className="disponivel-footer">{veiculo.modelo}</div>
    </div>
  );
};

export default VeiculoDisponivelCard;
