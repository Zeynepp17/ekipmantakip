import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_hash: "",
  });

  const navigate = useNavigate();

  // Input değişikliklerini yönet
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kullanıcı ekleme isteği
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", formData);
      alert("Kullanıcı başarıyla eklendi!");
      navigate("/users"); // Kullanıcı listesini görmek için yönlendir
    } catch (err) {
      console.error("Ekleme hatası:", err);
      alert("Kullanıcı eklenirken hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Kullanıcı Ekle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          value={formData.username}
          onChange={handleChange}
          required
          className="p-2 border mb-2"
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-2 border mb-2"
        />
        <input
          type="password"
          name="password_hash"
          placeholder="Şifre"
          value={formData.password_hash}
          onChange={handleChange}
          required
          className="p-2 border mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Kullanıcı Ekle
        </button>
      </form>
    </div>
  );
};

export default AddUser;
