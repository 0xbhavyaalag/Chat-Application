import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import Loader from './components/Loader';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen label="Loading chat workspace..." />;
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <AuthPage />} />
      <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to={user ? '/chat' : '/auth'} replace />} />
    </Routes>
  );
}

export default App;
