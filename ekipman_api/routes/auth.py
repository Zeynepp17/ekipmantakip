from flask import Blueprint, request, jsonify
from database import get_db_connection
import pymysql.cursors  # DictCursor için ekledik
import traceback  # Hata logları için
from werkzeug.security import generate_password_hash, check_password_hash  # Şifre hashleme
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity  # JWT için gerekli kütüphaneler
from flask_jwt_extended import get_jwt
auth_routes = Blueprint("auth_routes", __name__)

# ✅ Kullanıcı Girişi (POST /api/auth/login)
@auth_routes.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        # 🔍 Veritabanına bağlan
        with get_db_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            
            # 🔍 Kullanıcıyı veritabanında ara
            cursor.execute("""
                
                 SELECT u.id, u.username, u.password_hash, r.role_name 
                 FROM users u
                 LEFT JOIN user_roles ur ON u.id = ur.user_id
                 LEFT JOIN roles  r ON ur.role_id = r.id
                 WHERE u.username = %s
                 

            """, (username,))


            user = cursor.fetchone()

            if not user or not check_password_hash(user["password_hash"], password):
                return jsonify({"error": "Geçersiz kullanıcı adı veya şifre!"}), 401

            # Debug için hash ve gelen şifreyi yazdır
            print("Kullanıcı:" ,user)
            print(f"Kullanıcıdan gelen şifre: {password}")
            print(f"Veritabanındaki hash: {user['password_hash']}")

            # 🔐 Şifreyi doğrula
            if not check_password_hash(user['password_hash'], password):
                return jsonify({"error": "Geçersiz kullanıcı adı veya şifre!"}), 401

            # 🔑 JWT token oluştur
            access_token = create_access_token(
                identity=str(user["id"]),
                additional_claims={"role_name": user["role_name"]}
            )

        return jsonify({
            "message": "Giriş başarılı",
            "access_token": access_token,
            "role_name": user["role_name"],
            "user_id": user["id"]  # Kullanıcı ID'sini de frontend'e gönderiyoruz
        }), 200

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500


# ✅ Kullanıcı Kaydı (POST /api/auth/signup)
@auth_routes.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        
        # 🔐 Şifreyi hash'le
        password_hash = generate_password_hash(password)
        print(f"Hash'lenmiş şifre: {password_hash}")  # Debug için ekleyin

        # 🔍 Veritabanına bağlan
        with get_db_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)

            # 🔍 Kullanıcıyı veritabanında ara (aynı kullanıcı adıyla başka bir kullanıcı varsa)
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({"error": "Bu kullanıcı adı zaten alınmış!"}), 400

            # ✅ Yeni kullanıcıyı ekle
            cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                           (username, email, password_hash))
            conn.commit()

        return jsonify({"message": "Kullanıcı başarıyla kaydedildi"}), 201

    except Exception as e:
        print("HATA OLUŞTU:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        current_user_id = get_jwt_identity()
        claims = get_jwt()

        print(f"📌 Token'dan Gelen Kullanıcı ID: {current_user_id}")
        print(f"📌 Token'dan Gelen Rol: {claims.get('role_name')}")

        if claims.get("role_name") != "Depo Sorumlusu":
            return jsonify({"error": "Erişim izniniz yok!"}), 403

        with get_db_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            cursor.execute("""
                SELECT u.id, u.username, u.email, r.role_name 
                FROM users u
                LEFT JOIN user_roles ur ON u.id = ur.user_id
                LEFT JOIN roles r ON ur.role_id = r.id
            """)
            users = cursor.fetchall()
             
            print(f"Veritabanında Gelen Kullanıcılar: {users}")

        return jsonify(users), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Beklenmeyen hata: {str(e)}"}), 500
    
@auth_routes.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        current_user_id = get_jwt_identity()  # Token'dan gelen kullanıcı ID'si
        
        # Yalnızca adminlerin silme işlemi yapmasını sağla
        with get_db_connection() as conn:
            cursor = conn.cursor(pymysql.cursors.DictCursor)

            # Kullanıcının rolünü al
            cursor.execute("""
                SELECT r.role_name FROM users u
                LEFT JOIN user_roles ur ON u.id = ur.user_id
                LEFT JOIN roles r ON ur.role_id = r.id
                WHERE u.id = %s
            """, (current_user_id,))
            
            user_role = cursor.fetchone()
            if not user_role or user_role["role_name"] not in ["Depo Sorumlusu", "Yönetici"]:
                return jsonify({"error": "Yetkisiz işlem!"}), 403  # Yetkisiz işlem

            # Kullanıcıyı sil
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()

        return jsonify({"message": "Kullanıcı başarıyla silindi!"}), 200
    except Exception as e:
        print("HATA:", e)
        return jsonify({"error": "Kullanıcı silinirken hata oluştu!"}), 500



