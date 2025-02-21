from flask import Blueprint, request, jsonify
from database import get_db_connection
import pymysql.cursors  # DictCursor için ekledik
import traceback  # Hata logları için

maintenance_routes = Blueprint("maintenance_routes", __name__)

# Bakım Kaydını Al (GET /api/maintenance/<equipment_id>)
@maintenance_routes.route('/<int:equipment_id>', methods=['GET'])
def get_maintenance(equipment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Ekipmana ait bakım kayıtlarını al
        cursor.execute("SELECT * FROM maintenance WHERE equipment_id = %s", (equipment_id,))
        maintenance_records = cursor.fetchall()
        conn.close()

        if maintenance_records:
            return jsonify(maintenance_records), 200
        else:
            return jsonify({"error": "Bu ekipman için bakım kaydı bulunamadı!"}), 404

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500


# Yeni Bakım Kaydı Ekleme (POST /api/maintenance)
@maintenance_routes.route('', methods=['POST'])
def add_maintenance():
    try:
        data = request.json
        equipment_id = data.get("equipment_id")
        maintenance_date = data.get("maintenance_date")
        description = data.get("description")

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Yeni bakım kaydını ekle
        cursor.execute("INSERT INTO maintenance (equipment_id, maintenance_date, description) VALUES (%s, %s, %s)",
                       (equipment_id, maintenance_date, description))
        conn.commit()
        conn.close()

        return jsonify({"message": "Bakım kaydı başarıyla eklendi"}), 201

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Bakım Kaydını Güncelleme (PUT /api/maintenance/<int:id>)
@maintenance_routes.route('/<int:id>', methods=['PUT'])
def update_maintenance(id):
    try:
        data = request.json
        maintenance_date = data.get("maintenance_date")
        description = data.get("description")

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Bakım kaydını güncelle
        cursor.execute("UPDATE maintenance SET maintenance_date = %s, description = %s WHERE id = %s",
                       (maintenance_date, description, id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Bakım kaydı başarıyla güncellendi"}), 200

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Bakım Kaydını Silme (DELETE /api/maintenance/<int:id>)
@maintenance_routes.route('/<int:id>', methods=['DELETE'])
def delete_maintenance(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Bakım kaydının olup olmadığını kontrol et
        cursor.execute("SELECT * FROM maintenance WHERE id = %s", (id,))
        maintenance_record = cursor.fetchone()

        if not maintenance_record:
            conn.close()
            return jsonify({"error": "Böyle bir bakım kaydı bulunamadı!"}), 404

        # Bakım kaydını sil
        cursor.execute("DELETE FROM maintenance WHERE id = %s", (id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Bakım kaydı başarıyla silindi"}), 200

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
