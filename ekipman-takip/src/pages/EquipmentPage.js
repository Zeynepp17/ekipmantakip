import { useState } from "react";
import EquipmentList from "../components/EquipmentList";
import AddEquipment from "../components/AddEquipment";

const EquipmentPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>Ekipman Yönetimi</h1>
      <AddEquipment refreshList={() => setRefresh(!refresh)} />
      <EquipmentList key={refresh} />
    </div>
  );
};

export default EquipmentPage;
