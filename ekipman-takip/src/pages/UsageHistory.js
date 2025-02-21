import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/usage_history";
const USERS_API = "http://127.0.0.1:5000/api/users";
const EQUIPMENT_API = "http://127.0.0.1:5000/api/equipment";

const UsageHistory = () => {
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const [newUsage, setNewUsage] = useState({
    user_id: "",
    equipment_id: "",
    start_time: "",
  });
  const [editUsage, setEditUsage] = useState(null);

  useEffect(() => {
    fetchUsageHistory();
    fetchUsers();
    fetchEquipments();
  }, []);

  // Kullanım geçmişini API'den çek
  const fetchUsageHistory = async () => {
    try {
      const response = await axios.get(API_URL);
      setHistory(response.data);
    } catch (err) {
      console.error("Kullanım geçmişi yüklenemedi!", err);
      setError("Kullanım geçmişi yüklenemedi: " + err.message);
    }
  };

  // Kullanıcı listesini API'den çek
  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API);
      setUsers(response.data);
    } catch (err) {
      console.error("Kullanıcılar yüklenemedi!", err);
    }
  };

  // Ekipman listesini API'den çek
  const fetchEquipments = async () => {
    try {
      const response = await axios.get(EQUIPMENT_API);
      setEquipments(response.data);
    } catch (err) {
      console.error("Ekipmanlar yüklenemedi!", err);
    }
  };

  // Kullanım geçmişine yeni kayıt ekleme
  const addUsageHistory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newUsage);
      fetchUsageHistory();
      setNewUsage({ user_id: "", equipment_id: "", start_time: "" });
    } catch (err) {
      console.error("Ekleme işlemi başarısız!", err);
      setError(`Ekleme işlemi başarısız: ${err.response?.data?.error || err.message}`);
    }
  };

  // Kullanım geçmişini güncelleme
  const updateUsageHistory = async (e) => {
    e.preventDefault();
    if (!editUsage.id) {
      setError("Güncellenecek kayıt seçilmedi!");
      return;
    }
    try {
      await axios.put(`${API_URL}/${editUsage.id}`, editUsage);
      fetchUsageHistory();
      setEditUsage(null);
    } catch (err) {
      console.error("Güncelleme işlemi başarısız!", err);
      setError(`Güncelleme işlemi başarısız: ${err.response?.data?.error || err.message}`);
    }
  };

  // Kullanım geçmişini silme
  const deleteUsageHistory = async (id) => {
    if (window.confirm("Bu kullanım kaydını silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsageHistory();
      } catch (err) {
        console.error("Silme işlemi başarısız!", err);
        setError(`Silme işlemi başarısız: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Kullanım Geçmişi</h2>

      {/* Kullanım Geçmişi Ekleme Formu */}
      <form onSubmit={addUsageHistory}>
        <select
          value={newUsage.user_id}
          onChange={(e) => setNewUsage({ ...newUsage, user_id: e.target.value })}
          required
        >
          <option value="">Kullanıcı Seçin</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>

        <select
          value={newUsage.equipment_id}
          onChange={(e) => setNewUsage({ ...newUsage, equipment_id: e.target.value })}
          required
        >
          <option value="">Ekipman Seçin</option>
          {equipments.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} (ID: {eq.id})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={newUsage.start_time}
          onChange={(e) => setNewUsage({ ...newUsage, start_time: e.target.value })}
          required
        />
        <button type="submit">Ekle</button>
      </form>

      {/* Kullanım Geçmişi Güncelleme Formu */}
      {editUsage && (
        <form onSubmit={updateUsageHistory}>
          <input
            type="datetime-local"
            value={editUsage.end_time || ""}
            onChange={(e) => setEditUsage({ ...editUsage, end_time: e.target.value })}
            required
          />
          <select
            value={editUsage.returned}
            onChange={(e) => setEditUsage({ ...editUsage, returned: e.target.value })}
          >
            <option value="0">İade Edilmedi</option>
            <option value="1">İade Edildi</option>
          </select>
          <button type="submit">Güncelle</button>
          <button type="button" onClick={() => setEditUsage(null)}>İptal</button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Kullanım Geçmişi Listesi */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>Ekipman Adı</th>
            <th>Başlangıç Zamanı</th>
            <th>Bitiş Zamanı</th>
            <th>İade Durumu</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => {
            const user = users.find((u) => u.id === record.user_id);
            const equipment = equipments.find((eq) => eq.id === record.equipment_id);
            return (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{user ? user.username : "Bilinmiyor"}</td>
                <td>{equipment ? equipment.name : "Bilinmiyor"}</td>
                <td>{record.start_time}</td>
                <td>{record.end_time || "Devam Ediyor"}</td>
                <td>{record.returned ? "İade Edildi" : "İade Edilmedi"}</td>
                <td>
                  <button onClick={() => setEditUsage(record)}>Düzenle</button>
                  <button onClick={() => deleteUsageHistory(record.id)}>Sil</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsageHistory;
