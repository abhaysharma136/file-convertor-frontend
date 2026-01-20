import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConvertPage from "./pages/ConvertPage";
import ResumePage from "./pages/ResumePage";
import MatchPage from "./pages/MatchPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="/resume-analyzer" element={<ResumePage />} />
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
