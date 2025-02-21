import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // JWT Token'ı çözmek için

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Kullanıcı giriş yapmamış!");
        console.error("HATA: Token bulunamadı.");
        return;
      }

      try {
        console.log(" Kayıtlı Token:", token);
        
        //  Token içinden kullanıcı ID'sini al
        const decodedToken = jwtDecode(token);
        console.log(" Çözülen Token:", decodedToken);

        const userId = decodedToken.sub; // API içinde "user_id" olarak kaydedildi
        console.log(" Kullanıcı ID:", userId);

        if (!userId) {
          setError("HATA: Kullanıcı ID bulunamadı!");
          return;
        }

        //  API isteği gönder
        const response = await fetch(`http://127.0.0.1:5000/api/auth/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log(" API Yanıt Kodu:", response.status);
        
        const data = await response.json();
        console.log(" API Yanıtı:", data);

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || "Bilgiler çekilemedi!");
        }
      } catch (error) {
        console.error("Bağlantı hatası:", error);
        setError("Bağlantı hatası!");
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Profil Bilgileri</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : user ? (
        <div>
          <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
};

export default Profile;
