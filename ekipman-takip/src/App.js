import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import EquipmentList from "./pages/EquipmentList";
import UsageHistory from "./pages/UsageHistory";
import AddUser from "./pages/AddUser";
import AddEquipment from "./pages/AddEquipment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/history" element={<UsageHistory />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/equipment/add" element={<AddEquipment />} />
      </Routes>
    </Router>
  );
}

export default App;
