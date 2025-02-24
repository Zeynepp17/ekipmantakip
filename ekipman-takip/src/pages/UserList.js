import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://127.0.0.1:5000/api/auth/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("📌 Kullanıcı Listesi Güncellendi:", data);
        setUsers(data);
      })
      .catch(error => {
        console.error("❌ Kullanıcıları çekerken hata oluştu:", error);
      });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:5000/api/auth/users/${userId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Silme işlemi başarısız!");

        fetchUsers(); // 📌 Kullanıcı silindiğinde listeyi güncelle
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  return (
    <div>
      <h2>Kullanıcı Listesi</h2>
      <Link to="/users/create"><button>Yeni Kullanıcı Ekle</button></Link>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role_name}</td>
              <td>
                <Link to={`/dashboard/users/edit/${user.id}`}><button>Düzenle</button></Link>
                <button onClick={() => handleDelete(user.id)}>Sil</button>
              </td>
            </tr>
          )) : <tr><td colSpan="5">Kullanıcı bulunamadı.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
