import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Yetkilendirme hatası: Token bulunamadı!");
        return;
      }

      console.log("📌 Kullanıcıları çekmeye çalışıyorum...");
      const response = await fetch("http://127.0.0.1:5000/api/auth/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Kullanıcıları çekerken hata oluştu!");

      const data = await response.json();
      console.log("📌 Kullanıcı Listesi:", data);
      setUsers(data);
    } catch (error) {
      console.error("❌ Kullanıcıları çekerken hata oluştu:", error);
      setError("Bağlantı hatası!");
    }
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

        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Silme hatası:", error);
        setError("Silme işlemi başarısız!");
      }
    }
  };

  return (
    <div>
      <h2>Kullanıcı Listesi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
                <Link to={`/users/edit/${user.id}`}><button>Düzenle</button></Link>
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
