
import pymysql
from werkzeug.security import generate_password_hash

# 📌 Veritabanı bağlantısı
conn = pymysql.connect(host="localhost", user="root", password="", database="ekipman_takip", charset="utf8mb4")
cursor = conn.cursor()

# 📌 Tüm kullanıcıları çek
cursor.execute("SELECT id, username, password_hash FROM users")
users = cursor.fetchall()

for user in users:
    user_id = user[0]
    username = user[1]
    password = user[2]

    # 📌 Eğer şifre zaten hash'lenmişse güncelleme yapma
    if password.startswith("scrypt"):
        print(f"🚀 {username} zaten hash'lenmiş, atlanıyor...")
        continue

    # 📌 Yeni hash üret
    hashed_password = generate_password_hash(password)
    print(f"🔄 Güncelleniyor: {username} -> {hashed_password}")

    # 📌 Veritabanında güncelle
    cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (hashed_password, user_id))
    conn.commit()

cursor.close()
conn.close()
print("✅ Tüm kullanıcı şifreleri başarıyla hash'lendi!")
