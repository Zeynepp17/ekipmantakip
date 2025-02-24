from flask import Blueprint, jsonify
import pymysql
import os

category_routes = Blueprint('category_routes', __name__)

# ✅ Güvenli MySQL bağlantı fonksiyonu (Çevresel değişkenlerle şifre saklama)
def get_db_connection():
    try:
        connection = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),  # .env veya varsayılan localhost
            user=os.getenv("DB_USER", "root"),  # Kullanıcı adı
            password=os.getenv("DB_PASSWORD", ""),  # Şifre (Boş bırakılmışsa elle ekleyin)
            database=os.getenv("DB_NAME", "ekipman_takip"),  # Veritabanı adı
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"❌ Veritabanı bağlantı hatası: {e}")
        return None

# ✅ Kategorileri getiren API route'u
@category_routes.route('/equipment_categories', methods=['GET'])
def get_categories():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Veritabanına bağlanılamadı"}), 500

    try:
        with connection.cursor() as cursor:
            sql = "SELECT id, category_name FROM equipment_categories"
            cursor.execute(sql)
            categories = cursor.fetchall()
        
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()  # ✅ Her durumda bağlantıyı kapatıyoruz
