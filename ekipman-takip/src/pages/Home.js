import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserList from "./UserList";
import AddUser from "./AddUser";
import EquipmentList from "../components/EquipmentList";
import EquipmentPage from "./EquipmentPage";
import AddEquipment from "../components/AddEquipment";
import UsageHistory from "./UsageHistory";
import PrivateRoute from "../components/PrivateRoute";

const Home = () => {
  return (
    <div>
      <h1>Ana Sayfa</h1>
      <nav>
        <Link to="/home/users">Kullanıcılar</Link> |  
        <Link to="/home/equipment">Ekipman Yönetimi</Link> |  
        <Link to="/home/usage_history">Kullanım Geçmişi</Link>
      </nav>

      <Routes>
        {/* Yetkilendirilmiş sayfalar burada tanımlanıyor */}
        <Route
          path="/users"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu"]}>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/add"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu"]}>
              <AddUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu", "Yönetici"]}>
              <EquipmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment/list"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu", "Yönetici"]}>
              <EquipmentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment/add"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu", "Yönetici"]}>
              <AddEquipment />
            </PrivateRoute>
          }
        />
        <Route
          path="/usage_history"
          element={
            <PrivateRoute allowedRoles={["Depo Sorumlusu", "Yönetici"]}>
              <UsageHistory />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default Home;
