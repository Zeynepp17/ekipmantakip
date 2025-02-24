import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import UserEdit from "./pages/UserEdit"; // ✅ Kullanıcı düzenleme sayfası eklendi
import EquipmentList from "./pages/EquipmentList";
import UsageHistory from "./pages/UsageHistory";
import AddUser from "./pages/AddUser";
import AddEquipment from "./pages/AddEquipment";
import EquipmentEdit from "./pages/EquipmentEdit"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard İçindeki Sayfalar */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<UserList />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/edit/:id" element={<UserEdit />} />  {/* ✅ Route Eklendi */}
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="history" element={<UsageHistory />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="equipment/add" element={<AddEquipment />} />
          <Route path="/dashboard/equipment/edit/:id" element={<EquipmentEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
