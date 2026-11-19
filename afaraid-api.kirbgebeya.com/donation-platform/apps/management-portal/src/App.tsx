import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Users from "./pages/Users/Users";
import RoleManagement from "./pages/Roles/Roles";
import Donations from "./pages/Donations/Donations";
import Campaigns from "./pages/Campaigns/Campaigns";
import Donors from "./pages/Doners/Doners";
import Payments from "./pages/Payments/Payments";
import Goats from "./pages/Goats/Goats";
import DonationReports from "./pages/Reports/DonationReports";
import CampaignReports from "./pages/Reports/CampaignReports";
import DonorInsights from "./pages/Reports/DonorInsights";
import FinancialSummary from "./pages/Reports/FinancialSummary";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/goats" element={<Goats />} />
          <Route path="/reports/donations" element={<DonationReports />} />
          <Route path="/reports/campaigns" element={<CampaignReports />} />
          <Route path="/reports/donors" element={<DonorInsights />} />
          <Route path="/reports/finance" element={<FinancialSummary />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
