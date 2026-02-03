import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConvertPage from "./pages/ConvertPage";
import ResumePage from "./pages/ResumePage";
import MatchPage from "./pages/MatchPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Trust from "./pages/Trust";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/resume-analyzer" element={<ResumePage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/trust" element={<Trust />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
