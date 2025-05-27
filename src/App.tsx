import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Portfolio from "./pages/Portfolio";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "./store/root-reducer";
import { accountsSlice } from "./store/slices/accoutns.slice";
import { operationsSlice } from "./store/slices/operations.slice";
import { portfoliosSlice } from "./store/slices/portfolio.slice";
import Calendar from "./pages/Calendar";
import Shares from "./pages/Shares";
import { infoSlice } from "./store/slices/info.slice";
import Auth from "pages/Auth";

function App() {
  const accounts = useSelector((state: StateType) => state.accounts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(infoSlice.actions.getInfoAction());
    if (accounts.data && accounts.data.length === 0) {
      dispatch(accountsSlice.actions.getaccountsListAction());
    }
    if (accounts.data && !!accounts.data) {
      dispatch(portfoliosSlice.actions.getPortfoliosListAction(accounts.data));
      dispatch(operationsSlice.actions.getOperationsListAction(accounts.data));
    }
  }, [accounts.data, dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Auth />} />
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
