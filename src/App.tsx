import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Portfolio from "./pages/Portfolio";
import Calendar from "./pages/Calendar";
import Auth from "pages/Auth";
import UserPage from "pages";
import Account from "pages/Account";
import Etf from "pages/Profitability/Etf";
import Shares from "pages/Profitability/Shares";
import Bonds from "pages/Profitability/Bonds";
import CalcBonds from "pages/CalcBonds";
import BondView from "pages/Profitability/Bonds/BondView";
import Profile from "pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<UserPage />}>
          <Route index element={<Main />} />
          <Route path="account/:id" element={<Account />}>
            <Route index element={<Portfolio />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="shares" element={<Shares />} />
            <Route path="etf/:ticker" element={<Etf />} />
            <Route path="bonds/:currency" element={<Bonds />} />
            <Route path="bonds/:currency/:figi" element={<BondView />} />
          </Route>
          <Route path="calcBonds" element={<CalcBonds />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
