import React, { useState } from "react";

const UserCreate = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password, role })
      });

      if (!response.ok) throw new Error("Kullanıcı eklenemedi!");

      alert("Kullanıcı başarıyla eklendi!");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div>
      <h2>Yeni Kullanıcı Ekle</h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Rol" value={role} onChange={(e) => setRole(e.target.value)} required />
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
};

export default UserCreate;
