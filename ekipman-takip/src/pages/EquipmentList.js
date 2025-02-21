import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/equipment";

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEquipment, setEditEquipment] = useState(null); // Güncelleme için seçilen ekipman

  useEffect(() => {
    fetchEquipments();
  }, []);

  // API'den ekipmanları çekme fonksiyonu
  const fetchEquipments = async () => {
    try {
      const response = await axios.get(API_URL);
      setEquipments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Ekipmanlar yüklenemedi!");
      setLoading(false);
    }
  };

  // Ekipman Silme
  const deleteEquipment = async (id) => {
    if (window.confirm("Bu ekipmanı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setEquipments(equipments.filter(eq => eq.id !== id));
      } catch (err) {
        setError("Silme işlemi başarısız!");
      }
    }
  };

  // Güncelleme işlemi için form submit
  const handleUpdateEquipment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/${editEquipment.id}`,
        editEquipment,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      setEquipments(equipments.map(eq => (eq.id === editEquipment.id ? editEquipment : eq)));
      setEditEquipment(null);
    } catch (err) {
      setError("Güncelleme işlemi başarısız!");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Ekipman Listesi</h2>

      {/* Güncelleme Formu */}
      {editEquipment && (
        <form onSubmit={handleUpdateEquipment} className="mb-4">
          <h3>Ekipman Güncelle</h3>
          <input
            type="text"
            value={editEquipment.name}
            onChange={(e) => setEditEquipment({ ...editEquipment, name: e.target.value })}
            required
          />
          <button type="submit">Güncelle</button>
          <button type="button" onClick={() => setEditEquipment(null)}>İptal</button>
        </form>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Tür</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((eq) => (
            <tr key={eq.id}>
              <td>{eq.id}</td>
              <td>{eq.name}</td>
              <td>{eq.type}</td>
              <td>{eq.status === "available" ? "Müsait" : "Kullanımda"}</td>
              <td>
                <button onClick={() => setEditEquipment(eq)}>Düzenle</button>
                <button onClick={() => deleteEquipment(eq.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;
