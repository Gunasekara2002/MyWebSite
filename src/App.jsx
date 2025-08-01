import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DisasterLoanForm from './pages/disaster_loan';
import TimberPermitForm from './pages/TimberPermitForm';
import OfficialCertificateForm from './pages/OfficialCertificateForm';
import VehicleRevenueForm from './pages/VehicleRevenueForm';
import admin_services from './pages/admin_services';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pages/disaster-loan" element={<DisasterLoanForm />} />
        <Route path="/pages/timber-permit" element={<TimberPermitForm />} />
        <Route path="/pages/official-certificate" element={<OfficialCertificateForm />} />
        <Route path="/pages/vehicle-revenue-permit" element={<VehicleRevenueForm />} />
        <Route path="/pages/admin_services" element={<ServicesList />} />
      </Routes>
    </Router>
  );
}

export default App;
