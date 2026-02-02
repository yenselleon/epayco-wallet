import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/" element={<h1>Home - ePayco Wallet (Coming Soon)</h1>} />
        <Route path="/register" element={<h1>Registro</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
