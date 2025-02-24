import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router yönlendirme için

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sayfa yönlendirme için

  useEffect(() => {
    fetchEquipment();
  }, []);

  // ✅ **Ekipman listesini getir**
  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/equipment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        credentials: "include" // CORS hatası varsa gerekebilir
      });

      if (!response.ok) {
        throw new Error(`Bağlantı hatası: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Ekipman Listesi:", data);
      setEquipment(data);
    } catch (error) {
      console.error("Ekipmanları çekerken hata oluştu:", error);
      setError("Bağlantı hatası!");
    }
  };

  // 🔄 **Düzenleme sonrası güncelleme**
  const refreshEquipment = () => {
    fetchEquipment(); // Güncellenmiş veriyi al
  };

  // 🛠️ **Ekipmanı düzenleme fonksiyonu (sayfaya yönlendirir)**
  const handleEdit = (equipmentId) => {
    console.log("Düzenleme ekranına gidiliyor:", equipmentId);
    navigate(`/dashboard/equipment/edit/${equipmentId}`); // Yönlendirme ekledik
  };

  // 🗑 **Ekipmanı silme fonksiyonu**
  const handleDelete = async (equipmentId) => {
    if (window.confirm("Bu ekipmanı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/equipment/${equipmentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}` // Yetkilendirme eklendi
          }
        });

        if (!response.ok) {
          throw new Error("Silme işlemi başarısız!");
        }

        setEquipment(equipment.filter(item => item.id !== equipmentId)); // **Silme sonrası tabloyu güncelle**
        alert("Ekipman başarıyla silindi!");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silme işlemi başarısız!");
      }
    }
  };

  return (
    <div>
      <h2>Ekipman Listesi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={refreshEquipment} style={{ marginBottom: "10px" }}>🔄 Güncelle</button> {/* Güncelleme butonu ekledik */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Kategori</th>
            <th>Durum</th>
            <th>Departman</th>
            <th>Oluşturulma Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category || "Bilinmiyor"}</td> {/* 🔥 item.category yerine item.category_id kullanıldı */}
              <td>{item.status}</td>
              <td>{item.department_id}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td> {/* 🔥 Tarih formatı düzeltildi */}
              <td>
                <button onClick={() => handleEdit(item.id)}>Düzenle</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;
