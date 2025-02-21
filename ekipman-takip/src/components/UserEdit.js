import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/auth/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error("Kullanıcı getirilemedi:", error));
  }, [id]);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Kullanıcı Düzenleme</h2>
      <p>Kullanıcı ID: {id}</p>
      <p>Kullanıcı Adı: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role_name}</p>
    </div>
  );
};

export default UserEdit;
