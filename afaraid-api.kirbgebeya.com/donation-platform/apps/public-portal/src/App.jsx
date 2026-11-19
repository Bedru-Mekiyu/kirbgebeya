import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import DonorDashboard from "./pages/DonorDashboard";
import "./index.css";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function App() {
  return (
    <LocalizationProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:slug" element={<CampaignDetail />} />
            <Route
              path="/donor-dashboard/:donorIdentityNumber"
              element={<DonorDashboard />}
            />
            <Route path="/payment/success" element={<PaymentSuccess />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </LocalizationProvider>
  );
}
