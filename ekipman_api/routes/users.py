from flask import Blueprint, request, jsonify
from database import get_db_connection
import pymysql.cursors  # DictCursor için ekledik
import traceback  # Hata logları için

from flask import Blueprint

user_routes = Blueprint("user_routes", __name__, url_prefix="/api/users")


# Kullanıcıları Listeleyen API (GET /api/users)
@user_routes.route("/", methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)  # DictCursor ekledik
        cursor.execute("SELECT id, username, email FROM users")
        users = cursor.fetchall()
        conn.close()

        print(" Veritabanından gelen kullanıcılar:", users)
        print("GET request made to /api/users/")

        return jsonify(users) 

    except Exception as e:
        print(" HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500


# Yeni Kullanıcı Ekleme (POST /api/users)
@user_routes.route('/', methods=['POST'])
def add_users():
    try:
        data = request.json
        if "username" not in data or "email" not in data:
            return jsonify({"error": "Eksik veri! 'username' ve 'email' zorunludur."}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        password_hash = data.get("password_hash", "")
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                       (data["username"], data["email"], data["password_hash"]))
        conn.commit()
        conn.close()
        return jsonify({"message": "Kullanıcı başarıyla eklendi"})

    except Exception as e:
        print(" HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Kullanıcı Güncelleme (PUT /api/users/<user_id>)
@user_routes.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        username = data.get("username")  # username zorunlu
        email = data.get("email")  # email zorunlu
        password_hash = data.get("password_hash", None)  # Eğer şifre yoksa None al

        if not username or not email:
            return jsonify({"error": "Kullanıcı adı ve e-posta zorunludur!"}), 400

        # Eğer `password_hash` gelmemişse, şifreyi güncellemeden SQL çalıştır
        if password_hash:
            query = "UPDATE users SET username=%s, email=%s, password_hash=%s WHERE id=%s"
            values = (username, email, password_hash, user_id)
        else:
            query = "UPDATE users SET username=%s, email=%s WHERE id=%s"
            values = (username, email, user_id)

        cursor.execute(query, values)


       #cursor.execute("UPDATE users SET username=%s, email=%s, password_hash=%s WHERE id=%s",
                      #(data["username"], data["email"], data["password_hash"], user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Kullanıcı başarıyla güncellendi"})

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Kullanıcı Silme (DELETE /api/users/<user_id>)
@user_routes.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Kullanıcının olup olmadığını kontrol et
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({"error": "Böyle bir kullanıcı bulunamadı!"}), 404

        # Kullanıcıyı sil
        cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Kullanıcı başarıyla silindi"})

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
