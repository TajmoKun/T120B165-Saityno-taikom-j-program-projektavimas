import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import { AdminContent } from './pages/AdminContent';
import { Messaging } from './pages/Messaging';
import { useGlobal } from './context/GlobalContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminContent /></ProtectedAdminRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useGlobal();
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useGlobal();
  
  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default App;