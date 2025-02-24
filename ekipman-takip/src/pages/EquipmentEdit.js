import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EquipmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState({
    name: "",
    category: "",
    status: "",
    department_id: "",
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  // 📌 **Ekipman bilgilerini çek**
  const fetchEquipment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/equipment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ekipman bilgisi alınamadı.");
      }

      const data = await response.json();
      console.log("Güncellenecek ekipman:", data);
      setEquipment(data); // 📌 React state'e çekilen veriyi ata
    } catch (error) {
      console.error("Ekipman getirilemedi:", error);
    }
  };

  // 📌 **Input değişikliklerini takip et**
  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updatedEquipment = {
        name: equipment.name || "",  // 🔥 Boşsa string olarak gönder
        category_id: equipment.category_id ? parseInt(equipment.category_id, 10) : 1,  
        status: equipment.status || "available",
        department_id: equipment.department_id ? parseInt(equipment.department_id, 10) : null
      };
  
      console.log("📌 Gönderilen Güncelleme Verisi:", updatedEquipment); 
      console.log("📌 Gönderilecek category_id:", equipment.category_id);
  
      const response = await fetch(`http://127.0.0.1:5000/api/equipment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(updatedEquipment),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Sunucu hatası:", errorData);
        throw new Error(errorData.error || "Güncelleme başarısız!");
      }
  
      alert("✅ Ekipman başarıyla güncellendi!");
      navigate("/dashboard/equipment"); // Listeye geri dön
    } catch (error) {
      console.error("❌ Ekipman güncellenemedi:", error);
      alert("Güncelleme işlemi başarısız!");
    }
  };
  


  return (
    <div>
      <h2>Ekipman Düzenleme</h2>
      <label>Ekipman Adı:</label>
      <input type="text" name="name" value={equipment.name} onChange={handleChange} />

      <label>Kategori:</label>
      <input type="text" name="category" value={equipment.category} onChange={handleChange} />

      <label>Durum:</label>
      <select name="status" value={equipment.status} onChange={handleChange}>
        <option value="available">Mevcut</option>
        <option value="in_use">Kullanımda</option>
        <option value="maintenance">Bakımda</option>
      </select>

      <label>Departman:</label>
      <input type="number" name="department_id" value={equipment.department_id} onChange={handleChange} />

      <button onClick={handleUpdate}>Güncelle</button>
    </div>
  );
};

export default EquipmentEdit;
