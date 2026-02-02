import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Button } from './components/ui/Button'; // Import temporal para demo
import { Card } from './components/ui/Card'; // Import temporal para demo
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <Card title="Bienvenido a ePayco Wallet" padding="lg">
            <p className="mb-4">Esta es la página de inicio. El sistema de diseño base está listo.</p>
            <div className="flex gap-4">
              <Button>Botón Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-2">Accesos directos de desarrollo:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/register'}>Ir a Registro</Button>
              </div>
            </div>
          </Card>
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<h1>Dashboard (Próximamente)</h1>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
