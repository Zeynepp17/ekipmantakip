from flask import Blueprint, request, jsonify
from database import get_db_connection
import traceback
import pymysql.cursors  # MySQL için DictCursor kullanımı

equipment_routes = Blueprint("equipment_routes", __name__, url_prefix="/api/equipment")



# Tüm ekipmanları listeleyen API (GET /api/equipment)
@equipment_routes.route('/', methods=['GET'])
def get_all_equipment():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
        cursor.execute("""
                SELECT e.id, e.name, c.category_name AS category, e.status, e.department_id, e.created_at
                FROM equipment e
                LEFT JOIN equipment_categories c ON e.category_id = c.id
            """)

        equipment = cursor.fetchall()
        conn.close()

        if not equipment:
            return jsonify({"error": "Hiçbir ekipman bulunamadı!"}), 404

        return jsonify(equipment)

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500
@equipment_routes.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT id, category_name FROM equipment_categories")
        categories = cursor.fetchall()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
            conn.close()



# Yeni ekipman ekleyen API (POST /api/equipment)
@equipment_routes.route('/', methods=['POST'])
def add_equipment():
    try:
        data = request.json
        print(" Backend'e Gelen Veri:", data)  # Debug için gelen veriyi yazdır

        #  Eksik veri kontrolü
        required_fields = ["name", "category_id", "status", "department"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Eksik veri! Eksik alanlar: {', '.join(missing_fields)}"}), 400

        #  Sayısal değerleri doğru formatta mı kontrol et
        try:
            category_id = int(data["category_id"])  # Eğer string gelirse int'e çevir
            department_id = int(data["department"])  # Burada department_id yerine department gelmiş olabilir!
        except ValueError:
            return jsonify({"error": "category_id ve department ID sayısal olmalıdır!"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        #  Aynı isimde ekipman var mı kontrol et
        cursor.execute("SELECT * FROM equipment WHERE name = %s", (data["name"],))
        existing_equipment = cursor.fetchone()
        if existing_equipment:
            conn.close()
            return jsonify({"error": "Bu isimde bir ekipman zaten mevcut!"}), 409

        #  Ekipmanı ekle
        cursor.execute("""
            INSERT INTO equipment (name, category_id, status, department_id, created_at) 
            VALUES (%s, %s, %s, %s, NOW())
        """, (data["name"], category_id, data["status"], department_id))
        conn.commit()
        conn.close()

        return jsonify({"message": "Ekipman başarıyla eklendi!"}), 201

    except Exception as e:
        print(" HATA:", str(e))
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
# Tek bir ekipmanı getiren API (GET /api/equipment/<equipment_id>)
@equipment_routes.route('/<int:equipment_id>', methods=['GET'])
def get_equipment(equipment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        cursor.execute("""
            SELECT e.id, e.name, c.category_name AS category, e.status, e.department_id, e.created_at
            FROM equipment e
            LEFT JOIN equipment_categories c ON e.category_id = c.id
            WHERE e.id = %s
        """, (equipment_id,))

        equipment = cursor.fetchone()
        conn.close()

        if not equipment:
            return jsonify({"error": "Ekipman bulunamadı!"}), 404

        return jsonify(equipment), 200

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata oluştu: {str(e)}"}), 500
