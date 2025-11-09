import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SummaryPage from "./pages/SummaryPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" }, // deep hospital blue, fits screenshot
    secondary: { main: "#0ea5e9" },
    background: { default: "#f7fafc" } // off-white/light gray
  },
  shape: { borderRadius: 16 }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/summary/:patient_id" element={<SummaryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
