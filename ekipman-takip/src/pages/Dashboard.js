import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/users">Kullanıcı Listesi</Link></li>
          <li><Link to="/equipment">Ekipman Listesi</Link></li>
          <li><Link to="/history">Kullanım Geçmişi</Link></li>
          <li><Link to="/users/add">Yeni Kullanıcı Ekle</Link></li>
          <li><Link to="/equipment/add">Yeni Ekipman Ekle</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
