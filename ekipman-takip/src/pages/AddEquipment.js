import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/equipment";

const AddEquipment = () => {
  const [equipment, setEquipment] = useState({
    name: "",
    category_id: "",
    status: "available", // Varsayılan olarak "müsait"
    department_id: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/`,  //  Sonuna "/" ekledik
        equipment,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      alert("Ekipman başarıyla eklendi!");
      setEquipment({ name: "", category_id: "", status: "available", department_id: "" });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Bu isimde bir ekipman zaten mevcut!");
      } else {
        setError("Ekleme işlemi başarısız!");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ekipman Ekle</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Ekipman Adı"
          value={equipment.name}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          type="number"
          name="category_id"
          placeholder="Kategori ID"
          value={equipment.category_id}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <select name="status" value={equipment.status} onChange={handleChange} className="border p-2">
          <option value="available">Müsait</option>
          <option value="in-use">Kullanımda</option>
        </select>
        <input
          type="number"
          name="department_id"
          placeholder="Departman ID"
          value={equipment.department_id}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Ekle</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddEquipment;
