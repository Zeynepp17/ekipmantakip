from flask import Blueprint, request, jsonify
from database import get_db_connection
import pymysql.cursors
import traceback
from flask_cors import CORS

usage_history_routes = Blueprint("usage_history_routes", __name__)
CORS(usage_history_routes, resources={r"/*": {"origins": "*"}})

# Kullanım Geçmişini Getir (GET)
@usage_history_routes.route('/', methods=['GET'])
def get_all_usage_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Tüm kullanım geçmişini getir
        cursor.execute("SELECT * FROM usage_history")
        usage_records = cursor.fetchall()
        conn.close()

        return jsonify(usage_records), 200

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500


# Kullanım Kaydı Ekle (POST)
@usage_history_routes.route('/', methods=['POST'])
def add_usage_history():
    try:
        data = request.json
        user_id = data.get("user_id")
        equipment_id = data.get("equipment_id")
        start_time = data.get("start_time")
        end_time = data.get("end_time", None)
        returned = data.get("returned", 0)  

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        user_exists = cursor.fetchone()
        if not user_exists:
            return jsonify({"error": "Girilen kullanıcı ID veritabanında bulunamadı!"}), 400

        # Ekipman var mı kontrol et
        cursor.execute("SELECT id FROM equipment WHERE id = %s", (equipment_id,))
        equipment_exists = cursor.fetchone()
        if not equipment_exists:
            return jsonify({"error": "Girilen ekipman ID veritabanında bulunamadı!"}), 400

        cursor.execute("""
            INSERT INTO usage_history (user_id, equipment_id, start_time, end_time, returned) 
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, equipment_id, start_time, end_time, returned))
        conn.commit()
        conn.close()

        return jsonify({"message": "Kullanım kaydı başarıyla eklendi!"}), 201

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Kullanım Kaydını Güncelle (PUT)
@usage_history_routes.route('/<int:id>', methods=['PUT'])
def update_usage_history(id):
    try:
        data = request.json
        end_time = data.get("end_time")
        returned = data.get("returned")

        conn = get_db_connection()
        cursor = conn.cursor()

        update_fields = []
        update_values = []

        if end_time is not None:
            update_fields.append("end_time = %s")
            update_values.append(end_time)
        if returned is not None:
            update_fields.append("returned = %s")
            update_values.append(returned)

        if update_fields:
            update_values.append(id)
            cursor.execute(f"UPDATE usage_history SET {', '.join(update_fields)} WHERE id = %s", tuple(update_values))
            conn.commit()

        conn.close()

        return jsonify({"message": "Kullanım kaydı başarıyla güncellendi"}), 200

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Kullanım Kaydını Sil (DELETE)
@usage_history_routes.route('/<int:id>', methods=['DELETE'])
def delete_usage_history(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM usage_history WHERE id = %s", (id,))
        usage_record = cursor.fetchone()

        if not usage_record:
            conn.close()
            return jsonify({"error": "Böyle bir kullanım kaydı bulunamadı!"}), 404

        cursor.execute("DELETE FROM usage_history WHERE id = %s", (id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Kullanım kaydı başarıyla silindi!"}), 200

    except Exception as e:
        print("HATA:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# CORS için OPTIONS isteğini kabul et
@usage_history_routes.route('', methods=['OPTIONS'])
def usage_history_options():
    return jsonify({"message": "OPTIONS is allowed"}), 200
