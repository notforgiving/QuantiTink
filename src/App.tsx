import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuth } from "api/features/user/useAuth";
import { setupAuthListener } from "api/features/user/userSessionListener";
import AccountPageWrapper from "Pages/AccountPage";
import AccountPageMakeup from "Pages/AccountPage/makeup";
import BondPage from "Pages/BondPage";
import BondsPageWrapper from "Pages/BondsPage";
import BondsPageMakeup from "Pages/BondsPage/makeup";
import CalcPageWrapper from "Pages/CalcPage";
import CalcPageMakup from "Pages/CalcPage/makeup";
import CalendarPage from "Pages/CalendarPage";
import EtfPage from "Pages/EtfPage";
import HomePage from "Pages/HomePage";
import LoginPage from "Pages/LoginPage";
import ProfilePage from "Pages/ProfilePage";
import SharesPage from "Pages/SharesPage";
import ShareItem from "Pages/SharesPage/components/SharesItem";
import ProtectedLayout from "UI/components/ProtectedLayout";

import { ScrollToTop } from "utils/ScrollToTop";

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
      <ScrollToTop>
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
              <Route path="/:id" element={<AccountPageWrapper />}>
                <Route index element={<AccountPageMakeup />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="shares" element={<SharesPage />} />
                <Route path="shares/:figi" element={<ShareItem />} />
                <Route path="bonds/:currency" element={<BondsPageWrapper />}>
                  <Route index element={<BondsPageMakeup />} />
                  <Route path=":figi" element={<BondPage />} />
                </Route>
                <Route path="etf/:ticker" element={<EtfPage />} />
              </Route>
              <Route path="/calcBonds" element={<CalcPageWrapper />}>
                <Route index element={<CalcPageMakup />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Фолбэк на авторизацию */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
