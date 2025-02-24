import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserEdit = () => {
  const { userId } = useParams(); // URL'den kullanıcı ID'sini al
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    role_id: "" // Kullanıcıya atanacak rol
  });

  const [roles, setRoles] = useState([]); // Rolleri tutacak state

  //  Kullanıcı bilgilerini çek
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/auth/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(" Güncellenecek Kullanıcı:", data);
        setUser({
          username: data.username,
          email: data.email,
          role_id: data.role_id || "" // Eğer rol yoksa boş bırak
        });
      })
      .catch(err => console.error("Kullanıcı bilgisi çekilemedi:", err));
  }, [userId]);

  //  Kullanıcı rolleri için API çağrısı
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

  //  Kullanıcı güncelleme fonksiyonu
  const handleUpdate = async () => {
    const updatedUser = {
      username: user.username,
      email: user.email,
      role_id: user.role_id
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedUser)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Kullanıcı başarıyla güncellendi!");
        navigate("/dashboard/users");
      } else {
        alert("Hata oluştu: " + data.error);
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  return (
    <div>
      <h2>Kullanıcı Düzenle</h2>
      <label>Kullanıcı Adı:</label>
      <input
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <label>Email:</label>
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <label>Rol:</label>
      <select
        value={user.role_id}
        onChange={(e) => setUser({ ...user, role_id: e.target.value })}
      >
        <option value="">Rol Seç</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role_name}
          </option>
        ))}
      </select>

      <button onClick={handleUpdate}>Güncelle</button>
    </div>
  );
};

export default UserEdit;
