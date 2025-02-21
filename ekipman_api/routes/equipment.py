from flask import Blueprint, request, jsonify
from database import get_db_connection
import traceback
import pymysql.cursors  # MySQL için DictCursor kullanımı

equipment_routes = Blueprint("equipment_routes", __name__)

# Tüm ekipmanları listeleyen API (GET /api/equipment)
@equipment_routes.route('/', methods=['GET'])
def get_all_equipment():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
        cursor.execute("SELECT id, name, category_id, status, department_id, created_at FROM equipment")
        equipment = cursor.fetchall()
        conn.close()

        if not equipment:
            return jsonify({"error": "Hiçbir ekipman bulunamadı!"}), 404

        return jsonify(equipment)

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500


# Yeni ekipman ekleyen API (POST /api/equipment)
@equipment_routes.route('/', methods=['POST'])
def add_equipment():
    try:
        data = request.json

        if not data or "name" not in data or "category_id" not in data or "status" not in data or "department_id" not in data:
            return jsonify({"error": "Eksik veri! 'name', 'category_id', 'status' ve 'department_id' zorunludur."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM equipment WHERE name = %s", (data["name"],))
        existing_equipment = cursor.fetchone()
        if existing_equipment:
            return jsonify({"error": "Bu isimde bir ekipman zaten mevcut!"}), 409
        
        cursor.execute("""
            INSERT INTO equipment (name, category_id, status, department_id, created_at) 
            VALUES (%s, %s, %s, %s, NOW())
        """, (data["name"], data["category_id"], data["status"], data["department_id"]))
        conn.commit()
        conn.close()

        return jsonify({"message": "Ekipman başarıyla eklendi!"})

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500


# Ekipman güncelleme API (PUT /api/equipment/<equipment_id>)
@equipment_routes.route('/<int:equipment_id>', methods=['PUT'])
def update_equipment(equipment_id):
    try:
        data = request.json

        if not data or "name" not in data or "category_id" not in data or "status" not in data or "department_id" not in data:
            return jsonify({"error": "Eksik veri! 'name', 'category_id', 'status' ve 'department_id' zorunludur."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Güncellenecek ekipman var mı kontrol et
        cursor.execute("SELECT * FROM equipment WHERE id = %s", (equipment_id,))
        existing_equipment = cursor.fetchone()

        if not existing_equipment:
            conn.close()
            return jsonify({"error": "Güncellenmek istenen ekipman bulunamadı!"}), 404

        cursor.execute("""
            UPDATE equipment 
            SET name = %s, category_id = %s, status = %s, department_id = %s
            WHERE id = %s
        """, (data["name"], data["category_id"], data["status"], data["department_id"], equipment_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Ekipman başarıyla güncellendi!"})

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500


# Ekipman silme API (DELETE /api/equipment/<equipment_id>)
@equipment_routes.route('/<int:equipment_id>', methods=['DELETE'])
def delete_equipment(equipment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Silinecek ekipman var mı kontrol et
        cursor.execute("SELECT * FROM equipment WHERE id = %s", (equipment_id,))
        existing_equipment = cursor.fetchone()

        if not existing_equipment:
            conn.close()
            return jsonify({"error": "Silinmek istenen ekipman bulunamadı!"}), 404

        cursor.execute("DELETE FROM equipment WHERE id = %s", (equipment_id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Ekipman başarıyla silindi!"})

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500
