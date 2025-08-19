import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
// import Main from "./pages/Main";
// import Portfolio from "./pages/Portfolio";
// import Calendar from "./pages/Calendar";
import { useAuth } from "api/features/user/useAuth";
import { setupAuthListener } from "api/features/user/userSessionListener";
import AccountPage from "Pages/AccountPage";
import HomePage from "Pages/HomePage";
import LoginPage from "Pages/LoginPage";
import ProfilePage from "Pages/ProfilePage";
import ProtectedLayout from "UI/components/ProtectedLayout";
// import Account from "pages/Account";
// import Etf from "pages/Profitability/Etf";
// import Shares from "pages/Profitability/Shares";
// import Bonds from "pages/Profitability/Bonds";
// import CalcBonds from "pages/CalcBonds";
// import BondView from "pages/Profitability/Bonds/BondView";
// import Profile from "pages/Profile";

function App() {
  const ProtectedRoute = () => {
    const { isAuth } = useAuth();

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const AuthRoute = () => {
    const { isAuth } = useAuth();

    return isAuth ? <Navigate to="/" replace /> : <Outlet />;
  };

  useEffect(() => {
    setupAuthListener();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичный маршрут авторизации */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Защищённые маршруты + layout с меню */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Страницы брокерского счёта */}
            <Route path="/:id" element={<AccountPage />} />
            {/* <Route path="/:id/transactions" element={<AccountTransactions />} />
        <Route path="/:id/analytics" element={<AccountAnalytics />} />
        <Route path="/:id/settings" element={<AccountSettings />} /> */}

            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Фолбэк на авторизацию */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
