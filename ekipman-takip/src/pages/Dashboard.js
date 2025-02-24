import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome } from "react-icons/fa"; // Menü ve Ana Sayfa İkonları

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true); // Menü Açık/Kapalı Durumu
  const navigate = useNavigate(); // Yönlendirme için kullanılır

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Menü */}
      <nav
        style={{
          width: isOpen ? "250px" : "60px", // Menü Açık/Kapalı Genişliği
          padding: "20px",
          background: "#333",
          color: "#fff",
          height: "100vh",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Menü Aç/Kapa Butonu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            top: "10px",
            right: isOpen ? "10px" : "-30px",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menü Başlığı */}
        {isOpen && <h2 style={{ marginBottom: "20px" }}>Menü</h2>}

        {/* Menü Öğeleri */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/dashboard/users" style={menuLinkStyle}>
              Kullanıcı Listesi
            </Link>
          </li>
          <li>
            <Link to="/dashboard/equipment" style={menuLinkStyle}>
              Ekipman Listesi
            </Link>
          </li>
          <li>
            <Link to="/dashboard/history" style={menuLinkStyle}>
              Kullanım Geçmişi
            </Link>
          </li>
          <li>
            <Link to="/dashboard/users/add" style={menuLinkStyle}>
              Yeni Kullanıcı Ekle
            </Link>
          </li>
          <li>
            <Link to="/dashboard/equipment/add" style={menuLinkStyle}>
              Yeni Ekipman Ekle
            </Link>
          </li>
        </ul>

        {/* Ana Sayfaya Dönme Butonu */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#ff5722",
            color: "#fff",
            border: "none",
            width: "100%",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaHome style={{ marginRight: "8px" }} /> Ana Sayfa
        </button>
      </nav>

      {/* İçerik Alanı */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* Burada sayfa içeriği değişecek */}
      </div>
    </div>
  );
};

// Menü Link Stili
const menuLinkStyle = {
  display: "block",
  padding: "10px",
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  transition: "background 0.2s",
};

export default Dashboard;
