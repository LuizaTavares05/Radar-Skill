import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Toaster, { toast } from "./components/Toast";
import { useTheme } from "./theme/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { obterLembrarPersistido } from "./auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { email } = useAuth();
  if (!email) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { email } = useAuth();
  if (email) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { definirTema } = useTheme();
  const { sair } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sair();
    if (!obterLembrarPersistido()) definirTema("light");
    toast.info("Sessão encerrada", "Até logo!");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
