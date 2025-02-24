import React, { useState, useEffect } from "react";

const AddEquipment = () => {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Kategori ID
  const [status, setStatus] = useState("available");
  const [department, setDepartment] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Kategorileri getir
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/equipment_categories");

      if (!response.ok) {
        throw new Error("Kategoriler yüklenemedi!");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Kategorileri yüklerken hata oluştu:", error);
    }
  };

  // ✅ Yeni ekipman ekleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      name,
      category_id: Number(selectedCategory), // Backend kategori_id bekliyor olabilir
      status,
      department: Number(department)
    };

    console.log("Gönderilen Veri:", requestData); // Konsolda kontrol et

    try {
      const response = await fetch("http://127.0.0.1:5000/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Ekipman eklenemedi!");
      }

      alert("Ekipman başarıyla eklendi!");
    } catch (error) {
      console.error("Ekipman ekleme hatası:", error);
    }
  };

  return (
    <div>
      <h2>Yeni Ekipman Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ekipman Adı:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Kategori:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Kategori Seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Durum:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="available">Müsait</option>
            <option value="in_use">Kullanımda</option>
          </select>
        </div>
        <div>
          <label>Departman ID:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
};

export default AddEquipment;
