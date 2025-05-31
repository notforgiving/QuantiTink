import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Portfolio from "./pages/Portfolio";
import Calendar from "./pages/Calendar";
import Shares from "./pages/Shares";
import Auth from "pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Main />} />
        <Route path="account/:id" element={<Portfolio />} />
        <Route path="account/:id/calendar" element={<Calendar />} />
        <Route path="account/:id/shares" element={<Shares />} />
        {/* <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<RecentActivity />} />
          <Route path="project/:id" element={<Project />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
