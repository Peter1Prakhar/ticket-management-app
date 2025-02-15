import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/Dashboard";
import CustomerPage from "./pages/CustomerPage";
import AgentDashboard from "./pages/AgentDashboard";

function App() {
  const uid = localStorage.getItem("user");
  return (
    <Router>
      <Routes>
        {uid ? (
          <>
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/agent" element={<AgentDashboard />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
