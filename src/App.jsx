import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import Personnel from "./pages/Personnel";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
