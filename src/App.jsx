import { VeiculoProvider } from './contexts/VeiculosContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <VeiculoProvider>
      <Dashboard />
    </VeiculoProvider>
  );
}

export default App;
