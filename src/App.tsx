import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Portfolio from "./pages/Portfolio";
import Calendar from "./pages/Calendar";
import Shares from "./pages/Shares";
import Auth from "pages/Auth";
import UserPage from "pages";
import Account from "pages/Account";
import Etf from "pages/Etf";

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
            <Route path="etf:ticker" element={<Etf />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
