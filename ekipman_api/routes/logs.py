from flask import Blueprint, jsonify , request
from database import get_db_connection
import traceback
import pymysql.cursors  # MySQL icin DictCursor

logs_routes = Blueprint("logs_routes", __name__)
#GET METHODU (LOG KAYIDI LISTELEME)
@logs_routes.route('/', methods=['GET'])
def get_all_logs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)  # DictCursor Kullanildi
        cursor.execute("SELECT id, user_id, action, action_timestamp FROM logs")
        logs = cursor.fetchall()
        conn.close()

        print("VERITABANINDAN GELEN LOG KAYITLARI:", logs)

        if not logs:
            return jsonify({"error": "Log bulunamadı!"}), 404

        log_list = []
        for index, row in enumerate(logs):
            try:
                print(f"Islenen Satir {index}: {row}")

                log_dict = {
                    "id": row.get("id"),
                    "user_id": row.get("user_id"),
                    "action": row.get("action"),
                    "action_timestamp": str(row.get("action_timestamp")) if row.get("action_timestamp") else None
                }
                log_list.append(log_dict)
            except Exception as e:
                print(f" HATA - Satır {index} işlenirken hata oluştu: {e}")
                print(traceback.format_exc())
                return jsonify({"error": f"Satır {index} işlenirken hata oluştu: {e}"}), 500

        print("JSON VERİSİ:", log_list)
        return jsonify(log_list)

    except Exception as e:
        print("**GENEL HATA OLUSTU!**")
        print(traceback.format_exc())
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500
#POST METHODU (LOG KAYIDI EKLEME)
@logs_routes.route('/', methods= ["POST"])
def add_log():
    try :
        data = request.json 
        print (" Gelen veri:" , data)

        if not data or "user_id" not in data or "action" not in data or "action_timestamp" not in data:
            return jsonify({"error": "Eksik veri! 'user_id', 'action' ve 'action_timestamp' gerekli."}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)  # DictCursor Kullanıldı
        
        cursor.execute("""
             INSERT INTO logs (user_id, action, action_timestamp) 
            VALUES (%s, %s, %s)
        """, (data["user_id"], data["action"], data["action_timestamp"]))
        conn.commit()
        
        # Yeni eklenen log'u almak için tekrar sorgu yapalım
        log_id = cursor.lastrowid
        cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
        new_log = cursor.fetchone()
        
        conn.close()

        print("Yeni Log Kaydedildi:", new_log)
        return jsonify({"message": "Log başarıyla eklendi", "log": new_log}), 201

    except Exception as e:
        print("**HATA OLUŞTU!**")
        print(traceback.format_exc())  # Hata detaylarını terminale yaz
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500
 
 #PUT METHODU(LOG GUNCELLEME)
@logs_routes.route('/<int:log_id>', methods = ["PUT"])
def update_log(log_id):
    try:
        data = request.json  # Gelen JSON verisini al
        print(f"Guncellenecek Log ID: {log_id}, Gelen Veri: {data}")

        if not data or "user_id" not in data or "action" not in data or "action_timestamp" not in data:
            return jsonify({"error": "Eksik veri! 'user_id', 'action' ve 'action_timestamp' gerekli."}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

        # Guncellenecek log var mı kontrol edelim
        cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
        existing_log = cursor.fetchone()

        if not existing_log:
            print(f"Guncellenmek istenen log bulunamadi! Log ID: {log_id}")
            conn.close()
            return jsonify({"error": "Güncellenmek istenen log bulunamadı!"}), 404

        # Güncelleme sorgusunu çalıştır
        cursor.execute("""
            UPDATE logs 
            SET user_id = %s, action = %s, action_timestamp = %s 
            WHERE id = %s
        """, (data["user_id"], data["action"], data["action_timestamp"], log_id))
        conn.commit()

        # Güncellenen log'u tekrar çekelim
        cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
        updated_log = cursor.fetchone()

        conn.close()

        print("Log Başarıyla Güncellendi:", updated_log)
        return jsonify({"message": "Log başarıyla güncellendi", "log": updated_log})

    except Exception as e:
        print("**HATA OLUŞTU!**")
        print(traceback.format_exc())  # Hata detaylarını terminale yaz
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500
    
    #DELETE METHODU (LOG KAYDINI SİL)
@logs_routes.route('/<int:log_id>', methods=['DELETE'])
def delete_log(log_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

        # Silinecek log'u kontrol et
        cursor.execute("SELECT * FROM logs WHERE id = %s", (log_id,))
        existing_log = cursor.fetchone()

        if not existing_log:
            conn.close()
            return jsonify({"error": "Silinecek log bulunamadı!"}), 404

        # Log'u sil
        cursor.execute("DELETE FROM logs WHERE id = %s", (log_id,))
        conn.commit()
        conn.close()

        print(f"Log ID {log_id} başarıyla silindi.")
        return jsonify({"message": f"Log ID {log_id} başarıyla silindi."})

    except Exception as e:
        print("**HATA OLUŞTU!**")
        print(traceback.format_exc())  # Hata detaylarını terminale yazdır
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500

    
  