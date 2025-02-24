import React, { useState, useEffect } from "react";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]); // Rolleri tutacak state
  const [selectedRole, setSelectedRole] = useState(""); // Seçilen rol

  // Rolleri API'den çek
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/auth/roles", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => setRoles(data))
    .catch(err => console.error("Rol listesi alınamadı:", err));
  }, []);

  const handleAddUser = async () => {
    const newUser = {
      username,
      email,
      password,
      role_id: selectedRole // Seçilen rol ID olarak gönderilecek
    };

    const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();
    if (response.ok) {
      alert("Kullanıcı başarıyla eklendi!");
    } else {
      alert("Hata oluştu: " + data.error);
    }
  };

  return (
    <div>
      <h2>Yeni Kullanıcı Ekle</h2>
      <input type="text" placeholder="Kullanıcı Adı" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="E-posta" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
      
      {/* 🔥 Rol Seçme Alanı */}
      <select onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="">Rol Seç</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>{role.role_name}</option>
        ))}
      </select>

      <button onClick={handleAddUser}>Kullanıcı Ekle</button>
    </div>
  );
};

export default AddUser;
